export const class4MathsLevels = [
    { id: 1, title: "Numbers 1-100000", mechanic: "numbers", moduleId: "class4_maths_01_numbers" },
    { id: 2, title: "Place Value", mechanic: "place-value", moduleId: "class4_maths_02_place-value" },
    { id: 3, title: "Addition and Subtraction", mechanic: "add-sub", moduleId: "class4_maths_03_add-sub" },
    { id: 4, title: "Multiplication", mechanic: "multiplication", moduleId: "class4_maths_04_multiplication" },
    { id: 5, title: "Division", mechanic: "division", moduleId: "class4_maths_05_division" },
    { id: 6, title: "Factors and Multiples", mechanic: "factors-multiples", moduleId: "class4_maths_06_factors-multiples" },
    { id: 7, title: "Fractions", mechanic: "fractions", moduleId: "class4_maths_07_fractions" },
    { id: 8, title: "Decimals", mechanic: "decimals", moduleId: "class4_maths_08_decimals" },
    { id: 9, title: "Geometry", mechanic: "geometry", moduleId: "class4_maths_09_geometry" },
    { id: 10, title: "Measurement", mechanic: "measurement", moduleId: "class4_maths_10_measurement" },
    { id: 11, title: "Time and Calendar", mechanic: "time-calendar", moduleId: "class4_maths_11_time-calendar" },
    { id: 12, title: "Money Problems", mechanic: "money", moduleId: "class4_maths_12_money" },
    { id: 13, title: "Word Problems", mechanic: "word-problems", moduleId: "class4_maths_13_word-problems" },
    { id: 14, title: "Data Handling", mechanic: "data", moduleId: "class4_maths_14_data-handling" }
];

export function getClass4MathsLevel(level) {
    return class4MathsLevels.find(l => l.id === level) || class4MathsLevels[0];
}

