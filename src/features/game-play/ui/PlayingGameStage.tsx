import {
  DatabaseChallenge,
  GameConfigStruct,
  Slot,
} from "@/entities/challenge";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useAudioBeat } from "../hooks/useAudioBeat";

interface PlayingGameStage {
  challengeData: DatabaseChallenge;
}

const BPM = 182;
const BLOCK_SIZE = 8;
const STEPS = 8;
const ROUND_BEATS = 16;

const PlayingGameStage = ({ challengeData }: PlayingGameStage) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(1);

  const slots = challengeData.game_config?.[currentRound - 1].slots;
  const totalRounds = challengeData.game_config?.length;

  useAudioBeat({
    src: "/song.mp3",
    bpm: BPM,
    offsetSec: 0.03,
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
    <div className="flex items-center justify-center h-full p-4 md:p-6">
      <div className="w-full max-w-4xl space-y-4">
        <p className="chalk-text text-chalk-white text-lg md:text-xl text-center">
          라운드 {currentRound} / {totalRounds}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
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
