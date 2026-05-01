export const class2UrduLevels = [
    { id: 1, title: "حروف تہجی ریویژن", mechanic: "huroof-revision", moduleId: "class2_urdu_01_huroof-revision" },
    { id: 2, title: "نقاط", mechanic: "dots", moduleId: "class2_urdu_02_dots" },
    { id: 3, title: "جھوٹی اشکال", mechanic: "odd-shape", moduleId: "class2_urdu_03_odd-shape" },
    { id: 4, title: "ملتے جلتے حروف", mechanic: "similar-letters", moduleId: "class2_urdu_04_similar-letters" },
    { id: 5, title: "الفاظ", mechanic: "words", moduleId: "class2_urdu_05_words" },
    { id: 6, title: "حروف کی ترتیب", mechanic: "sequence", moduleId: "class2_urdu_06_sequence" },
    { id: 7, title: "حروف کو ملانا", mechanic: "matching-letters", moduleId: "class2_urdu_07_matching-letters" },
    { id: 8, title: "سادہ جملے", mechanic: "simple-sentences", moduleId: "class2_urdu_08_simple-sentences" },
    { id: 9, title: "مکمل جملے", mechanic: "complete-sentences", moduleId: "class2_urdu_09_complete-sentences" },
    { id: 10, title: "متضاد الفاظ", mechanic: "opposites", moduleId: "class2_urdu_10_opposites" },
    { id: 11, title: "تصویر سے الفاظ", mechanic: "picture-words", moduleId: "class2_urdu_11_picture-words" },
    { id: 12, title: "املا", mechanic: "dictation", moduleId: "class2_urdu_12_dictation" },
    { id: 13, title: "خوشخطی", mechanic: "handwriting", moduleId: "class2_urdu_13_handwriting" }
];

export function getClass2UrduLevel(level) {
    return class2UrduLevels.find(item => item.id === level) || class2UrduLevels[0];
}

