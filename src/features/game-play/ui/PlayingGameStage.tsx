import { DatabaseChallenge } from "@/entities/challenge";
import Image from "next/image";
import { useState } from "react";
import { useAudioBeat } from "../hooks/useAudioBeat";

interface PlayingGameStage {
  challengeData: DatabaseChallenge;
  onPlayingEnd: () => void;
}

const BPM = 182;
const BLOCK_SIZE = 8;
const STEPS = 8;
const ROUND_BEATS = 16;

const PlayingGameStage = ({
  challengeData,
  onPlayingEnd,
}: PlayingGameStage) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(1);

  const slots = challengeData.game_config?.[currentRound - 1].slots;
  const totalRounds = challengeData.game_config?.length;

  useAudioBeat({
    src: "/song.mp3",
    bpm: BPM,
    offsetSec: 0.03,
    onBeatEnd: () => {
      onPlayingEnd();
    },
    onBeat: (beat) => {
      console.log(beat);
      const round = Math.floor(beat / ROUND_BEATS) + 1;
      if (round > totalRounds) {
        setFocusedIndex(null);
        return;
      }

      setCurrentRound(round);

      const blockIndex = Math.floor(beat / BLOCK_SIZE);
      const isActiveBlock = blockIndex % 2 === 1;

      if (!isActiveBlock) {
        setFocusedIndex(null);
      } else {
        setFocusedIndex(beat % STEPS);
      }
    },
  });

  return (
    <div className="relative flex items-center justify-center h-full p-4 md:p-6">
      <div className="relative w-full max-w-4xl space-y-8">
        {/* 좌측 상단 - loud-speaker */}
        <div className="absolute -top-6 -left-20 md:-top-10 md:-left-28 w-32 h-32 md:w-30 md:h-30 animate-wiggle-1">
          <Image
            src="/loud-speaker.png"
            alt="loud-speaker"
            fill
            className="object-cover opacity-80"
          />
        </div>

        {/* 우측 상단 - question */}
        <div className="absolute -top-8 -right-20 md:-top-10 md:-right-28 w-32 h-32 md:w-28 md:h-28 animate-wiggle-2">
          <Image
            src="/question.png"
            alt="question"
            fill
            className="object-cover opacity-80"
          />
        </div>

        <p className="chalk-text text-chalk-white text-3xl md:text-3xl text-center">
          라운드 {currentRound} / {totalRounds}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2 lg:gap-3">
          {slots?.map((slot, index) => {
            const imagePath = slot.imagePath;
            const isFocused = focusedIndex === index;
            const name = slot.displayText ?? "";

            return (
              <div
                key={index}
                className={`
                    relative aspect-square rounded-md overflow-hidden
                    transition-transform duration-300
                    ${isFocused ? "ring-4 ring-chalk-yellow" : ""}
                  `}
              >
                {imagePath ? (
                  <>
                    <Image
                      src={imagePath}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="chalk-text text-chalk-yellow text-center text-sm md:text-base font-bold truncate">
                        {name}
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
      </div>
    </div>
  );
};

export default PlayingGameStage;
