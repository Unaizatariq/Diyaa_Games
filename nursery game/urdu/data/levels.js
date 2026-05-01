export const urduLevels = [
    {
        id: 1,
        moduleId: "nursery_urdu_01_huroof-e-tahajji",
        title1: "حروف",
        title2: "تلاش",
        subtitle: "درست حرف پر ٹیپ کریں",
        mechanic: "tap-letter",
        difficulty: { rounds: 8, answerDelayMs: 520, hintAfterWrong: 2 }
    },
    {
        id: 2,
        moduleId: "nursery_urdu_02_nuqaat-dots",
        title1: "نقاط",
        title2: "گیم",
        subtitle: "نقطوں کے مطابق حرف منتخب کریں",
        mechanic: "dot-count",
        difficulty: { rounds: 8, answerDelayMs: 560, hintAfterWrong: 2 }
    },
    {
        id: 3,
        moduleId: "nursery_urdu_03_jhooti-ashkaal",
        title1: "جھوٹی",
        title2: "اشکال",
        subtitle: "غیر حرف شکل تلاش کریں",
        mechanic: "odd-shape",
        difficulty: { rounds: 8, answerDelayMs: 560, hintAfterWrong: 2 }
    },
    {
        id: 4,
        moduleId: "nursery_urdu_04_sequence-of-letters",
        title1: "حروف",
        title2: "ترتیب",
        subtitle: "حروف کو درست ترتیب میں رکھیں",
        mechanic: "sequence-drag",
        difficulty: { rounds: 6, answerDelayMs: 580, hintAfterWrong: 2 }
    },
    {
        id: 5,
        moduleId: "nursery_urdu_05_matching-letters",
        title1: "ایک جیسے",
        title2: "حروف",
        subtitle: "یادداشت سے جوڑے بنائیں",
        mechanic: "memory-match",
        difficulty: { rounds: 1, answerDelayMs: 560, hintAfterWrong: 3 }
    },
    {
        id: 6,
        moduleId: "nursery_urdu_06_letter-sound-awareness",
        title1: "پہلا حرف",
        title2: "پہچان",
        subtitle: "لفظ کا پہلا حرف منتخب کریں",
        mechanic: "first-letter",
        difficulty: { rounds: 8, answerDelayMs: 560, hintAfterWrong: 2 }
    },
    {
        id: 7,
        moduleId: "nursery_urdu_07_visual-letter-discrimination",
        title1: "حروف",
        title2: "گروپنگ",
        subtitle: "نقطہ والے اور بغیر نقطہ حروف الگ کریں",
        mechanic: "sort-groups",
        difficulty: { rounds: 6, answerDelayMs: 580, hintAfterWrong: 2 }
    },
    {
        id: 8,
        moduleId: "nursery_urdu_09_picture-to-letter-match",
        title1: "آواز",
        title2: "چیلنج",
        subtitle: "حرف بولیں اور اگلے راؤنڈ میں جائیں",
        mechanic: "voice-letter",
        difficulty: { rounds: 6, answerDelayMs: 620, hintAfterWrong: 2 }
    }
];

export function getUrduLevel(levelId) {
    return urduLevels.find(level => level.id === levelId) || urduLevels[0];
}
