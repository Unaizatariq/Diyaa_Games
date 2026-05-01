export const class2MathsLevels = [
    { id: 1, title: "Numbers 1-1000", mechanic: "numbers-1-1000", moduleId: "class2_maths_01_numbers-1-1000" },
    { id: 2, title: "Place Value", mechanic: "place-value", moduleId: "class2_maths_02_place-value" },
    { id: 3, title: "Addition", mechanic: "addition", moduleId: "class2_maths_03_addition" },
    { id: 4, title: "Subtraction", mechanic: "subtraction", moduleId: "class2_maths_04_subtraction" },
    { id: 5, title: "Multiplication", mechanic: "multiplication", moduleId: "class2_maths_05_multiplication" },
    { id: 6, title: "Division (Basic)", mechanic: "division-basic", moduleId: "class2_maths_06_division-basic" },
    { id: 7, title: "Even and Odd", mechanic: "even-odd", moduleId: "class2_maths_07_even-odd" },
    { id: 8, title: "Number Comparison", mechanic: "number-comparison", moduleId: "class2_maths_08_number-comparison" },
    { id: 9, title: "Shapes 2D", mechanic: "shapes-2d", moduleId: "class2_maths_09_shapes-2d" },
    { id: 10, title: "Measurement", mechanic: "measurement", moduleId: "class2_maths_10_measurement" },
    { id: 11, title: "Time", mechanic: "time-clock", moduleId: "class2_maths_11_time-clock" },
    { id: 12, title: "Money", mechanic: "money", moduleId: "class2_maths_12_money" },
    { id: 13, title: "Word Problems", mechanic: "word-problems", moduleId: "class2_maths_13_word-problems" },
    { id: 14, title: "Patterns", mechanic: "patterns", moduleId: "class2_maths_14_patterns" }
];

export function getClass2MathsLevel(level) {
    return class2MathsLevels.find(item => item.id === level) || class2MathsLevels[0];
}

