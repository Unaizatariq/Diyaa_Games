export const class5UrduLevels = [
    { id: 1, title: "Alfaaz", mechanic: "alfaaz", moduleId: "class5_urdu_01_alfaaz" },
    { id: 2, title: "Jumlay", mechanic: "jumlay", moduleId: "class5_urdu_02_jumlay" },
    { id: 3, title: "Ism", mechanic: "ism", moduleId: "class5_urdu_03_ism" },
    { id: 4, title: "Fail", mechanic: "fail", moduleId: "class5_urdu_04_fail" },
    { id: 5, title: "Sifat", mechanic: "sifat", moduleId: "class5_urdu_05_sifat" },
    { id: 6, title: "Zamir", mechanic: "zamir", moduleId: "class5_urdu_06_zamir" },
    { id: 7, title: "Jama aur Wahid", mechanic: "jama-wahid", moduleId: "class5_urdu_07_jama-wahid" },
    { id: 8, title: "Mutazad Alfaaz", mechanic: "mutazad", moduleId: "class5_urdu_08_mutazad" },
    { id: 9, title: "Imla", mechanic: "imla", moduleId: "class5_urdu_09_imla" },
    { id: 10, title: "Khushkhati", mechanic: "khushkhati", moduleId: "class5_urdu_10_khushkhati" },
    { id: 11, title: "Mazmoon Nigari", mechanic: "mazmoon", moduleId: "class5_urdu_11_mazmoon" },
    { id: 12, title: "Kahani Likhnay ki Mashq", mechanic: "kahani", moduleId: "class5_urdu_12_kahani" },
    { id: 13, title: "Tasveer se Kahani", mechanic: "tasveer-kahani", moduleId: "class5_urdu_13_tasveer-kahani" }
];

export function getClass5UrduLevel(level) {
    return class5UrduLevels.find(l => l.id === level) || class5UrduLevels[0];
}
