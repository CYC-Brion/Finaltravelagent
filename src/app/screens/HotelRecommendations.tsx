import { Filter, MapPin, Star, BedDouble, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { HotelRecommendation, Trip } from "@/domain/types";

type HotelFilterInput = {
  minRating?: number;
  maxRating?: number;
  minPrice?: number;
  maxPrice?: number;
  minTransport?: number;
  maxTransport?: number;
  maxResults?: number;
};

interface HotelRecommendationsProps {
  trip?: Trip;
  hotels: HotelRecommendation[];
  loading?: boolean;
  onBack: () => void;
  onApplyFilters: (filters: HotelFilterInput) => void;
  onCreateVote: (hotel: HotelRecommendation) => void;
  onInsertStay: (hotel: HotelRecommendation) => void;
}

export function HotelRecommendations({
  trip,
  hotels,
  loading = false,
  onBack,
  onApplyFilters,
  onCreateVote,
  onInsertStay,
}: HotelRecommendationsProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<HotelFilterInput>({
    minRating: 4,
    maxRating: 5,
    minPrice: undefined,
    maxPrice: undefined,
    minTransport: undefined,
    maxTransport: undefined,
    maxResults: 8,
  });

  const filteredHotels = useMemo(() => {
    return hotels
      .filter(hotel => {
        if (filters.minRating && (hotel.rating || 0) < filters.minRating) return false;
        if (filters.maxRating && (hotel.rating || 0) > filters.maxRating) return false;
        if (filters.minPrice && (hotel.nightlyPrice || 0) < filters.minPrice) return false;
        if (filters.maxPrice && (hotel.nightlyPrice || 0) > filters.maxPrice) return false;
        if (filters.minTransport && (hotel.transportMinutes || 999) < filters.minTransport) return false;
        if (filters.maxTransport && (hotel.transportMinutes || 0) > filters.maxTransport) return false;
        return true;
      })
      .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0))
      .slice(0, filters.maxResults || 8);
  }, [hotels, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-cyan-50">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Hotel Recommendations</h1>
            <p className="text-sm text-neutral-600">
              {trip?.destination || "Destination"} · {trip?.startDate || "Check-in"} to {trip?.endDate || "Check-out"}
            </p>
          </div>
          <button
            onClick={onBack}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Back to workspace
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-6 py-6">
        <aside className="col-span-12 rounded-xl border border-neutral-200 bg-white p-4 lg:col-span-4 xl:col-span-3 lg:block hidden">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary-600" />
            <h2 className="font-semibold text-neutral-900">筛选条件</h2>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-neutral-700">
              评分区间
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={filters.minRating ?? ""}
                  onChange={(e) => setFilters((s) => ({ ...s, minRating: Number(e.target.value) || undefined }))}
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="最低"
                />
                <span className="text-neutral-400">-</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={filters.maxRating ?? ""}
                  onChange={(e) => setFilters((s) => ({ ...s, maxRating: Number(e.target.value) || undefined }))}
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="最高"
                />
              </div>
            </label>
            <label className="block text-sm text-neutral-700">
              价格区间 (CNY)
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  min={0}
                  value={filters.minPrice ?? ""}
                  onChange={(e) => setFilters((s) => ({ ...s, minPrice: Number(e.target.value) || undefined }))}
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="最低"
                />
                <span className="text-neutral-400">-</span>
                <input
                  type="number"
                  min={0}
                  value={filters.maxPrice ?? ""}
                  onChange={(e) => setFilters((s) => ({ ...s, maxPrice: Number(e.target.value) || undefined }))}
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="最高"
                />
              </div>
            </label>
            <label className="block text-sm text-neutral-700">
              距离市中心 (分钟)
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  min={0}
                  value={filters.minTransport ?? ""}
                  onChange={(e) => setFilters((s) => ({ ...s, minTransport: Number(e.target.value) || undefined }))}
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="最短"
                />
                <span className="text-neutral-400">-</span>
                <input
                  type="number"
                  min={0}
                  value={filters.maxTransport ?? ""}
                  onChange={(e) => setFilters((s) => ({ ...s, maxTransport: Number(e.target.value) || undefined }))}
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="最长"
                />
              </div>
            </label>
            <label className="block text-sm text-neutral-700">
              最多显示
              <input
                type="number"
                min={1}
                max={20}
                value={filters.maxResults || 8}
                onChange={(e) => setFilters((s) => ({ ...s, maxResults: Number(e.target.value) || 8 }))}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
            </label>
            <button
              onClick={() => onApplyFilters(filters)}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              应用筛选
            </button>
          </div>
        </aside>

        <main className="col-span-12 space-y-4 lg:col-span-8 xl:col-span-9">
          {loading && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">Loading hotel recommendations...</div>
          )}

          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-900">{hotel.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600">
                    <MapPin className="h-3.5 w-3.5" />
                    {hotel.address || trip?.destination}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-neutral-700">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      {hotel.rating ? hotel.rating.toFixed(1) : "N/A"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-cyan-600" />
                      {hotel.nightlyPrice ? `${hotel.nightlyPrice} ${hotel.currency}/night` : "Price on request"}
                    </span>
                    {typeof hotel.transportMinutes === "number" && <span>{hotel.transportMinutes} min to center</span>}
                  </div>
                  {hotel.rankReason && <p className="mt-2 text-sm text-neutral-600">{hotel.rankReason}</p>}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => onCreateVote(hotel)}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    加入提案投票
                  </button>
                  <button
                    onClick={() => onInsertStay(hotel)}
                    className="rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700"
                  >
                    插入住宿活动
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && filteredHotels.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
              暂无符合条件的酒店。
            </div>
          )}
        </main>
      </div>

      <button
        onClick={() => setShowMobileFilters(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-white shadow-lg lg:hidden"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/30 lg:hidden">
          <div className="w-full rounded-t-2xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="text-sm text-neutral-600">
                Close
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="number"
                min={1}
                max={5}
                step={0.1}
                value={filters.minRating || ""}
                onChange={(e) => setFilters((s) => ({ ...s, minRating: Number(e.target.value) || undefined }))}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                placeholder="Min rating"
              />
              <input
                type="number"
                min={0}
                value={filters.minPrice || ""}
                onChange={(e) => setFilters((s) => ({ ...s, minPrice: Number(e.target.value) || undefined }))}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                placeholder="Min price"
              />
              <input
                type="number"
                min={0}
                value={filters.maxPrice || ""}
                onChange={(e) => setFilters((s) => ({ ...s, maxPrice: Number(e.target.value) || undefined }))}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                placeholder="Max price"
              />
              <button
                onClick={() => {
                  onApplyFilters(filters);
                  setShowMobileFilters(false);
                }}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
