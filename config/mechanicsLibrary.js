export const mechanicsLibrary = [
    {
        id: "tap-choice-race",
        family: "tap",
        inputMode: "single-tap",
        summary: "Tap the correct option before the timer ends."
    },
    {
        id: "drag-drop-sort",
        family: "drag-drop",
        inputMode: "drag",
        summary: "Drag cards into matching buckets."
    },
    {
        id: "audio-clue-hunt",
        family: "audio",
        inputMode: "tap-audio",
        summary: "Listen to a clue and select matching answer."
    },
    {
        id: "memory-flip-grid",
        family: "memory",
        inputMode: "tap-pairs",
        summary: "Flip and match hidden concept cards."
    },
    {
        id: "sequence-track",
        family: "sequencing",
        inputMode: "drag-order",
        summary: "Arrange items in the correct sequence."
    },
    {
        id: "pattern-puzzle",
        family: "puzzle",
        inputMode: "tap-and-place",
        summary: "Complete the missing pattern pieces."
    },
    {
        id: "voice-challenge",
        family: "voice",
        inputMode: "speech",
        summary: "Speak the correct answer to continue."
    },
    {
        id: "trace-and-build",
        family: "tracing",
        inputMode: "drag-trace",
        summary: "Trace or draw then confirm with a challenge."
    },
    {
        id: "mission-quiz",
        family: "mission",
        inputMode: "multi-step",
        summary: "Clear several mini-objectives in one mission."
    },
    {
        id: "pathfinder-board",
        family: "strategy",
        inputMode: "tap-path",
        summary: "Move along paths by solving concept prompts."
    },
    {
        id: "lab-simulation",
        family: "simulation",
        inputMode: "drag-toggle",
        summary: "Run small experiments to observe outcomes."
    },
    {
        id: "boss-revision",
        family: "revision",
        inputMode: "mixed",
        summary: "Mixed mechanic challenge that revises prior topics."
    }
];

export const progressionModes = {
    practice: { rounds: 8, scorePerCorrect: 10, stars: [60, 80, 95] },
    mastery: { rounds: 10, scorePerCorrect: 12, stars: [65, 85, 100] },
    challenge: { rounds: 12, scorePerCorrect: 15, stars: [70, 90, 110] }
};

