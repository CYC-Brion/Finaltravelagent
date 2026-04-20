import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { travelApi } from "@/lib/api/travelApi";

export function AcceptInvitationPage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () => travelApi.acceptInvitation(token),
    onSuccess: () => navigate("/login"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-primary-50 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 p-8 shadow-xl text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">Accept travel invitation</h1>
        <p className="text-neutral-600 mb-6">
          This page is wired for backend invite tokens. In mock mode it accepts immediately.
        </p>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50"
        >
          {mutation.isPending ? "Accepting..." : "Accept invitation"}
        </button>
      </div>
    </div>
  );
}
