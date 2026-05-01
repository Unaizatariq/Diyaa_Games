import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass2EnglishLevel } from "../data/levels.js";

const VOWELS = ["A", "E", "I", "O", "U"];

function shuffled(list) {
    const copy = [...list];
    Phaser.Utils.Array.Shuffle(copy);
    return copy;
}

export default class LevelScene extends CurriculumScene {
    constructor() {
        const levelMeta = getClass2EnglishLevel(window.DIYAA_GAME_CONFIG?.level || 1);
        super("LevelScene", levelMeta.moduleId);
        this.levelMeta = levelMeta;
        this.profile = { rounds: 8, delay: 520, hintAfterWrong: 2 };
        this.questions = [];
        this.questionIndex = 0;
        this.roundItems = [];
        this.locked = false;
        this.wrongStreak = 0;
    }

    preload() {
        loadUI(this, window.DIYAA_GAME_CONFIG?.level || 1);
    }

    create() {
        super.create();
        this.promptPanel = this.add.image(this.scale.width / 2, this.scale.height * 0.14, "panelBg")
            .setDisplaySize(Math.min(this.scale.width * 0.78, 950), 120);
        this.promptText = this.add.text(this.scale.width / 2, this.scale.height * 0.14, "", {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: `${Math.max(22, this.scale.width * 0.017)}px`,
            color: "#1f2937",
            align: "center",
            wordWrap: { width: Math.min(this.scale.width * 0.7, 880) }
        }).setOrigin(0.5);
        this.questions = this.buildQuestions();
        this.renderQuestion();
    }

    buildQuestions() {
        const byMechanic = {
            "alphabet-revision": () => Array.from({ length: 8 }, () => {
                const answer = String.fromCharCode(65 + Phaser.Math.Between(0, 25));
                const options = shuffled([answer, ...shuffled("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(ch => ch !== answer)).slice(0, 3)]);
                return { kind: "tap", prompt: `Tap letter: ${answer}`, answer, options, hint: `Find ${answer}` };
            }),
            "vowel-consonant": () => Array.from({ length: 8 }, () => {
                const letter = String.fromCharCode(65 + Phaser.Math.Between(0, 25));
                const answer = VOWELS.includes(letter) ? "Vowel" : "Consonant";
                return { kind: "tap", prompt: `Letter "${letter}" is a...`, answer, options: ["Vowel", "Consonant", "Word", "Sentence"], hint: `${letter} is a ${answer}.` };
            }),
            "nouns": () => this.makeWordClassQuestions("noun"),
            "pronouns": () => this.makePronounQuestions(),
            "verbs": () => this.makeWordClassQuestions("verb"),
            "adjectives": () => this.makeWordClassQuestions("adjective"),
            "prepositions": () => this.makePrepositionQuestions(),
            "articles": () => this.makeArticleQuestions(),
            "singular-plural": () => this.makePluralQuestions(),
            "opposites": () => this.makeOppositeQuestions(),
            "sentence-making": () => this.makeSequenceQuestions("sentence"),
            "reading-comprehension": () => this.makeComprehensionQuestions(),
            "picture-description": () => this.makeDescriptionQuestions(),
            "creative-writing": () => this.makeCreativeQuestions()
        };
        const make = byMechanic[this.levelMeta.mechanic] || (() => []);
        return make();
    }

    makeWordClassQuestions(type) {
        const pool = {
            noun: [["table", "Noun"], ["book", "Noun"], ["teacher", "Noun"], ["city", "Noun"], ["jump", "Verb"], ["blue", "Adjective"], ["run", "Verb"], ["happy", "Adjective"]],
            verb: [["run", "Verb"], ["sing", "Verb"], ["eat", "Verb"], ["read", "Verb"], ["apple", "Noun"], ["tall", "Adjective"], ["school", "Noun"], ["slow", "Adjective"]],
            adjective: [["big", "Adjective"], ["red", "Adjective"], ["happy", "Adjective"], ["cold", "Adjective"], ["write", "Verb"], ["dog", "Noun"], ["jump", "Verb"], ["book", "Noun"]]
        }[type];
        return pool.slice(0, 8).map(([word, answer]) => ({
            kind: "tap",
            prompt: `Word "${word}" is a...`,
            answer,
            options: ["Noun", "Verb", "Adjective", "Pronoun"],
            hint: `${word} is a ${answer}.`
        }));
    }

    makePronounQuestions() {
        const pool = [
            ["Ali is kind. ___ is kind.", "He"],
            ["Sara is reading. ___ is reading.", "She"],
            ["The boys are playing. ___ are playing.", "They"],
            ["I and Ahmad are friends. ___ are friends.", "We"],
            ["The cat is sleeping. ___ is sleeping.", "It"],
            ["Mina and Saba sing. ___ sing.", "They"],
            ["Teacher is here. ___ is here.", "She"],
            ["Father is cooking. ___ is cooking.", "He"]
        ];
        return pool.map(([prompt, answer]) => ({
            kind: "tap",
            prompt,
            answer,
            options: ["He", "She", "They", "We", "It"].slice(0, 4),
            hint: `Use "${answer}".`
        }));
    }

    makePrepositionQuestions() {
        const pool = [
            ["The ball is ___ the box.", "in"],
            ["The book is ___ the table.", "on"],
            ["The cat is ___ the chair.", "under"],
            ["The park is ___ the school.", "near"],
            ["The bird is ___ the tree.", "on"],
            ["The bag is ___ the bed.", "under"],
            ["Milk is ___ the glass.", "in"],
            ["My home is ___ the mosque.", "near"]
        ];
        return pool.map(([prompt, answer]) => ({
            kind: "tap",
            prompt,
            answer,
            options: ["in", "on", "under", "near"],
            hint: `Best fit is "${answer}".`
        }));
    }

    makeArticleQuestions() {
        const pool = [
            ["___ apple", "an"], ["___ cat", "a"], ["___ sun", "the"], ["___ umbrella", "an"],
            ["___ boy", "a"], ["___ moon", "the"], ["___ orange", "an"], ["___ teacher", "a"]
        ];
        return pool.map(([prompt, answer]) => ({
            kind: "tap",
            prompt: `Choose article: ${prompt}`,
            answer,
            options: ["a", "an", "the", "no article"],
            hint: `Correct article is "${answer}".`
        }));
    }

    makePluralQuestions() {
        const pool = [
            ["book", "books"], ["box", "boxes"], ["baby", "babies"], ["bus", "buses"],
            ["toy", "toys"], ["leaf", "leaves"], ["class", "classes"], ["city", "cities"]
        ];
        return pool.map(([single, plural]) => ({
            kind: "tap",
            prompt: `Plural of "${single}"`,
            answer: plural,
            options: shuffled([plural, `${single}s`, `${single}es`, single]),
            hint: `Plural is "${plural}".`
        }));
    }

    makeOppositeQuestions() {
        const pool = [["hot", "cold"], ["up", "down"], ["near", "far"], ["happy", "sad"], ["big", "small"], ["day", "night"], ["open", "close"], ["fast", "slow"]];
        return pool.map(([word, opposite]) => ({
            kind: "tap",
            prompt: `Opposite of "${word}"`,
            answer: opposite,
            options: shuffled([opposite, "green", "table", "book"]),
            hint: `Opposite is "${opposite}".`
        }));
    }

    makeSequenceQuestions() {
        const sequences = [
            ["The", "boy", "is", "running", "."],
            ["A", "cat", "is", "under", "the", "table", "."],
            ["I", "like", "my", "school", "."],
            ["We", "play", "in", "the", "park", "."],
            ["She", "reads", "a", "book", "."]
        ];
        return sequences.map(tokens => ({
            kind: "sequence",
            prompt: "Arrange words to make a sentence.",
            answer: tokens.join(" "),
            tokens: shuffled(tokens),
            hint: `Sentence starts with "${tokens[0]}".`
        }));
    }

    makeComprehensionQuestions() {
        const passage = "Ali has a red ball. He plays in the park every evening.";
        return [
            { q: `${passage}\nWho has a red ball?`, a: "Ali", options: ["Ali", "Sara", "Teacher", "Park"] },
            { q: `${passage}\nWhat color is the ball?`, a: "red", options: ["red", "blue", "green", "yellow"] },
            { q: `${passage}\nWhere does he play?`, a: "park", options: ["park", "school", "home", "market"] },
            { q: `${passage}\nWhen does he play?`, a: "evening", options: ["evening", "morning", "night", "noon"] },
            { q: `${passage}\nAli has a ___ ball.`, a: "red", options: ["red", "small", "new", "round"] }
        ].map(item => ({ kind: "tap", prompt: item.q, answer: item.a, options: item.options, hint: `Look at passage carefully.` }));
    }

    makeDescriptionQuestions() {
        const pool = [
            ["🧒⚽🌳", "The boy is playing with a ball in the park."],
            ["👧📘🏫", "The girl is reading a book in school."],
            ["🐱🪑", "The cat is under the chair."],
            ["👨‍👩‍👧🏠", "A family is standing near the house."],
            ["🌧️☂️", "It is raining and a child has an umbrella."]
        ];
        return pool.map(([emoji, sentence]) => ({
            kind: "tap",
            prompt: `Choose best picture description for: ${emoji}`,
            answer: sentence,
            options: shuffled([sentence, "They are sleeping in class.", "A bus is flying in sky.", "There is no one here."]),
            hint: `Focus on main action in picture.`
        }));
    }

    makeCreativeQuestions() {
        const starters = [
            "My best friend is",
            "I like to",
            "My school is",
            "In my free time",
            "A happy day is"
        ];
        return starters.map(start => ({
            kind: "tap",
            prompt: `Pick the best continuation:\n${start} ...`,
            answer: `${start} very helpful and kind.`,
            options: shuffled([
                `${start} very helpful and kind.`,
                `${start} because table runs quickly.`,
                `${start} and blue eats a pencil.`,
                `${start} when moon under school.`
            ]),
            hint: "Pick the sentence that is meaningful and correct."
        }));
    }

    clearRound() {
        this.roundItems.forEach(item => item.destroy());
        this.roundItems = [];
    }

    renderQuestion() {
        this.clearRound();
        this.locked = false;
        if (this.questionIndex >= this.questions.length) {
            this.showCompletion();
            return;
        }
        const q = this.questions[this.questionIndex];
        this.currentQuestion = q;
        this.promptText.setText(q.prompt);
        this.updateRoundProgress(this.questionIndex + 1, this.questions.length);
        if (q.kind === "sequence") this.renderSequence(q);
        else this.renderTap(q);
    }

    renderTap(question) {
        const y = this.scale.height * 0.6;
        const spacing = Math.min(220, this.scale.width * 0.22);
        const startX = this.scale.width / 2 - spacing * 1.5;
        question.options.forEach((option, i) => {
            const x = startX + i * spacing;
            const card = this.add.image(x, y, "optionCard").setDisplaySize(185, 165).setInteractive({ useHandCursor: true });
            const txt = this.add.text(x, y, option, {
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "24px",
                color: "#111827",
                align: "center",
                wordWrap: { width: 160 }
            }).setOrigin(0.5);
            card.on("pointerdown", () => {
                this.sounds.playTap();
                this.resolveAnswer(option === question.answer);
            });
            this.roundItems.push(card, txt);
        });
    }

    renderSequence(question) {
        const dropY = this.scale.height * 0.46;
        const drop = this.add.rectangle(this.scale.width / 2, dropY, Math.min(this.scale.width * 0.84, 1000), 100, 0x1d3557, 0.84).setStrokeStyle(3, 0xa8dadc);
        this.roundItems.push(drop);
        const placed = [];
        const slots = question.tokens.length;
        const startX = this.scale.width / 2 - ((slots - 1) * 112) / 2;
        const y = this.scale.height * 0.78;

        question.tokens.forEach((token, idx) => {
            const x = startX + idx * 112;
            const chip = this.add.rectangle(x, y, 108, 64, 0xf4a261, 0.95)
                .setStrokeStyle(2, 0x0b132b)
                .setInteractive({ useHandCursor: true, draggable: true });
            const label = this.add.text(x, y, token, {
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "20px",
                color: "#0b132b"
            }).setOrigin(0.5);
            chip.token = token;
            this.input.setDraggable(chip);
            chip.on("drag", (p, dx, dy) => { chip.x = dx; chip.y = dy; label.x = dx; label.y = dy; });
            chip.on("dragend", () => {
                this.sounds.playTap();
                const inside = Phaser.Geom.Rectangle.Contains(drop.getBounds(), chip.x, chip.y);
                if (!inside || placed.includes(chip)) {
                    this.tweens.add({ targets: [chip, label], x, y, duration: 170 });
                    return;
                }
                placed.push(chip);
                const px = this.scale.width / 2 - ((slots - 1) * 112) / 2 + (placed.length - 1) * 112;
                chip.x = px; chip.y = dropY; label.x = px; label.y = dropY;
                if (placed.length === slots) {
                    const sentence = placed.map(item => item.token).join(" ");
                    this.resolveAnswer(sentence === question.answer);
                }
            });
            this.roundItems.push(chip, label);
        });
    }

    resolveAnswer(correct) {
        if (this.locked) return;
        this.locked = true;
        if (correct) {
            this.wrongStreak = 0;
            this.onCorrectAnswer();
            this.showFloatingFeedback("+10", true);
            this.questionIndex += 1;
            this.time.delayedCall(this.profile.delay, () => this.renderQuestion());
            return;
        }
        this.wrongStreak += 1;
        this.onWrongAnswer();
        this.showFloatingFeedback("Try again", false);
        if (this.wrongStreak >= this.profile.hintAfterWrong) {
            this.showHint(this.currentQuestion?.hint || "Read carefully and retry.");
            this.wrongStreak = 0;
        }
        this.time.delayedCall(this.profile.delay, () => { this.locked = false; });
    }

    showCompletion() {
        const result = this.completeModule();
        this.notifyLevelCompleted({ score: this.session.score, stars: result.stars, status: "completed" });
        this.clearRound();
        this.promptText.setText(`${this.levelMeta.title} Completed!`);
        const panel = this.add.image(this.scale.width / 2, this.scale.height * 0.58, "panelBg")
            .setDisplaySize(Math.min(this.scale.width * 0.66, 620), 320);
        const score = this.add.text(this.scale.width / 2, this.scale.height * 0.54, `Score: ${this.session.score}`, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "38px",
            color: "#1f2937",
            fontStyle: "bold"
        }).setOrigin(0.5);
        const stars = this.add.text(this.scale.width / 2, this.scale.height * 0.64, `Stars: ${result.stars}/3`, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "30px",
            color: "#1f2937"
        }).setOrigin(0.5);
        this.roundItems.push(panel, score, stars);
    }
}

