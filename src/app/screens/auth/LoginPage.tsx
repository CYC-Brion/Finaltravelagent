import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "demo@helloworld.app",
      name: "Demo Traveler",
    },
  });

  const from = (location.state as { from?: string } | null)?.from || "/";

  const onSubmit = async (values: FormValues, mode: "login" | "register") => {
    if (mode === "login") {
      await login(values);
    } else {
      await register(values);
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">HelloWorld</h1>
            <p className="text-sm text-neutral-500">Email auth and invite-ready workspace</p>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
            <input {...registerField("name")} className="w-full px-4 py-3 rounded-lg border border-neutral-200" />
            {errors.name && <p className="text-xs text-danger-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
            <input {...registerField("email")} className="w-full px-4 py-3 rounded-lg border border-neutral-200" />
            {errors.email && <p className="text-xs text-danger-600 mt-1">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit((values) => onSubmit(values, "login"))}
              className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50"
            >
              Sign in
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit((values) => onSubmit(values, "register"))}
              className="px-4 py-3 border border-neutral-300 rounded-lg font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
