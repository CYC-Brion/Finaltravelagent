import { Link, Outlet } from "react-router-dom";
import { Globe, LogOut } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

export function AppShell() {
  const { session, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-neutral-900">HelloWorld</div>
              <div className="text-xs text-neutral-500">Connected planning workspace</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">{session?.user.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
