export const class1UrduLevels = [
    { id: 1, moduleId: "class1_urdu_01_huroof-e-tahajji", title: "حروفِ تہجی", mechanic: "tap-letter" },
    { id: 2, moduleId: "class1_urdu_02_nuqaat-dots", title: "نقاط", mechanic: "dot-count" },
    { id: 3, moduleId: "class1_urdu_03_milte-julte-huroof", title: "ملتے جلتے حروف", mechanic: "similar-letters" },
    { id: 4, moduleId: "class1_urdu_04_jhooti-ashkaal", title: "جھوٹی اشکال", mechanic: "odd-shape" },
    { id: 5, moduleId: "class1_urdu_05_alfaaz-words", title: "الفاظ", mechanic: "word-build" },
    { id: 6, moduleId: "class1_urdu_06_huroof-ki-tarteeb", title: "حروف کی ترتیب", mechanic: "letter-sequence" },
    { id: 7, moduleId: "class1_urdu_07_aagay-peechay-huroof", title: "آگے پیچھے حروف", mechanic: "before-after" },
    { id: 8, moduleId: "class1_urdu_08_huroof-ko-milana", title: "حروف کو ملانا", mechanic: "letter-match" },
    { id: 9, moduleId: "class1_urdu_09_saaday-jumlay", title: "سادہ جملے", mechanic: "sentence-build" },
    { id: 10, moduleId: "class1_urdu_10_tasveer-se-alfaaz", title: "تصویر سے الفاظ", mechanic: "picture-word" },
    { id: 11, moduleId: "class1_urdu_11_matching-exercises", title: "Matching Exercise", mechanic: "memory-match" },
    { id: 12, moduleId: "class1_urdu_12_fill-in-the-blanks", title: "خالی جگہ پُر کریں", mechanic: "fill-blanks" }
];

export function getClass1UrduLevel(level) {
    return class1UrduLevels.find(item => item.id === level) || class1UrduLevels[0];
}

