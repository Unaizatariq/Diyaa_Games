export const class1EnglishLevels = [
    { id: 1, moduleId: "class1_english_01_forms-of-verbs", title: "Forms of Verbs", mechanic: "verb-form" },
    { id: 2, moduleId: "class1_english_02_pronouns", title: "Pronouns", mechanic: "pronoun-replace" },
    { id: 3, moduleId: "class1_english_03_adjectives", title: "Adjectives", mechanic: "adjective-pick" },
    { id: 4, moduleId: "class1_english_04_opposites", title: "Opposites", mechanic: "opposites-match" },
    { id: 5, moduleId: "class1_english_05_request-and-command", title: "Request vs Command", mechanic: "request-command" },
    { id: 6, moduleId: "class1_english_06_there-and-their", title: "There and Their", mechanic: "there-their" },
    { id: 7, moduleId: "class1_english_07_time", title: "Time Words", mechanic: "time-sentence" },
    { id: 8, moduleId: "class1_english_08_irregular-singular-plurals", title: "Irregular Plurals", mechanic: "plural-forms" },
    { id: 9, moduleId: "class1_english_09_punctuation", title: "Punctuation", mechanic: "punctuation-fix" },
    { id: 10, moduleId: "class1_english_10_picture-description-composition", title: "Picture Description", mechanic: "composition-builder" }
];

export function getClass1EnglishLevel(level) {
    return class1EnglishLevels.find(item => item.id === level) || class1EnglishLevels[0];
}

