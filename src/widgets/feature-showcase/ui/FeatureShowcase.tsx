import {
  Heart,
  Mic,
  Music,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

const features = [
  {
    id: "rhythm",
    icon: Music,
    label: "리듬에 맞춰",
    color: "text-chalk-yellow",
  },
  {
    id: "pronunciation",
    icon: Mic,
    label: "단어 발음",
    color: "text-chalk-white",
  },
  { id: "fun", icon: Heart, label: "재미있게", color: "text-chalk-blue" },
  { id: "score", icon: Star, label: "점수 획득", color: "text-chalk-yellow" },
  {
    id: "challenge",
    icon: Trophy,
    label: "챌린지 완성",
    color: "text-chalk-blue",
  },
  { id: "reaction", icon: Zap, label: "빠른 반응", color: "text-chalk-white" },
  {
    id: "timing",
    icon: Target,
    label: "정확한 타이밍",
    color: "text-chalk-yellow",
  },
  {
    id: "experience",
    icon: Sparkles,
    label: "특별한 경험",
    color: "text-chalk-blue",
  },
];

export default function FeatureShowcase() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Container with blue chalk border */}
        <div className="chalk-border chalk-dust border-chalk-blue bg-chalkboard-bg/80 p-8 organic-rotate-2">
          {/* Grid of feature slots */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-chalk-white/30 bg-chalkboard-bg/50 p-6 transition-all hover:scale-105 hover:border-chalk-white/60"
              >
                <feature.icon className={`${feature.color}`} size={32} />
                <p className="chalk-text text-center text-sm text-chalk-white md:text-base">
                  {feature.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="chalk-text animate-fade-in rounded-lg border-2 border-chalk-yellow bg-chalkboard-bg/60 px-6 py-4 text-center text-xl font-bold text-chalk-yellow hover:bg-chalk-yellow hover:text-chalkboard-bg transition-all md:text-2xl">
            지금 당장 참여하기! 🎉
          </div>
        </div>
      </div>
    </section>
  );
}
