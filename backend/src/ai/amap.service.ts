import { Injectable } from "@nestjs/common";
import type { ToolDefinition } from "./llm.service";

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

export const amapTools: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "获取目的地实时天气，包括温度、湿度、天气状况",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "城市名称，如'东京'、'北京'" },
        },
        required: ["city"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_attractions",
      description: "搜索目的地的热门景点和旅游活动",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string", description: "目的地城市或地区名称" },
        },
        required: ["destination"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_restaurants",
      description: "搜索目的地的餐厅和美食地点",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string", description: "目的地城市或地区名称" },
        },
        required: ["destination"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "compare_routes",
      description: "比较两个地点之间的出行方案（驾车/公共交通/步行），返回各方案的距离、耗时和费用",
      parameters: {
        type: "object",
        properties: {
          origin: { type: "string", description: "出发地地址或地标" },
          destination: { type: "string", description: "目的地地址或地标" },
          city: { type: "string", description: "所在城市名称（用于辅助定位）" },
        },
        required: ["origin", "destination"],
      },
    },
  },
];
