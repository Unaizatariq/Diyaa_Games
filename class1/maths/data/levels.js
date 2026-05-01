export const class1MathsLevels = [
    { id: 1, moduleId: "class1_maths_01_tables-4-oral", title: "Table of 4 (Oral)", mechanic: "table-oral-4" },
    { id: 2, moduleId: "class1_maths_02_tables-5-written", title: "Table of 5 (Written)", mechanic: "table-written-5" },
    { id: 3, moduleId: "class1_maths_03_counting-forward-400-500", title: "Forward Counting 400-500", mechanic: "count-forward" },
    { id: 4, moduleId: "class1_maths_04_counting-backward-100-0", title: "Backward Counting 100-0", mechanic: "count-backward" },
    { id: 5, moduleId: "class1_maths_05_number-spelling-71-100", title: "Number Spelling 71-100", mechanic: "number-spelling" },
    { id: 6, moduleId: "class1_maths_06_addition", title: "Addition", mechanic: "addition" },
    { id: 7, moduleId: "class1_maths_07_subtraction", title: "Subtraction", mechanic: "subtraction" },
    { id: 8, moduleId: "class1_maths_08_time", title: "Time", mechanic: "time-read" }
];

export function getClass1MathsLevel(level) {
    return class1MathsLevels.find(item => item.id === level) || class1MathsLevels[0];
}

