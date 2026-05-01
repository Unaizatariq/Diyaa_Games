export const class3MathsLevels = [
    { id: 1, title: "Numbers 1-10000", mechanic: "numbers", moduleId: "class3_maths_01_numbers" },
    { id: 2, title: "Place Value", mechanic: "place-value", moduleId: "class3_maths_02_place-value" },
    { id: 3, title: "Addition and Subtraction", mechanic: "add-sub", moduleId: "class3_maths_03_add-sub" },
    { id: 4, title: "Multiplication", mechanic: "multiplication", moduleId: "class3_maths_04_multiplication" },
    { id: 5, title: "Division", mechanic: "division", moduleId: "class3_maths_05_division" },
    { id: 6, title: "Fractions (Basic)", mechanic: "fractions", moduleId: "class3_maths_06_fractions" },
    { id: 7, title: "Even and Odd", mechanic: "even-odd", moduleId: "class3_maths_07_even-odd" },
    { id: 8, title: "Geometry (Shapes)", mechanic: "geometry", moduleId: "class3_maths_08_geometry" },
    { id: 9, title: "Measurement", mechanic: "measurement", moduleId: "class3_maths_09_measurement" },
    { id: 10, title: "Time and Calendar", mechanic: "time-calendar", moduleId: "class3_maths_10_time-calendar" },
    { id: 11, title: "Money Problems", mechanic: "money", moduleId: "class3_maths_11_money" },
    { id: 12, title: "Word Problems", mechanic: "word-problems", moduleId: "class3_maths_12_word-problems" },
    { id: 13, title: "Patterns", mechanic: "patterns", moduleId: "class3_maths_13_patterns" },
    { id: 14, title: "Data Handling", mechanic: "data", moduleId: "class3_maths_14_data-handling" }
];

export function getClass3MathsLevel(level) {
    return class3MathsLevels.find(l => l.id === level) || class3MathsLevels[0];
}

