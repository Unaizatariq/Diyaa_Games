export const class5ComputerLevels = [
    { id: 1, title: "Hardware Components", mechanic: "hardware", moduleId: "class5_computer_01_hardware" },
    { id: 2, title: "Input and Output Devices", mechanic: "io-devices", moduleId: "class5_computer_02_io-devices" },
    { id: 3, title: "System vs Application Software", mechanic: "software-types", moduleId: "class5_computer_03_software-types" },
    { id: 4, title: "Operating System Basics", mechanic: "os-basics", moduleId: "class5_computer_04_os-basics" },
    { id: 5, title: "MS Word Basics", mechanic: "ms-word", moduleId: "class5_computer_05_ms-word" },
    { id: 6, title: "MS Excel Formulas", mechanic: "excel-formulas", moduleId: "class5_computer_06_excel-formulas" },
    { id: 7, title: "MS Excel Charts", mechanic: "excel-charts", moduleId: "class5_computer_07_excel-charts" },
    { id: 8, title: "MS PowerPoint", mechanic: "powerpoint", moduleId: "class5_computer_08_powerpoint" },
    { id: 9, title: "Algorithmic Thinking", mechanic: "algorithm", moduleId: "class5_computer_09_algorithm" },
    { id: 10, title: "Conditional Logic", mechanic: "conditional", moduleId: "class5_computer_10_conditional" },
    { id: 11, title: "Scratch Basics", mechanic: "scratch", moduleId: "class5_computer_11_scratch" },
    { id: 12, title: "Animations and Stories", mechanic: "animation-story", moduleId: "class5_computer_12_animation-story" },
    { id: 13, title: "Basic Debugging", mechanic: "debugging", moduleId: "class5_computer_13_debugging" },
    { id: 14, title: "Cyber Safety and Ethics", mechanic: "cyber-safety", moduleId: "class5_computer_14_cyber-safety" },
    { id: 15, title: "Responsible AI Use", mechanic: "ai-responsibility", moduleId: "class5_computer_15_ai-responsibility" }
];

export function getClass5ComputerLevel(level) {
    return class5ComputerLevels.find(l => l.id === level) || class5ComputerLevels[0];
}
