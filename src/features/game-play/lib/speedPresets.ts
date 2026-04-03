export const SPEED_PRESETS = [
	{ value: "0.5", label: "0.5x", rate: 0.5 },
	{ value: "0.75", label: "0.75x", rate: 0.75 },
	{ value: "1", label: "1.0x", rate: 1.0 },
	{ value: "1.25", label: "1.25x", rate: 1.25 },
	{ value: "1.5", label: "1.5x", rate: 1.5 },
	{ value: "2", label: "2.0x", rate: 2.0 },
] as const;

export type PlaybackSpeed = (typeof SPEED_PRESETS)[number]["rate"];

export const DEFAULT_SPEED: PlaybackSpeed = 1.0;
