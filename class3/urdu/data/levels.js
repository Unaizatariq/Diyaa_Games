export const class3UrduLevels = [
    { id: 1, title: "حروف تہجی ریویژن", mechanic: "huroof", moduleId: "class3_urdu_01_huroof" },
    { id: 2, title: "الفاظ", mechanic: "alfaaz", moduleId: "class3_urdu_02_alfaaz" },
    { id: 3, title: "جملے", mechanic: "jumlay", moduleId: "class3_urdu_03_jumlay" },
    { id: 4, title: "اسم", mechanic: "ism", moduleId: "class3_urdu_04_ism" },
    { id: 5, title: "فعل", mechanic: "fail", moduleId: "class3_urdu_05_fail" },
    { id: 6, title: "صفت", mechanic: "sifat", moduleId: "class3_urdu_06_sifat" },
    { id: 7, title: "متضاد الفاظ", mechanic: "mutazad", moduleId: "class3_urdu_07_mutazad" },
    { id: 8, title: "جمع", mechanic: "jama", moduleId: "class3_urdu_08_jama" },
    { id: 9, title: "واحد جمع", mechanic: "wahid-jama", moduleId: "class3_urdu_09_wahid-jama" },
    { id: 10, title: "املا", mechanic: "imla", moduleId: "class3_urdu_10_imla" },
    { id: 11, title: "خوشخطی", mechanic: "khushkhati", moduleId: "class3_urdu_11_khushkhati" },
    { id: 12, title: "تصویر سے کہانی", mechanic: "tasveer-kahani", moduleId: "class3_urdu_12_tasveer-kahani" },
    { id: 13, title: "مضمون", mechanic: "mazmoon", moduleId: "class3_urdu_13_mazmoon" }
];

export function getClass3UrduLevel(level) {
    return class3UrduLevels.find(l => l.id === level) || class3UrduLevels[0];
}

