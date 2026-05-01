export const class3EnglishLevels = [
    { id: 1, title: "Alphabets Revision", mechanic: "alphabet", moduleId: "class3_english_01_alphabet-revision" },
    { id: 2, title: "Nouns", mechanic: "nouns", moduleId: "class3_english_02_nouns" },
    { id: 3, title: "Pronouns", mechanic: "pronouns", moduleId: "class3_english_03_pronouns" },
    { id: 4, title: "Verbs", mechanic: "verbs", moduleId: "class3_english_04_verbs" },
    { id: 5, title: "Adjectives", mechanic: "adjectives", moduleId: "class3_english_05_adjectives" },
    { id: 6, title: "Adverbs", mechanic: "adverbs", moduleId: "class3_english_06_adverbs" },
    { id: 7, title: "Prepositions", mechanic: "prepositions", moduleId: "class3_english_07_prepositions" },
    { id: 8, title: "Conjunctions", mechanic: "conjunctions", moduleId: "class3_english_08_conjunctions" },
    { id: 9, title: "Articles", mechanic: "articles", moduleId: "class3_english_09_articles" },
    { id: 10, title: "Singular and Plural", mechanic: "plural", moduleId: "class3_english_10_plural" },
    { id: 11, title: "Basic Tenses", mechanic: "tenses", moduleId: "class3_english_11_tenses" },
    { id: 12, title: "Sentence Structure", mechanic: "sentence", moduleId: "class3_english_12_sentence-structure" },
    { id: 13, title: "Reading Comprehension", mechanic: "comprehension", moduleId: "class3_english_13_comprehension" },
    { id: 14, title: "Creative Writing", mechanic: "creative", moduleId: "class3_english_14_creative-writing" },
    { id: 15, title: "Synonyms and Antonyms", mechanic: "syn-ant", moduleId: "class3_english_15_synonyms-antonyms" }
];

export function getClass3EnglishLevel(level) {
    return class3EnglishLevels.find(l => l.id === level) || class3EnglishLevels[0];
}

