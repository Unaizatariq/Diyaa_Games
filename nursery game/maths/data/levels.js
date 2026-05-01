export const mathsLevels = [
    {
        id: 1,
        moduleId: "nursery_maths_01_counting-1-20",
        title1: "Counting",
        title2: "Tap Quest",
        subtitle: "Tap the correct number from 1 to 20",
        mechanic: "tap-choice",
        difficulty: { rounds: 8, answerDelayMs: 520, hintAfterWrong: 2 }
    },
    {
        id: 2,
        moduleId: "nursery_maths_02_2d-shapes",
        title1: "Shape",
        title2: "Sorter",
        subtitle: "Drag each shape to the right basket",
        mechanic: "shape-sort",
        difficulty: { rounds: 6, answerDelayMs: 560, hintAfterWrong: 2 }
    },
    {
        id: 3,
        moduleId: "nursery_maths_03_before-after-between-numbers",
        title1: "Before After",
        title2: "Track",
        subtitle: "Find the number before, after, or between",
        mechanic: "number-sequence",
        difficulty: { rounds: 8, answerDelayMs: 560, hintAfterWrong: 2 }
    },
    {
        id: 4,
        moduleId: "nursery_maths_04_concepts-tall-short-more-less-long-short",
        title1: "Concept",
        title2: "Detective",
        subtitle: "Pick more/less, tall/short, long/short",
        mechanic: "concept-compare",
        difficulty: { rounds: 8, answerDelayMs: 560, hintAfterWrong: 2 }
    },
    {
        id: 5,
        moduleId: "nursery_maths_05_count-and-match",
        title1: "Count",
        title2: "and Match",
        subtitle: "Count objects and drag number to target",
        mechanic: "count-drag",
        difficulty: { rounds: 8, answerDelayMs: 600, hintAfterWrong: 2 }
    },
    {
        id: 6,
        moduleId: "nursery_maths_06_missing-numbers",
        title1: "Missing",
        title2: "Numbers",
        subtitle: "Complete the number train",
        mechanic: "missing-number",
        difficulty: { rounds: 8, answerDelayMs: 560, hintAfterWrong: 2 }
    },
    {
        id: 7,
        moduleId: "nursery_maths_07_number-words-one-to-five",
        title1: "Number Word",
        title2: "Memory",
        subtitle: "Match number cards with words",
        mechanic: "memory-number-words",
        difficulty: { rounds: 1, answerDelayMs: 560, hintAfterWrong: 3 }
    },
    {
        id: 8,
        moduleId: "nursery_maths_08_quantity-comparison",
        title1: "Pattern",
        title2: "Puzzle",
        subtitle: "Complete the growing pattern",
        mechanic: "pattern-puzzle",
        difficulty: { rounds: 8, answerDelayMs: 560, hintAfterWrong: 2 }
    }
];

export function getMathsLevel(levelId) {
    return mathsLevels.find(level => level.id === levelId) || mathsLevels[0];
}
