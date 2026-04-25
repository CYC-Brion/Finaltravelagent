import type { ToolDefinition } from "./llm.service";
type SearchHotelsInput = {
    destination: string;
    checkInDate?: string;
    checkOutDate?: string;
    adults?: number;
    currency?: string;
    maxResults?: number;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
};
type HotelResult = {
    id: string;
    name: string;
    address?: string;
    district?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
    reviews?: number;
    nightlyPrice?: number;
    totalPrice?: number;
    currency: string;
    source?: string;
    sourceUrl?: string;
    transportMinutes?: number;
    rankScore: number;
    rankReason: string;
};
export declare class SerpapiHotelsService {
    private readonly apiKey;
    private readonly searchUrl;
    private readonly defaultCurrency;
    private readonly defaultGl;
    private readonly defaultHl;
    isConfigured(): boolean;
    searchHotels(input: SearchHotelsInput): Promise<{
        configured: boolean;
        reason: string;
        destination: string;
        checkInDate: string;
        checkOutDate: string;
        currency: string;
        hotels: HotelResult[];
        strategy?: undefined;
    } | {
        configured: boolean;
        reason: string;
        hotels: HotelResult[];
        destination?: undefined;
        checkInDate?: undefined;
        checkOutDate?: undefined;
        currency?: undefined;
        strategy?: undefined;
    } | {
        configured: boolean;
        destination: string;
        checkInDate: string;
        checkOutDate: string;
        currency: string;
        strategy: string;
        hotels: HotelResult[];
        reason?: undefined;
    }>;
    private normalizeDestination;
    private buildFallbackHotels;
    private normalizeHotel;
    private computeScore;
    private buildRankReason;
    private estimateMinutes;
    private estimateDistrict;
    private haversineKm;
    private firstNumber;
    private defaultCheckIn;
    private defaultCheckOut;
}
export declare const serpapiHotelTools: ToolDefinition[];
export {};
