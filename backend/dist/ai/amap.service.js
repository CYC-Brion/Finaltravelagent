"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amapTools = exports.AmapService = void 0;
const common_1 = require("@nestjs/common");
let AmapService = class AmapService {
    constructor() {
        this.apiKey = process.env.AMAP_API_KEY;
        this.weatherUrl = process.env.AMAP_WEATHER_URL ||
            "https://restapi.amap.com/v3/weather/weatherInfo";
        this.geocodeUrl = process.env.AMAP_GEOCODE_URL || "https://restapi.amap.com/v3/geocode/geo";
        this.drivingRouteUrl = process.env.AMAP_DRIVING_ROUTE_URL ||
            "https://restapi.amap.com/v3/direction/driving";
        this.transitRouteUrl = process.env.AMAP_TRANSIT_ROUTE_URL ||
            "https://restapi.amap.com/v3/direction/transit/integrated";
        this.walkingRouteUrl = process.env.AMAP_WALKING_ROUTE_URL ||
            "https://restapi.amap.com/v3/direction/walking";
        this.poiTextUrl = process.env.AMAP_POI_TEXT_URL || "https://restapi.amap.com/v3/place/text";
        this.cityNameMap = {
            tokyo: { chinese: "东京", country: "日本" },
            osaka: { chinese: "大阪", country: "日本" },
            kyoto: { chinese: "京都", country: "日本" },
            yokohama: { chinese: "横滨", country: "日本" },
            nagoya: { chinese: "名古屋", country: "日本" },
            sapporo: { chinese: "札幌", country: "日本" },
            fukuoka: { chinese: "福冈", country: "日本" },
            seoul: { chinese: "首尔", country: "韩国" },
            busan: { chinese: "釜山", country: "韩国" },
            jeju: { chinese: "济州岛", country: "韩国" },
            bangkok: { chinese: "曼谷", country: "泰国" },
            phuket: { chinese: "普吉岛", country: "泰国" },
            chiangmai: { chinese: "清迈", country: "泰国" },
            "new york": { chinese: "纽约", country: "美国" },
            losangeles: { chinese: "洛杉矶", country: "美国" },
            sanfrancisco: { chinese: "旧金山", country: "美国" },
            newyork: { chinese: "纽约", country: "美国" },
            la: { chinese: "洛杉矶", country: "美国" },
            sf: { chinese: "旧金山", country: "美国" },
            london: { chinese: "伦敦", country: "英国" },
            manchester: { chinese: "曼彻斯特", country: "英国" },
            paris: { chinese: "巴黎", country: "法国" },
            berlin: { chinese: "柏林", country: "德国" },
            munich: { chinese: "慕尼黑", country: "德国" },
            frankfurt: { chinese: "法兰克福", country: "德国" },
            rome: { chinese: "罗马", country: "意大利" },
            milan: { chinese: "米兰", country: "意大利" },
            venice: { chinese: "威尼斯", country: "意大利" },
            madrid: { chinese: "马德里", country: "西班牙" },
            barcelona: { chinese: "巴塞罗那", country: "西班牙" },
            singapore: { chinese: "新加坡", country: "新加坡" },
            kualalumpur: { chinese: "吉隆坡", country: "马来西亚" },
            penang: { chinese: "槟城", country: "马来西亚" },
            hanoi: { chinese: "河内", country: "越南" },
            hochiminh: { chinese: "胡志明市", country: "越南" },
            saigon: { chinese: "胡志明市", country: "越南" },
            jakarta: { chinese: "雅加达", country: "印度尼西亚" },
            bali: { chinese: "巴厘岛", country: "印度尼西亚" },
            manila: { chinese: "马尼拉", country: "菲律宾" },
            taipei: { chinese: "台北", country: "台湾" },
            kaohsiung: { chinese: "高雄", country: "台湾" },
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
    }
    normalizeCityName(city) {
        if (!city)
            return null;
        const normalized = city.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "");
        if (this.cityNameMap[normalized]) {
            return this.cityNameMap[normalized];
        }
        const chineseRegex = /[一-龥]/;
        if (chineseRegex.test(city)) {
            return { chinese: city.trim(), country: "" };
        }
        return null;
    }
    async isValidChineseCity(city) {
        const geocode = await this.geocode(city, city);
        return Boolean(geocode?.adcode);
    }
    isConfigured() {
        return Boolean(this.apiKey);
    }
    async geocode(address, city) {
        if (!this.apiKey || !address) {
            return null;
        }
        let normalizedCity = city;
        let country = "";
        if (city && !/[一-龥]/.test(city)) {
            const norm = this.normalizeCityName(city);
            if (norm) {
                normalizedCity = norm.chinese;
                country = norm.country;
            }
        }
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
        const data = (await response.json());
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
    async getWeather(city) {
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
        const data = (await response.json());
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
    async searchPlaces(city, keywords) {
        if (!this.apiKey || !city || !keywords) {
            return [];
        }
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
        const data = (await response.json());
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
                rankReason: Number.isFinite(rating) && rating > 0
                    ? `评分${rating.toFixed(1)}，热度${popularity || 0}`
                    : `按热度排序（${popularity || 0}）`,
            };
        })
            .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0))
            .slice(0, 8);
    }
    async compareRoutes(origin, destination, city) {
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
    async fetchRoute(endpoint, origin, destination, mode) {
        const url = new URL(endpoint);
        url.searchParams.set("key", this.apiKey);
        url.searchParams.set("origin", origin);
        url.searchParams.set("destination", destination);
        url.searchParams.set("extensions", "base");
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
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
};
exports.AmapService = AmapService;
exports.AmapService = AmapService = __decorate([
    (0, common_1.Injectable)()
], AmapService);
exports.amapTools = [
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
//# sourceMappingURL=amap.service.js.map