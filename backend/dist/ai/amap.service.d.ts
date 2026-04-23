import type { ToolDefinition } from "./llm.service";
type Coordinates = {
    longitude: number;
    latitude: number;
    adcode?: string;
    formattedAddress?: string;
};
export declare class AmapService {
    private readonly apiKey;
    private readonly weatherUrl;
    private readonly geocodeUrl;
    private readonly drivingRouteUrl;
    private readonly transitRouteUrl;
    private readonly walkingRouteUrl;
    private readonly poiTextUrl;
    private readonly cityNameMap;
    private normalizeCityName;
    private isValidChineseCity;
    isConfigured(): boolean;
    geocode(address: string, city?: string): Promise<Coordinates | null>;
    getWeather(city: string): Promise<{
        city: string;
        weather: string | undefined;
        temperature: string | undefined;
        humidity: string | undefined;
        reportTime: string | undefined;
    } | null>;
    searchPlaces(city: string, keywords: string): Promise<{
        name: string | undefined;
        type: string | undefined;
        address: string | undefined;
        location: string | undefined;
        tel: string | undefined;
    }[]>;
    compareRoutes(origin: string, destination: string, city?: string): Promise<{
        origin: string;
        destination: string;
        routes: ({
            mode: "transit";
            distance: string;
            duration: string;
            durationMinutes: number;
            cost: number;
        } | {
            mode: "driving" | "walking";
            distance: string;
            duration: string;
            durationMinutes: number;
            cost: number;
        } | null)[];
        recommended: {
            mode: "transit";
            distance: string;
            duration: string;
            durationMinutes: number;
            cost: number;
        } | {
            mode: "driving" | "walking";
            distance: string;
            duration: string;
            durationMinutes: number;
            cost: number;
        } | null;
    } | null>;
    private fetchRoute;
}
export declare const amapTools: ToolDefinition[];
export {};
