export const class4UrduLevels = [
    { id: 1, title: "الفاظ", mechanic: "alfaaz", moduleId: "class4_urdu_01_alfaaz" },
    { id: 2, title: "جملے", mechanic: "jumlay", moduleId: "class4_urdu_02_jumlay" },
    { id: 3, title: "اسم", mechanic: "ism", moduleId: "class4_urdu_03_ism" },
    { id: 4, title: "فعل", mechanic: "fail", moduleId: "class4_urdu_04_fail" },
    { id: 5, title: "صفت", mechanic: "sifat", moduleId: "class4_urdu_05_sifat" },
    { id: 6, title: "ضمیر", mechanic: "zamir", moduleId: "class4_urdu_06_zamir" },
    { id: 7, title: "جمع اور واحد", mechanic: "jama-wahid", moduleId: "class4_urdu_07_jama-wahid" },
    { id: 8, title: "متضاد الفاظ", mechanic: "mutazad", moduleId: "class4_urdu_08_mutazad" },
    { id: 9, title: "املا", mechanic: "imla", moduleId: "class4_urdu_09_imla" },
    { id: 10, title: "خوشخطی", mechanic: "khushkhati", moduleId: "class4_urdu_10_khushkhati" },
    { id: 11, title: "مضمون نگاری", mechanic: "mazmoon", moduleId: "class4_urdu_11_mazmoon" },
    { id: 12, title: "کہانی لکھنے کی مشق", mechanic: "kahani", moduleId: "class4_urdu_12_kahani" }
];

export function getClass4UrduLevel(level) {
    return class4UrduLevels.find(l => l.id === level) || class4UrduLevels[0];
}

