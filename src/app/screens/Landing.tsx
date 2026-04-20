import { ArrowRight, Users, Sparkles, Globe, CheckCircle, MessageSquare, Vote, Compass, TrendingUp, Camera } from "lucide-react";
import { useState, useEffect } from "react";

interface LandingProps {
  onStartPlanning: () => void;
  onExploreCommunity: () => void;
}

export function Landing({ onStartPlanning, onExploreCommunity }: LandingProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    { color: "from-[#667eea] to-[#764ba2]", region: "Asia" },
    { color: "from-[#f093fb] to-[#f5576c]", region: "Europe" },
    { color: "from-[#4facfe] to-[#00f2fe]", region: "Africa" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">HelloWorld</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Features</a>
            <a href="#how" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">How it works</a>
            <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Sign in</button>
            <button
              onClick={onStartPlanning}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm"
            >
              Get started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24 relative overflow-hidden">
        {/* Background Travel Imagery */}
        <div className="absolute inset-0 -z-10 opacity-5">
          {heroImages.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-gradient-to-br ${img.color} transition-opacity duration-1000 ${
                i === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">AI-powered collaborative planning</span>
            </div>

            <h1 className="text-6xl font-bold text-neutral-900 leading-tight">
              Plan trips <span className="text-primary-600">together</span>, not alone
            </h1>

            <p className="text-xl text-neutral-600 leading-relaxed">
              Collaboration starts before itinerary generation. HelloWorld brings your group together to make decisions, vote on activities, and let AI handle the logistics.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={onStartPlanning}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-ocean hover:shadow-lg flex items-center gap-3 text-lg"
              >
                Start Collaborative Planning
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onExploreCommunity}
                className="px-8 py-4 bg-white border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-3 text-lg"
              >
                <Compass className="w-5 h-5 text-primary-600" />
                Travel Community & Inspiration
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-neutral-900">10K+</div>
                <div className="text-sm text-neutral-600">Trips planned</div>
              </div>
              <div className="w-px h-12 bg-neutral-200" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">45K+</div>
                <div className="text-sm text-neutral-600">Collaborative decisions</div>
              </div>
              <div className="w-px h-12 bg-neutral-200" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">98%</div>
                <div className="text-sm text-neutral-600">Satisfaction rate</div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Main card */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Tokyo Adventure</h3>
                  <p className="text-sm text-neutral-500">April 15-22, 2026</p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity proposal */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-purple-900 mb-1">AI suggests</div>
                      <div className="text-sm text-neutral-700">Visit Senso-ji Temple at 8:30 AM to avoid crowds</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-white border border-primary-300 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50">
                      Vote
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-neutral-900">Tokyo Tower Visit</span>
                    <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-md font-medium">85% consensus</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      12
                    </button>
                    <button className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium">
                      3
                    </button>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600">Budget progress</span>
                  <span className="text-sm font-semibold text-primary-600">48%</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full w-[48%] bg-gradient-to-r from-primary-500 to-primary-400" />
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-6 -right-6 px-4 py-3 bg-white rounded-xl shadow-lg border border-neutral-200 flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-600" />
              <div>
                <div className="text-xs text-neutral-500">Team size</div>
                <div className="text-sm font-semibold text-neutral-900">4 travelers</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 px-4 py-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-200 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-xs text-purple-600">Active discussion</div>
                <div className="text-sm font-semibold text-purple-900">8 comments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            Collaboration before automation
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Everyone has a say. AI does the heavy lifting. No more endless group chats or ignored suggestions.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
              <Vote className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Democratic decisions</h3>
            <p className="text-neutral-600 leading-relaxed">
              Vote on every activity. Set consensus rules. No single person decides the entire trip.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">AI as a participant</h3>
            <p className="text-neutral-600 leading-relaxed">
              AI suggests, you decide. Proposals require group approval just like any team member.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-success-100 flex items-center justify-center mb-6">
              <MessageSquare className="w-7 h-7 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Real-time collaboration</h3>
            <p className="text-neutral-600 leading-relaxed">
              Comment, discuss, and refine together. See updates instantly as your team makes decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-12 border border-primary-200">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-300 mb-6">
                <Compass className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Community Inspiration</span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                Travel Community & Inspiration
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Explore real itineraries shared by travelers worldwide. Get inspired by proven routes, discover hidden gems, and learn from authentic experiences before planning your own adventure.
              </p>
              <button
                onClick={onExploreCommunity}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-ocean hover:shadow-lg flex items-center gap-3"
              >
                Explore Community
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, label: "Trending", value: "248+ trips" },
                  { icon: Camera, label: "Shared", value: "15K+ photos" },
                  { icon: Users, label: "Travelers", value: "50K+ active" },
                  { icon: Globe, label: "Destinations", value: "120+ countries" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200">
                    <stat.icon className="w-8 h-8 text-primary-600 mb-3" />
                    <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gradient-to-br from-primary-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              How HelloWorld works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Simple process, powerful results
            </p>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create & invite", desc: "Start a trip and add your travel companions" },
              { step: "2", title: "Set preferences", desc: "Everyone shares their budget, pace, and interests" },
              { step: "3", title: "Collaborate", desc: "Vote on AI suggestions and propose your own ideas" },
              { step: "4", title: "Finalize & go", desc: "Lock the plan and track expenses during your trip" },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-6 border border-neutral-200">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-neutral-600">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="absolute top-12 -right-4 text-primary-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onStartPlanning}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-ocean hover:shadow-lg inline-flex items-center gap-3 text-lg"
            >
              Start your first trip
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">HelloWorld</span>
          </div>
          <p className="text-sm text-neutral-500">
            AI-powered collaborative travel planning • Plan together, travel better
          </p>
        </div>
      </footer>
    </div>
  );
}
