import { Gamepad2, Video, Mic, Users } from "lucide-react";

const playSteps = [
  {
    id: "step1",
    step: "1",
    icon: Gamepad2,
    label: "게임 선택하기",
    description: "원하는 게임을 선택하세요",
    color: "text-chalk-yellow",
  },
  {
    id: "step2",
    step: "2",
    icon: Video,
    label: "영상 보기",
    description: "비트에 맞춰 화면에 이미지가 나타나요",
    color: "text-chalk-white",
  },
  {
    id: "step3",
    step: "3",
    icon: Mic,
    label: "박자에 맞춰 말하기",
    description: "리듬에 맞춰 각 항목의 이름을 말하세요!",
    color: "text-chalk-blue",
  },
  {
    id: "step4",
    step: "4",
    icon: Users,
    label: "친구들과 대결하기",
    description: "누가 더 오래 박자를 맞출 수 있는지 겨뤄보세요!",
    color: "text-chalk-yellow",
  },
];

export default function FeatureShowcase() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Container with blue chalk border */}
        <div className="chalk-border chalk-dust border-chalk-blue bg-chalkboard-bg/80 p-8 organic-rotate-2">
          {/* Title */}
          <div className="mb-8 text-center">
            <h2 className="chalk-text text-2xl md:text-3xl font-bold text-chalk-white mb-2">
              플레이 방법
            </h2>
            <p className="text-chalk-white/70 text-sm md:text-base">
              박자에 맞춰 단어를 말하는 간단한 리듬 게임입니다
            </p>
          </div>

          {/* Grid of play steps */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {playSteps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-chalk-white/30 bg-chalkboard-bg/50 p-6 transition-all hover:scale-105 hover:border-chalk-white/60"
              >
                {/* Step number badge */}
                <div className="relative">
                  <step.icon className={`${step.color}`} size={32} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-chalk-yellow text-chalkboard-bg flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="chalk-text text-sm font-bold text-chalk-white md:text-base">
                    {step.label}
                  </p>
                  <p className="text-xs text-chalk-white/60 md:text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
