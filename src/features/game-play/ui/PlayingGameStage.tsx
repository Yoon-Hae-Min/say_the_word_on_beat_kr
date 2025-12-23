import { Slot } from "@/entities/challenge";
import Image from "next/image";

interface PlayingGameStage {
  slots: Slot[];
}

const PlayingGameStage = ({ slots }: PlayingGameStage) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
      {slots.map((slot, index) => {
        const resource = getResource(slot.resourceId);
        const isFocused = focusedIndex === index && gamePhase === "playing";

        return (
          <div
            key={index}
            className={`
                  relative aspect-square rounded-md overflow-hidden transition-all duration-300
                  ${
                    resource
                      ? `border-4 ${
                          isFocused
                            ? "border-chalk-yellow scale-110 brightness-125 shadow-lg shadow-chalk-yellow/50"
                            : "border-chalk-white"
                        }`
                      : "border-2 border-dashed border-chalk-white/50"
                  }
                `}
          >
            {resource ? (
              <>
                <Image
                  src={resource.imageUrl}
                  alt={resource.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                  <p className="chalk-text text-chalk-yellow text-center text-sm md:text-base font-bold truncate">
                    {resource.name}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-chalk-white/50 text-xs">비어있음</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayingGameStage;
