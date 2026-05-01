export const class2EnglishLevels = [
    { id: 1, title: "Alphabets Revision", mechanic: "alphabet-revision", moduleId: "class2_english_01_alphabet-revision" },
    { id: 2, title: "Vowels and Consonants", mechanic: "vowel-consonant", moduleId: "class2_english_02_vowels-consonants" },
    { id: 3, title: "Nouns", mechanic: "nouns", moduleId: "class2_english_03_nouns" },
    { id: 4, title: "Pronouns", mechanic: "pronouns", moduleId: "class2_english_04_pronouns" },
    { id: 5, title: "Verbs", mechanic: "verbs", moduleId: "class2_english_05_verbs" },
    { id: 6, title: "Adjectives", mechanic: "adjectives", moduleId: "class2_english_06_adjectives" },
    { id: 7, title: "Prepositions", mechanic: "prepositions", moduleId: "class2_english_07_prepositions" },
    { id: 8, title: "Articles", mechanic: "articles", moduleId: "class2_english_08_articles" },
    { id: 9, title: "Singular and Plural", mechanic: "singular-plural", moduleId: "class2_english_09_singular-plural" },
    { id: 10, title: "Opposites", mechanic: "opposites", moduleId: "class2_english_10_opposites" },
    { id: 11, title: "Sentence Making", mechanic: "sentence-making", moduleId: "class2_english_11_sentence-making" },
    { id: 12, title: "Reading Comprehension", mechanic: "reading-comprehension", moduleId: "class2_english_12_reading-comprehension" },
    { id: 13, title: "Picture Description", mechanic: "picture-description", moduleId: "class2_english_13_picture-description" },
    { id: 14, title: "Creative Writing", mechanic: "creative-writing", moduleId: "class2_english_14_creative-writing" }
];

export function getClass2EnglishLevel(level) {
    return class2EnglishLevels.find(item => item.id === level) || class2EnglishLevels[0];
}

