export const class4ScienceLevels = [
    { id: 1, title: "Life Processes", mechanic: "life-processes", moduleId: "class4_science_01_life-processes" },
    { id: 2, title: "Classification of Animals", mechanic: "animal-classification", moduleId: "class4_science_02_animal-classification" },
    { id: 3, title: "Human Body Organs", mechanic: "body-organs", moduleId: "class4_science_03_body-organs" },
    { id: 4, title: "Human Teeth", mechanic: "teeth", moduleId: "class4_science_04_teeth" },
    { id: 5, title: "States of Matter", mechanic: "states-of-matter", moduleId: "class4_science_05_states-of-matter" },
    { id: 6, title: "Properties of Matter", mechanic: "properties-of-matter", moduleId: "class4_science_06_properties-of-matter" },
    { id: 7, title: "Forms of Energy", mechanic: "forms-of-energy", moduleId: "class4_science_07_forms-of-energy" },
    { id: 8, title: "Forces and Simple Machines", mechanic: "forces-machines", moduleId: "class4_science_08_forces-machines" },
    { id: 9, title: "Natural Resources", mechanic: "natural-resources", moduleId: "class4_science_09_natural-resources" },
    { id: 10, title: "Soil and Importance", mechanic: "soil", moduleId: "class4_science_10_soil" },
    { id: 11, title: "Solar System", mechanic: "solar-system", moduleId: "class4_science_11_solar-system" },
    { id: 12, title: "Day and Night Cycle", mechanic: "day-night", moduleId: "class4_science_12_day-night" },
    { id: 13, title: "Balanced Diet and Nutrients", mechanic: "balanced-diet", moduleId: "class4_science_13_balanced-diet" },
    { id: 14, title: "Communicable Diseases", mechanic: "diseases-prevention", moduleId: "class4_science_14_diseases-prevention" }
];

export function getClass4ScienceLevel(level) {
    return class4ScienceLevels.find(l => l.id === level) || class4ScienceLevels[0];
}
