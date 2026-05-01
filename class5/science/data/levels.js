export const class5ScienceLevels = [
    { id: 1, title: "Classification of Living Organisms", mechanic: "classification", moduleId: "class5_science_01_classification" },
    { id: 2, title: "Flowering Plants", mechanic: "monocot-dicot", moduleId: "class5_science_02_monocot-dicot" },
    { id: 3, title: "Microorganisms", mechanic: "microorganisms", moduleId: "class5_science_03_microorganisms" },
    { id: 4, title: "Human Body Systems", mechanic: "body-systems", moduleId: "class5_science_04_body-systems" },
    { id: 5, title: "Ecosystems and Energy Flow", mechanic: "ecosystem", moduleId: "class5_science_05_ecosystem" },
    { id: 6, title: "Matter Changes", mechanic: "matter-changes", moduleId: "class5_science_06_matter-changes" },
    { id: 7, title: "Light", mechanic: "light", moduleId: "class5_science_07_light" },
    { id: 8, title: "Sound", mechanic: "sound", moduleId: "class5_science_08_sound" },
    { id: 9, title: "Electricity", mechanic: "electricity", moduleId: "class5_science_09_electricity" },
    { id: 10, title: "Magnetism", mechanic: "magnetism", moduleId: "class5_science_10_magnetism" },
    { id: 11, title: "Structure of the Earth", mechanic: "earth-structure", moduleId: "class5_science_11_earth-structure" },
    { id: 12, title: "Soil", mechanic: "soil", moduleId: "class5_science_12_soil" },
    { id: 13, title: "Earth, Moon and Sun", mechanic: "earth-moon-sun", moduleId: "class5_science_13_earth-moon-sun" },
    { id: 14, title: "Artificial Satellites", mechanic: "satellites", moduleId: "class5_science_14_satellites" },
    { id: 15, title: "Technology in Everyday Life", mechanic: "technology-impact", moduleId: "class5_science_15_technology-impact" }
];

export function getClass5ScienceLevel(level) {
    return class5ScienceLevels.find(l => l.id === level) || class5ScienceLevels[0];
}
