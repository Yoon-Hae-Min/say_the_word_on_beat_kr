export {
  createChallenge,
  getChallengeById,
  incrementViewCount,
  getPopularChallenges,
  getAllChallenges,
  getPublicChallengesCount,
} from "./api";
export type {
  Challenge,
  ChallengeData,
  Round,
  Slot,
  BeatSlot,
  GameConfigStruct,
  DatabaseChallenge,
  ChallengeInsert,
  ChallengeUpdate,
} from "./model";
