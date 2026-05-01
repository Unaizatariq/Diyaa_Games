export const class4EnglishLevels = [
    { id: 1, title: "Nouns", mechanic: "nouns", moduleId: "class4_english_01_nouns" },
    { id: 2, title: "Pronouns", mechanic: "pronouns", moduleId: "class4_english_02_pronouns" },
    { id: 3, title: "Verbs", mechanic: "verbs", moduleId: "class4_english_03_verbs" },
    { id: 4, title: "Adjectives", mechanic: "adjectives", moduleId: "class4_english_04_adjectives" },
    { id: 5, title: "Adverbs", mechanic: "adverbs", moduleId: "class4_english_05_adverbs" },
    { id: 6, title: "Prepositions", mechanic: "prepositions", moduleId: "class4_english_06_prepositions" },
    { id: 7, title: "Conjunctions", mechanic: "conjunctions", moduleId: "class4_english_07_conjunctions" },
    { id: 8, title: "Articles", mechanic: "articles", moduleId: "class4_english_08_articles" },
    { id: 9, title: "Tenses", mechanic: "tenses", moduleId: "class4_english_09_tenses" },
    { id: 10, title: "Subject and Predicate", mechanic: "subject-predicate", moduleId: "class4_english_10_subject-predicate" },
    { id: 11, title: "Sentence Structure", mechanic: "sentence", moduleId: "class4_english_11_sentence-structure" },
    { id: 12, title: "Synonyms and Antonyms", mechanic: "syn-ant", moduleId: "class4_english_12_syn-ant" },
    { id: 13, title: "Reading Comprehension", mechanic: "comprehension", moduleId: "class4_english_13_comprehension" },
    { id: 14, title: "Paragraph Writing", mechanic: "paragraph", moduleId: "class4_english_14_paragraph" },
    { id: 15, title: "Story Writing", mechanic: "story", moduleId: "class4_english_15_story" }
];

export function getClass4EnglishLevel(level) {
    return class4EnglishLevels.find(l => l.id === level) || class4EnglishLevels[0];
}

