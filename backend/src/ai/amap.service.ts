import { Injectable } from "@nestjs/common";

type Coordinates = {
  longitude: number;
  latitude: number;
  adcode?: string;
  formattedAddress?: string;
};

@Injectable()
export class AmapService {
  private readonly apiKey = process.env.AMAP_API_KEY;
  private readonly weatherUrl =
    process.env.AMAP_WEATHER_URL ||
    "https://restapi.amap.com/v3/weather/weatherInfo";
  private readonly geocodeUrl =
    process.env.AMAP_GEOCODE_URL || "https://restapi.amap.com/v3/geocode/geo";
  private readonly drivingRouteUrl =
    process.env.AMAP_DRIVING_ROUTE_URL ||
    "https://restapi.amap.com/v3/direction/driving";
  private readonly transitRouteUrl =
    process.env.AMAP_TRANSIT_ROUTE_URL ||
    "https://restapi.amap.com/v3/direction/transit/integrated";
  private readonly walkingRouteUrl =
    process.env.AMAP_WALKING_ROUTE_URL ||
    "https://restapi.amap.com/v3/direction/walking";
  private readonly poiTextUrl =
    process.env.AMAP_POI_TEXT_URL || "https://restapi.amap.com/v3/place/text";

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async geocode(address: string, city?: string): Promise<Coordinates | null> {
    if (!this.apiKey || !address) {
      return null;
    }

    const url = new URL(this.geocodeUrl);
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("address", address);
    if (city) {
      url.searchParams.set("city", city);
    }

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      geocodes?: Array<{
        location?: string;
        adcode?: string;
        formatted_address?: string;
      }>;
    };
    const geocode = data.geocodes?.[0];
    if (!geocode?.location) {
      return null;
    }

    const [longitude, latitude] = geocode.location.split(",").map(Number);
    return {
      longitude,
      latitude,
      adcode: geocode.adcode,
      formattedAddress: geocode.formatted_address,
    };
  }

  async getWeather(city: string) {
    const geocode = await this.geocode(city, city);
    if (!this.apiKey || !geocode?.adcode) {
      return null;
    }

    const url = new URL(this.weatherUrl);
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("city", geocode.adcode);
    url.searchParams.set("extensions", "base");

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      lives?: Array<{
        weather?: string;
        temperature?: string;
        humidity?: string;
        reporttime?: string;
        city?: string;
      }>;
    };

    const live = data.lives?.[0];
    if (!live) {
      return null;
    }

    return {
      city: live.city || city,
      weather: live.weather,
      temperature: live.temperature,
      humidity: live.humidity,
      reportTime: live.reporttime,
    };
  }

  async searchPlaces(city: string, keywords: string) {
    if (!this.apiKey || !city || !keywords) {
      return [];
    }

    const url = new URL(this.poiTextUrl);
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("city", city);
    url.searchParams.set("keywords", keywords);
    url.searchParams.set("output", "json");

    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as {
      pois?: Array<{
        name?: string;
        type?: string;
        address?: string;
        location?: string;
        tel?: string;
      }>;
    };

    return (data.pois || []).slice(0, 5).map((poi) => ({
      name: poi.name,
      type: poi.type,
      address: poi.address,
      location: poi.location,
      tel: poi.tel,
    }));
  }

  async compareRoutes(origin: string, destination: string, city?: string) {
    if (!this.apiKey || !origin || !destination) {
      return null;
    }

    const [originPoint, destinationPoint] = await Promise.all([
      this.geocode(origin, city),
      this.geocode(destination, city),
    ]);

    if (!originPoint || !destinationPoint) {
      return null;
    }

    const originParam = `${originPoint.longitude},${originPoint.latitude}`;
    const destinationParam = `${destinationPoint.longitude},${destinationPoint.latitude}`;

    const [driving, transit, walking] = await Promise.all([
      this.fetchRoute(this.drivingRouteUrl, originParam, destinationParam, "driving"),
      this.fetchRoute(this.transitRouteUrl, originParam, destinationParam, "transit"),
      this.fetchRoute(this.walkingRouteUrl, originParam, destinationParam, "walking"),
    ]);

    const routes = [driving, transit, walking].filter(Boolean).sort((a, b) => {
      return (a?.durationMinutes || 99999) - (b?.durationMinutes || 99999);
    });

    return {
      origin,
      destination,
      routes,
      recommended: routes[0] || null,
    };
  }

  private async fetchRoute(
    endpoint: string,
    origin: string,
    destination: string,
    mode: "driving" | "transit" | "walking",
  ) {
    const url = new URL(endpoint);
    url.searchParams.set("key", this.apiKey!);
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    url.searchParams.set("extensions", "base");

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Record<string, any>;
    if (mode === "transit") {
      const transit = data.route?.transits?.[0];
      if (!transit) {
        return null;
      }

      const durationSeconds = Number(transit.duration || 0);
      const distanceMeters = Number(transit.distance || 0);
      return {
        mode,
        distance: `${(distanceMeters / 1000).toFixed(1)} km`,
        duration: `${Math.round(durationSeconds / 60)} min`,
        durationMinutes: Math.round(durationSeconds / 60),
        cost: Number(transit.cost || 0),
      };
    }

    const path = data.route?.paths?.[0];
    if (!path) {
      return null;
    }

    const durationSeconds = Number(path.duration || 0);
    const distanceMeters = Number(path.distance || 0);
    return {
      mode,
      distance: `${(distanceMeters / 1000).toFixed(mode === "walking" ? 2 : 1)} km`,
      duration: `${Math.round(durationSeconds / 60)} min`,
      durationMinutes: Math.round(durationSeconds / 60),
      cost: Number(path.tolls || 0),
    };
  }
}
