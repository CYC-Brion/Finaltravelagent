"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serpapiHotelTools = exports.SerpapiHotelsService = void 0;
const common_1 = require("@nestjs/common");
const CITY_CENTER = {
    北京: { lat: 39.9042, lon: 116.4074, district: "东城区" },
    上海: { lat: 31.2304, lon: 121.4737, district: "黄浦区" },
};
let SerpapiHotelsService = class SerpapiHotelsService {
    constructor() {
        this.apiKey = process.env.SERPAPI_API_KEY;
        this.searchUrl = process.env.SERPAPI_SEARCH_URL || "https://serpapi.com/search.json";
        this.defaultCurrency = process.env.SERPAPI_DEFAULT_CURRENCY || "CNY";
        this.defaultGl = process.env.SERPAPI_GL || "cn";
        this.defaultHl = process.env.SERPAPI_HL || "zh-cn";
    }
    isConfigured() {
        return Boolean(this.apiKey);
    }
    async searchHotels(input) {
        if (!this.apiKey) {
            return {
                configured: false,
                reason: "SERPAPI_API_KEY is not configured",
                hotels: [],
            };
        }
        const destination = this.normalizeDestination(input.destination);
        const checkInDate = input.checkInDate || this.defaultCheckIn();
        const checkOutDate = input.checkOutDate || this.defaultCheckOut(checkInDate);
        const adults = Math.max(1, Number(input.adults || 2));
        const currency = (input.currency || this.defaultCurrency || "CNY").toUpperCase();
        const url = new URL(this.searchUrl);
        url.searchParams.set("engine", "google_hotels");
        url.searchParams.set("q", `${destination} 酒店`);
        url.searchParams.set("check_in_date", checkInDate);
        url.searchParams.set("check_out_date", checkOutDate);
        url.searchParams.set("adults", String(adults));
        url.searchParams.set("currency", currency);
        url.searchParams.set("gl", this.defaultGl);
        url.searchParams.set("hl", this.defaultHl);
        url.searchParams.set("api_key", this.apiKey);
        const response = await fetch(url);
        if (!response.ok) {
            return {
                configured: true,
                reason: `SerpApi request failed with status ${response.status}`,
                hotels: [],
            };
        }
        const raw = (await response.json());
        const rows = [...(raw.properties || []), ...(raw.ads || [])];
        const normalized = rows
            .map((row, index) => this.normalizeHotel(row, index, destination, currency))
            .filter((item) => Boolean(item))
            .filter((item) => {
            if (input.minRating && (item.rating || 0) < input.minRating) {
                return false;
            }
            if (input.minPrice && (item.nightlyPrice || 0) < input.minPrice) {
                return false;
            }
            if (input.maxPrice && (item.nightlyPrice || Number.MAX_SAFE_INTEGER) > input.maxPrice) {
                return false;
            }
            return true;
        });
        const maxResults = Math.min(20, Math.max(1, Number(input.maxResults || 8)));
        const ranked = normalized
            .map((hotel) => ({
            ...hotel,
            rankScore: this.computeScore(hotel),
        }))
            .sort((a, b) => b.rankScore - a.rankScore)
            .slice(0, maxResults)
            .map((hotel) => ({
            ...hotel,
            rankReason: this.buildRankReason(hotel),
        }));
        return {
            configured: true,
            destination,
            checkInDate,
            checkOutDate,
            currency,
            strategy: "value-first",
            hotels: ranked,
        };
    }
    normalizeDestination(destination) {
        const value = (destination || "").trim();
        if (value.includes("上海") || value.toLowerCase().includes("shanghai")) {
            return "上海";
        }
        return "北京";
    }
    normalizeHotel(row, index, destination, currency) {
        const name = String(row.name || "").trim();
        if (!name) {
            return null;
        }
        const ratePerNight = this.firstNumber(row.rate_per_night?.extracted_lowest, row.rate_per_night?.lowest, row.extracted_price, row.price, row.prices?.[0]?.rate_per_night?.extracted_lowest);
        const totalPrice = this.firstNumber(row.total_rate?.extracted_lowest, row.total_rate?.lowest, row.prices?.[0]?.total_rate?.extracted_lowest);
        const rating = this.firstNumber(row.overall_rating, row.rating);
        const reviews = this.firstNumber(row.reviews, row.reviews_count);
        const lat = this.firstNumber(row.gps_coordinates?.latitude, row.latitude);
        const lon = this.firstNumber(row.gps_coordinates?.longitude, row.longitude);
        const transportMinutes = this.estimateMinutes(destination, lat, lon);
        return {
            id: String(row.property_token || row.id || `hotel_${Date.now()}_${index}`),
            name,
            address: row.address || row.nearby_places?.[0]?.name,
            district: this.estimateDistrict(destination, row.address),
            latitude: lat,
            longitude: lon,
            rating: rating || undefined,
            reviews: reviews || undefined,
            nightlyPrice: ratePerNight || undefined,
            totalPrice: totalPrice || undefined,
            currency,
            source: row.source || row.prices?.[0]?.source,
            sourceUrl: row.link || row.serpapi_property_details_link,
            transportMinutes,
            rankScore: 0,
            rankReason: "",
        };
    }
    computeScore(hotel) {
        const rating = Math.min(5, Math.max(0, hotel.rating || 3.8));
        const ratingScore = (rating / 5) * 60;
        const price = hotel.nightlyPrice || 550;
        const priceScore = Math.max(0, 35 - price / 35);
        const transport = hotel.transportMinutes ?? 45;
        const transportScore = Math.max(0, 20 - transport / 2);
        return Number((ratingScore + priceScore + transportScore).toFixed(2));
    }
    buildRankReason(hotel) {
        const parts = [];
        if (hotel.rating) {
            parts.push(`评分${hotel.rating.toFixed(1)}`);
        }
        if (hotel.nightlyPrice) {
            parts.push(`每晚约${hotel.nightlyPrice}${hotel.currency}`);
        }
        if (typeof hotel.transportMinutes === "number") {
            parts.push(`约${hotel.transportMinutes}分钟到核心区`);
        }
        return parts.join("，") || "基础信息不足，按默认性价比排序";
    }
    estimateMinutes(destination, lat, lon) {
        const center = CITY_CENTER[destination];
        if (!center || typeof lat !== "number" || typeof lon !== "number") {
            return undefined;
        }
        const distance = this.haversineKm(center.lat, center.lon, lat, lon);
        const minutes = Math.round(distance * 4);
        return Math.min(120, Math.max(8, minutes));
    }
    estimateDistrict(destination, address) {
        if (address && address.length > 0) {
            return address.split(" ")[0];
        }
        return CITY_CENTER[destination]?.district;
    }
    haversineKm(lat1, lon1, lat2, lon2) {
        const toRad = (v) => (v * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }
    firstNumber(...values) {
        for (const value of values) {
            if (typeof value === "number" && Number.isFinite(value)) {
                return value;
            }
            if (typeof value === "string") {
                const clean = value.replace(/[^\d.]/g, "");
                const parsed = Number(clean);
                if (Number.isFinite(parsed) && parsed > 0) {
                    return parsed;
                }
            }
        }
        return 0;
    }
    defaultCheckIn() {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().slice(0, 10);
    }
    defaultCheckOut(checkInDate) {
        const date = new Date(checkInDate);
        date.setDate(date.getDate() + 2);
        return date.toISOString().slice(0, 10);
    }
};
exports.SerpapiHotelsService = SerpapiHotelsService;
exports.SerpapiHotelsService = SerpapiHotelsService = __decorate([
    (0, common_1.Injectable)()
], SerpapiHotelsService);
exports.serpapiHotelTools = [
    {
        type: "function",
        function: {
            name: "search_hotels",
            description: "搜索京沪酒店并按性价比排序，返回价格、评分和推荐理由",
            parameters: {
                type: "object",
                properties: {
                    destination: { type: "string", description: "城市名称，仅支持北京或上海" },
                    checkInDate: { type: "string", description: "入住日期，格式YYYY-MM-DD" },
                    checkOutDate: { type: "string", description: "离店日期，格式YYYY-MM-DD" },
                    adults: { type: "number", description: "入住成人数，默认2" },
                    maxResults: { type: "number", description: "返回数量，默认8，最大20" },
                    minRating: { type: "number", description: "最小评分阈值，如4.0" },
                    minPrice: { type: "number", description: "每晚最低价格" },
                    maxPrice: { type: "number", description: "每晚最高价格" },
                },
                required: ["destination"],
            },
        },
    },
];
//# sourceMappingURL=serpapi-hotels.service.js.map