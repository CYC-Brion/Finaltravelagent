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

  // City name mapping for international cities
  // Maps common names to Chinese names for Amap compatibility
  private readonly cityNameMap: Record<string, { chinese: string; country: string }> = {
    // Japan
    tokyo: { chinese: "东京", country: "日本" },
    osaka: { chinese: "大阪", country: "日本" },
    kyoto: { chinese: "京都", country: "日本" },
    yokohama: { chinese: "横滨", country: "日本" },
    nagoya: { chinese: "名古屋", country: "日本" },
    sapporo: { chinese: "札幌", country: "日本" },
    fukuoka: { chinese: "福冈", country: "日本" },
    // South Korea
    seoul: { chinese: "首尔", country: "韩国" },
    busan: { chinese: "釜山", country: "韩国" },
    jeju: { chinese: "济州岛", country: "韩国" },
    // Thailand
    bangkok: { chinese: "曼谷", country: "泰国" },
    phuket: { chinese: "普吉岛", country: "泰国" },
    chiangmai: { chinese: "清迈", country: "泰国" },
    // USA
    "new york": { chinese: "纽约", country: "美国" },
    losangeles: { chinese: "洛杉矶", country: "美国" },
    sanfrancisco: { chinese: "旧金山", country: "美国" },
    newyork: { chinese: "纽约", country: "美国" },
    la: { chinese: "洛杉矶", country: "美国" },
    sf: { chinese: "旧金山", country: "美国" },
    // UK
    london: { chinese: "伦敦", country: "英国" },
    manchester: { chinese: "曼彻斯特", country: "英国" },
    // France
    paris: { chinese: "巴黎", country: "法国" },
    // Germany
    berlin: { chinese: "柏林", country: "德国" },
    munich: { chinese: "慕尼黑", country: "德国" },
    frankfurt: { chinese: "法兰克福", country: "德国" },
    // Italy
    rome: { chinese: "罗马", country: "意大利" },
    milan: { chinese: "米兰", country: "意大利" },
    venice: { chinese: "威尼斯", country: "意大利" },
    // Spain
    madrid: { chinese: "马德里", country: "西班牙" },
    barcelona: { chinese: "巴塞罗那", country: "西班牙" },
    // Singapore
    singapore: { chinese: "新加坡", country: "新加坡" },
    // Malaysia
    kualalumpur: { chinese: "吉隆坡", country: "马来西亚" },
    penang: { chinese: "槟城", country: "马来西亚" },
    // Vietnam
    hanoi: { chinese: "河内", country: "越南" },
    hochiminh: { chinese: "胡志明市", country: "越南" },
    saigon: { chinese: "胡志明市", country: "越南" },
    // Indonesia
    jakarta: { chinese: "雅加达", country: "印度尼西亚" },
    bali: { chinese: "巴厘岛", country: "印度尼西亚" },
    // Philippines
    manila: { chinese: "马尼拉", country: "菲律宾" },
    // Taiwan
    taipei: { chinese: "台北", country: "台湾" },
    kaohsiung: { chinese: "高雄", country: "台湾" },
    // China (already Chinese)
    beijing: { chinese: "北京", country: "中国" },
    shanghai: { chinese: "上海", country: "中国" },
    guangzhou: { chinese: "广州", country: "中国" },
    shenzhen: { chinese: "深圳", country: "中国" },
    hongkong: { chinese: "香港", country: "中国" },
    macau: { chinese: "澳门", country: "中国" },
    chengdu: { chinese: "成都", country: "中国" },
    hangzhou: { chinese: "杭州", country: "中国" },
    xian: { chinese: "西安", country: "中国" },
    suzhou: { chinese: "苏州", country: "中国" },
  };

  private normalizeCityName(city: string): { chinese: string; country: string } | null {
    if (!city) return null;

    const normalized = city.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "");

    // Check direct match
    if (this.cityNameMap[normalized]) {
      return this.cityNameMap[normalized];
    }

    // Check if the input already contains Chinese characters
    const chineseRegex = /[一-龥]/;
    if (chineseRegex.test(city)) {
      return { chinese: city.trim(), country: "" };
    }

    return null;
  }

  private async isValidChineseCity(city: string): Promise<boolean> {
    // If the city is already in Chinese and Amap returns valid results, it's valid
    const geocode = await this.geocode(city, city);
    return Boolean(geocode?.adcode);
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async geocode(address: string, city?: string): Promise<Coordinates | null> {
    if (!this.apiKey || !address) {
      return null;
    }

    // Try to normalize international city names
    let normalizedCity = city;
    let country = "";

    if (city && !/[一-龥]/.test(city)) {
      // City is not in Chinese characters, try to normalize it
      const norm = this.normalizeCityName(city);
      if (norm) {
        normalizedCity = norm.chinese;
        country = norm.country;
      }
    }

    // Also check if address itself is an international city name
    if (!normalizedCity && !/[一-龥]/.test(address)) {
      const norm = this.normalizeCityName(address);
      if (norm) {
        address = norm.chinese;
        country = norm.country;
      }
    }

    const url = new URL(this.geocodeUrl);
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("address", address);
    if (normalizedCity) {
      url.searchParams.set("city", normalizedCity);
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

    // Try to normalize international city names
    let normalizedCity = city;
    if (!/[一-龥]/.test(city)) {
      const norm = this.normalizeCityName(city);
      if (norm) {
        normalizedCity = norm.chinese;
      }
    }

    const url = new URL(this.poiTextUrl);
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("city", normalizedCity);
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
        biz_ext?: { rating?: string; cost?: string };
        importance?: string;
      }>;
    };

    return (data.pois || [])
      .map((poi) => {
        const rating = Number(poi.biz_ext?.rating || 0);
        const popularity = Number(poi.importance || 0);
        const rankScore = Number((rating * 20 + popularity).toFixed(2));
        return {
          name: poi.name,
          type: poi.type,
          address: poi.address,
          location: poi.location,
          tel: poi.tel,
          rating: Number.isFinite(rating) && rating > 0 ? rating : undefined,
          reviews: Number.isFinite(popularity) && popularity > 0 ? popularity : undefined,
          rankScore,
          rankReason:
            Number.isFinite(rating) && rating > 0
              ? `评分${rating.toFixed(1)}，热度${popularity || 0}`
              : `按热度排序（${popularity || 0}）`,
        };
      })
      .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0))
      .slice(0, 8);
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
