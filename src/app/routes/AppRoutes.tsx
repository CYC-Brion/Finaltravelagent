import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { Landing } from "../screens/Landing";
import { Dashboard } from "../screens/Dashboard";
import { TripWizard } from "../screens/TripWizard";
import { AIDraft } from "../screens/AIDraft";
import { CoCreateWorkspace } from "../screens/CoCreateWorkspace";
import { AIAssistant } from "../screens/AIAssistant";
import { OnTripDashboard } from "../screens/OnTripDashboard";
import { ExpenseTracking } from "../screens/ExpenseTracking";
import { TripSummary } from "../screens/TripSummary";
import { CommunityPage } from "../screens/CommunityPage";
import { HotelRecommendations } from "../screens/HotelRecommendations";
import { LoginPage } from "../screens/auth/LoginPage";
import { AcceptInvitationPage } from "../screens/auth/AcceptInvitationPage";
import { useAddComment, useAddDiaryEntry, useAddExpense, useAiDraft, useCheckInActivity, useCommunityPosts, useCreateActivity, useCreateTrip, useGenerateDraft, useHotelRecommendations, useMarkSettlementPaid, useMoveActivity, useOnTripToday, usePublishTrip, useRespondToSuggestion, useSwapActivity, useTrip, useTrips, useUpdateActivity, useVoteOnActivity } from "../hooks/useTrips";
import type { CreateTripInput, TripStatus } from "@/domain/types";
import { travelApi } from "@/lib/api/travelApi";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Landing
      onStartPlanning={() => navigate("/dashboard")}
      onExploreCommunity={() => navigate("/community")}
    />
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const tripsQuery = useTrips();

  const handleViewTrip = (tripId: string, status: TripStatus) => {
    // Navigate to the appropriate page based on trip status
    switch (status) {
      case "draft":
        navigate(`/trips/${tripId}/draft`);
        break;
      case "planning":
        navigate(`/trips/${tripId}/workspace`);
        break;
      case "finalized":
        navigate(`/trips/${tripId}/workspace`);
        break;
      case "in_trip":
        navigate(`/trips/${tripId}/on-trip`);
        break;
      case "completed":
        navigate(`/trips/${tripId}/summary`);
        break;
      default:
        navigate(`/trips/${tripId}/workspace`);
    }
  };

  const handleViewNotifications = () => {
    // Find first trip with pending votes and navigate to its workspace
    const tripsWithPending = tripsQuery.data?.find(
      (t) => t.status === "planning" || t.status === "draft"
    );
    if (tripsWithPending) {
      navigate(`/trips/${tripsWithPending.id}/workspace`);
    }
  };

  if (tripsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      trips={tripsQuery.data || []}
      onCreateTrip={() => navigate("/trips/new")}
      onViewTrip={handleViewTrip}
      onViewNotifications={handleViewNotifications}
    />
  );
}

function TripWizardPage() {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();

  return (
    <TripWizard
      onBack={() => navigate("/")}
      onSubmit={async (data: CreateTripInput) => {
        const trip = await createTrip.mutateAsync(data);
        await travelApi.generateDraft(trip.id);
        navigate(`/trips/${trip.id}/draft`);
      }}
      submitting={createTrip.isPending}
    />
  );
}

function DraftPage() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const tripQuery = useTrip(tripId);
  const aiDraftQuery = useAiDraft(tripId);
  const generateDraft = useGenerateDraft(tripId);
  const respondToSuggestion = useRespondToSuggestion(tripId);

  useEffect(() => {
    if (tripQuery.data && tripQuery.data.itinerary.length === 0 && !generateDraft.isPending) {
      generateDraft.mutate();
    }
  }, [tripQuery.data, generateDraft]);

  if (!tripQuery.data) return <div className="p-10">Loading trip draft...</div>;

  return (
    <AIDraft
      onContinue={() => navigate(`/trips/${tripId}/workspace`)}
      onViewHotels={() => navigate(`/trips/${tripId}/hotels`)}
      onRegenerate={() => generateDraft.mutate()}
      onSuggestionResponse={(suggestionId, response) =>
        respondToSuggestion.mutate({ suggestionId, response })
      }
      trip={tripQuery.data}
      draftData={aiDraftQuery.data}
      generating={generateDraft.isPending}
    />
  );
}

function WorkspacePage() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const tripQuery = useTrip(tripId);
  const aiDraftQuery = useAiDraft(tripId);
  const workspaceHotelQuery = useHotelRecommendations({
    destination: tripQuery.data?.destination,
    checkInDate: tripQuery.data?.startDate,
    checkOutDate: tripQuery.data?.endDate,
    adults: Math.max(1, tripQuery.data?.members?.length || 2),
    minRating: 4,
    maxResults: 6,
  });
  const voteMutation = useVoteOnActivity(tripId);
  const commentMutation = useAddComment(tripId);
  const createActivityMutation = useCreateActivity(tripId);
  const updateActivityMutation = useUpdateActivity(tripId);
  const moveActivityMutation = useMoveActivity(tripId);
  const swapActivityMutation = useSwapActivity(tripId);

  if (!tripQuery.data) return <div className="p-10">Loading workspace...</div>;

  return (
    <CoCreateWorkspace
      trip={tripQuery.data}
      onVote={(activityId, direction) => voteMutation.mutate({ activityId, direction })}
      onComment={(activityId, body) => commentMutation.mutate({ activityId, body })}
      onCreateActivity={(input) => createActivityMutation.mutate(input)}
      onUpdateActivity={(activityId, input) => updateActivityMutation.mutate({ activityId, input })}
      onMoveActivity={(activityId, targetDayNumber, targetIndex) =>
        moveActivityMutation.mutate({ activityId, targetDayNumber, targetIndex })
      }
      onSwapActivity={(activityId, targetActivityId) =>
        swapActivityMutation.mutate({ activityId, targetActivityId })
      }
      hotelRecommendations={
        (aiDraftQuery.data?.aiDraftMeta.hotels || []).length > 0
          ? aiDraftQuery.data?.aiDraftMeta.hotels || []
          : workspaceHotelQuery.data?.hotels || []
      }
      voting={voteMutation.isPending}
      commenting={commentMutation.isPending}
      creatingActivity={createActivityMutation.isPending}
      updatingActivity={updateActivityMutation.isPending}
      movingActivity={moveActivityMutation.isPending || swapActivityMutation.isPending}
      onNavigate={(page) => {
        if (page === "ai") navigate(`/trips/${tripId}/ai`);
        if (page === "ontrip") navigate(`/trips/${tripId}/on-trip`);
        if (page === "expense") navigate(`/trips/${tripId}/expenses`);
        if (page === "summary") navigate(`/trips/${tripId}/summary`);
        if (page === "hotels") navigate(`/trips/${tripId}/hotels`);
      }}
    />
  );
}

function HotelRecommendationsPage() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const tripQuery = useTrip(tripId);
  const createActivityMutation = useCreateActivity(tripId);
  const [filters, setFilters] = useState<{
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    maxResults?: number;
  }>({ minRating: 4, maxResults: 8 });

  const hotelQuery = useHotelRecommendations({
    destination: tripQuery.data?.destination,
    checkInDate: tripQuery.data?.startDate,
    checkOutDate: tripQuery.data?.endDate,
    adults: Math.max(1, tripQuery.data?.members?.length || 2),
    ...filters,
  });

  if (!tripQuery.data) return <div className="p-10">Loading hotels...</div>;

  return (
    <HotelRecommendations
      trip={tripQuery.data}
      hotels={hotelQuery.data?.hotels || []}
      loading={hotelQuery.isLoading || hotelQuery.isFetching}
      onBack={() => navigate(`/trips/${tripId}/workspace`)}
      onApplyFilters={(nextFilters) => setFilters(nextFilters)}
      onCreateVote={(hotel) =>
        createActivityMutation.mutate({
          dayNumber: 1,
          time: "9:30 PM",
          name: `Hotel vote: ${hotel.name}`,
          location: hotel.address || tripQuery.data.destination,
          duration: "0.5h",
          cost: 0,
        })
      }
      onInsertStay={(hotel) =>
        createActivityMutation.mutate({
          dayNumber: 1,
          time: "8:00 PM",
          name: `Check-in: ${hotel.name}`,
          location: hotel.address || tripQuery.data.destination,
          duration: "1h",
          cost: hotel.nightlyPrice || 0,
        })
      }
    />
  );
}

function AssistantPage() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const tripQuery = useTrip(tripId);
  if (!tripQuery.data) return <div className="p-10">Loading assistant...</div>;
  return <AIAssistant onBack={() => navigate(`/trips/${tripId}/workspace`)} trip={tripQuery.data} />;
}

function OnTripPage() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const tripQuery = useTrip(tripId);
  const todayQuery = useOnTripToday(tripId);
  const checkInMutation = useCheckInActivity(tripId);
  if (!tripQuery.data) return <div className="p-10">Loading trip...</div>;
  return (
    <OnTripDashboard
      trip={tripQuery.data}
      todayData={todayQuery.data}
      onCheckIn={(activityId) => checkInMutation.mutate(activityId)}
      checkingIn={checkInMutation.isPending}
      onNavigate={(page) => {
        if (page === "workspace") navigate(`/trips/${tripId}/workspace`);
        if (page === "expense") navigate(`/trips/${tripId}/expenses`);
      }}
    />
  );
}

function ExpensesPage() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const tripQuery = useTrip(tripId);
  const addExpense = useAddExpense(tripId);
  const markSettlementPaid = useMarkSettlementPaid(tripId);
  if (!tripQuery.data) return <div className="p-10">Loading expenses...</div>;
  return (
    <ExpenseTracking
      trip={tripQuery.data}
      onAddExpense={(input) => addExpense.mutate(input)}
      addingExpense={addExpense.isPending}
      onMarkSettlementPaid={(settlementId) => markSettlementPaid.mutate(settlementId)}
      markingSettlement={markSettlementPaid.isPending}
      onBack={() => navigate(`/trips/${tripId}/on-trip`)}
      onContinue={() => navigate(`/trips/${tripId}/summary`)}
    />
  );
}

function SummaryPage() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const tripQuery = useTrip(tripId);
  const publish = usePublishTrip(tripId);
  const addDiaryEntry = useAddDiaryEntry(tripId);
  if (!tripQuery.data) return <div className="p-10">Loading summary...</div>;
  return (
    <TripSummary
      trip={tripQuery.data}
      onBack={() => navigate(`/trips/${tripId}/expenses`)}
      onAddDiaryEntry={(input) => addDiaryEntry.mutate(input)}
      addingDiaryEntry={addDiaryEntry.isPending}
      onRestart={() => navigate("/")}
      onPublishToCommunity={async () => {
        await publish.mutateAsync();
        navigate("/community");
      }}
    />
  );
}

function CommunityRoute() {
  const navigate = useNavigate();
  const posts = useCommunityPosts();
  return (
    <CommunityPage
      posts={posts.data || []}
      onBack={() => navigate("/")}
      onStartPlanning={() => navigate("/trips/new")}
    />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/accept-invite/:token" element={<AcceptInvitationPage />} />
      <Route path="/community" element={<CommunityRoute />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trips/new" element={<TripWizardPage />} />
        <Route path="/trips/:tripId/draft" element={<DraftPage />} />
        <Route path="/trips/:tripId/workspace" element={<WorkspacePage />} />
        <Route path="/trips/:tripId/hotels" element={<HotelRecommendationsPage />} />
        <Route path="/trips/:tripId/ai" element={<AssistantPage />} />
        <Route path="/trips/:tripId/on-trip" element={<OnTripPage />} />
        <Route path="/trips/:tripId/expenses" element={<ExpensesPage />} />
        <Route path="/trips/:tripId/summary" element={<SummaryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
