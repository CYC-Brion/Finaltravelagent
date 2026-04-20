import { useState } from "react";
import { Landing } from "./screens/Landing";
import { TripWizard } from "./screens/TripWizard";
import { AIDraft } from "./screens/AIDraft";
import { CoCreateWorkspace } from "./screens/CoCreateWorkspace";
import { AIAssistant } from "./screens/AIAssistant";
import { OnTripDashboard } from "./screens/OnTripDashboard";
import { ExpenseTracking } from "./screens/ExpenseTracking";
import { TripSummary } from "./screens/TripSummary";
import { CommunityPage } from "./screens/CommunityPage";

type Screen = "landing" | "wizard" | "draft" | "workspace" | "ai" | "ontrip" | "expense" | "summary" | "community";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");

  if (currentScreen === "landing") {
    return (
      <Landing
        onStartPlanning={() => setCurrentScreen("wizard")}
        onExploreCommunity={() => setCurrentScreen("community")}
      />
    );
  }

  if (currentScreen === "community") {
    return (
      <CommunityPage
        onBack={() => setCurrentScreen("landing")}
        onStartPlanning={() => setCurrentScreen("wizard")}
      />
    );
  }

  if (currentScreen === "wizard") {
    return (
      <TripWizard
        onComplete={() => setCurrentScreen("draft")}
        onBack={() => setCurrentScreen("landing")}
      />
    );
  }

  if (currentScreen === "draft") {
    return <AIDraft onContinue={() => setCurrentScreen("workspace")} />;
  }

  if (currentScreen === "workspace") {
    return (
      <CoCreateWorkspace
        onNavigate={(page) => {
          if (page === "ai") setCurrentScreen("ai");
          if (page === "ontrip") setCurrentScreen("ontrip");
          if (page === "expense") setCurrentScreen("expense");
          if (page === "summary") setCurrentScreen("summary");
        }}
      />
    );
  }

  if (currentScreen === "ai") {
    return <AIAssistant onBack={() => setCurrentScreen("workspace")} />;
  }

  if (currentScreen === "ontrip") {
    return (
      <OnTripDashboard
        onNavigate={(page) => {
          if (page === "workspace") setCurrentScreen("workspace");
          if (page === "expense") setCurrentScreen("expense");
        }}
      />
    );
  }

  if (currentScreen === "expense") {
    return (
      <ExpenseTracking
        onBack={() => setCurrentScreen("ontrip")}
        onContinue={() => setCurrentScreen("summary")}
      />
    );
  }

  if (currentScreen === "summary") {
    return (
      <TripSummary
        onBack={() => setCurrentScreen("expense")}
        onRestart={() => setCurrentScreen("landing")}
        onPublishToCommunity={() => setCurrentScreen("community")}
      />
    );
  }

  return null;
}
