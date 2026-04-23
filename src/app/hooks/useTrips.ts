import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTripInput, Expense } from "@/domain/types";
import { travelApi } from "@/lib/api/travelApi";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: () => travelApi.listTrips(),
  });
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => travelApi.getTrip(tripId),
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTripInput) => travelApi.createTrip(input),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.setQueryData(["trips", trip.id], trip);
    },
  });
}

export function useGenerateDraft(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => travelApi.generateDraft(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["ai-draft", tripId] });
    },
  });
}

export function useAiDraft(tripId: string) {
  return useQuery({
    queryKey: ["ai-draft", tripId],
    queryFn: () => travelApi.getAiDraft(tripId),
    enabled: Boolean(tripId),
  });
}

export function useRespondToSuggestion(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ suggestionId, response }: { suggestionId: string; response: "accepted" | "dismissed" }) =>
      travelApi.respondToSuggestion(tripId, suggestionId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["ai-draft", tripId] });
    },
  });
}

export function useCreateActivity(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      dayNumber: number;
      time: string;
      name: string;
      location?: string;
      duration?: string;
      cost?: number;
    }) => travelApi.createActivity(tripId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
    },
  });
}

export function useVoteOnActivity(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ activityId, direction }: { activityId: string; direction: 1 | -1 }) =>
      travelApi.vote(activityId, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
    },
  });
}

export function useAddComment(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ activityId, body }: { activityId: string; body: string }) =>
      travelApi.addComment(activityId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
    },
  });
}

export function useAddExpense(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expense: Omit<Expense, "id">) => travelApi.addExpense(tripId, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["on-trip", tripId] });
    },
  });
}

export function useMarkSettlementPaid(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settlementId: string) => travelApi.markSettlementPaid(tripId, settlementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
    },
  });
}

export function usePublishTrip(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => travelApi.publishTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
    },
  });
}

export function useCommunityPosts() {
  return useQuery({
    queryKey: ["community-posts"],
    queryFn: () => travelApi.listCommunityPosts(),
  });
}

export function useOnTripToday(tripId: string) {
  return useQuery({
    queryKey: ["on-trip", tripId],
    queryFn: () => travelApi.getOnTripToday(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCheckInActivity(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activityId: string) => travelApi.checkInActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["on-trip", tripId] });
    },
  });
}

export function useAddDiaryEntry(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { day: number; author: string; content: string; photos: number }) =>
      travelApi.addDiaryEntry(tripId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
  });
}

export function useHotelRecommendations(input: {
  destination?: string;
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  maxResults?: number;
}) {
  return useQuery({
    queryKey: ["hotels", input],
    queryFn: () =>
      travelApi.searchHotels({
        destination: input.destination || "北京",
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        adults: input.adults,
        minRating: input.minRating,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        maxResults: input.maxResults,
      }),
    enabled: Boolean(input.destination),
  });
}
