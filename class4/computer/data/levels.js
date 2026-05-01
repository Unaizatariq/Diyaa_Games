export const class4ComputerLevels = [
    { id: 1, title: "Uses of Computers", mechanic: "uses", moduleId: "class4_computer_01_uses" },
    { id: 2, title: "Basic Hardware Components", mechanic: "hardware", moduleId: "class4_computer_02_hardware" },
    { id: 3, title: "Input Devices", mechanic: "input-devices", moduleId: "class4_computer_03_input-devices" },
    { id: 4, title: "Output Devices", mechanic: "output-devices", moduleId: "class4_computer_04_output-devices" },
    { id: 5, title: "Windows Basics", mechanic: "windows-basics", moduleId: "class4_computer_05_windows-basics" },
    { id: 6, title: "File Management", mechanic: "file-management", moduleId: "class4_computer_06_file-management" },
    { id: 7, title: "Tux Paint Tools", mechanic: "tux-paint", moduleId: "class4_computer_07_tux-paint" },
    { id: 8, title: "Digital Drawing", mechanic: "drawing-creativity", moduleId: "class4_computer_08_drawing-creativity" },
    { id: 9, title: "Kturtle Commands", mechanic: "kturtle", moduleId: "class4_computer_09_kturtle" },
    { id: 10, title: "Programming Logic Intro", mechanic: "programming-logic", moduleId: "class4_computer_10_programming-logic" }
];

export function getClass4ComputerLevel(level) {
    return class4ComputerLevels.find(l => l.id === level) || class4ComputerLevels[0];
}
