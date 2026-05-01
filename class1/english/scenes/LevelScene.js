import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass1EnglishLevel } from "../data/levels.js";

function shuffle(list) {
    const clone = [...list];
    Phaser.Utils.Array.Shuffle(clone);
    return clone;
}

export default class LevelScene extends CurriculumScene {
    constructor() {
        const level = getClass1EnglishLevel(window.DIYAA_GAME_CONFIG?.level || 1);
        super("LevelScene", level.moduleId);
        this.levelMeta = level;
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
        this.createHeader();
        this.questions = this.buildQuestions();
        this.renderQuestion();
    }

    createHeader() {
        this.promptPanel = this.add.image(this.scale.width / 2, this.scale.height * 0.14, "panelBg")
            .setDisplaySize(Math.min(this.scale.width * 0.76, 920), 120);
        this.promptText = this.add.text(this.scale.width / 2, this.scale.height * 0.14, "", {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: `${Math.max(22, this.scale.width * 0.017)}px`,
            color: "#1f2937",
            wordWrap: { width: Math.min(this.scale.width * 0.68, 840) },
            align: "center"
        }).setOrigin(0.5);
    }

    get rounds() {
        return this.profile.rounds;
    }

    buildQuestions() {
        switch (this.levelMeta.mechanic) {
            case "verb-form":
                return this.buildVerbQuestions();
            case "pronoun-replace":
                return this.buildPronounQuestions();
            case "adjective-pick":
                return this.buildAdjectiveQuestions();
            case "opposites-match":
                return this.buildOppositeQuestions();
            case "request-command":
                return this.buildRequestCommandQuestions();
            case "there-their":
                return this.buildThereTheirQuestions();
            case "time-sentence":
                return this.buildTimeQuestions();
            case "plural-forms":
                return this.buildPluralQuestions();
            case "punctuation-fix":
                return this.buildPunctuationQuestions();
            case "composition-builder":
                return this.buildCompositionQuestions();
            default:
                return [];
        }
    }

    buildVerbQuestions() {
        const pool = [
            ["I ___ to school.", "go", ["go", "goes", "gone", "going"]],
            ["She ___ milk.", "drinks", ["drink", "drinks", "drank", "drinking"]],
            ["They ___ football.", "play", ["play", "plays", "played", "playing"]],
            ["He ___ fast.", "runs", ["run", "runs", "ran", "running"]],
            ["We ___ books.", "read", ["read", "reads", "reading", "reader"]],
            ["It ___ loudly.", "barks", ["bark", "barks", "barked", "barking"]],
            ["Birds ___.", "fly", ["fly", "flies", "flying", "flown"]],
            ["Ali ___ his bag.", "carries", ["carry", "carries", "carried", "carrying"]]
        ];
        return pool.slice(0, this.rounds).map(([prompt, answer, options]) => ({ kind: "tap", prompt, answer, options, hint: `Use "${answer}" here.` }));
    }

    buildPronounQuestions() {
        const pool = [
            ["Sara is kind. ___ is kind.", "She", ["She", "He", "They", "It"]],
            ["Ali is my friend. ___ is smart.", "He", ["She", "He", "We", "It"]],
            ["The cat is sleeping. ___ is tired.", "It", ["He", "She", "It", "They"]],
            ["Ahmed and Bilal play. ___ are happy.", "They", ["He", "They", "It", "She"]],
            ["Mina and I read. ___ are reading.", "We", ["They", "We", "He", "It"]],
            ["Teacher speaks. ___ is strict.", "She", ["She", "They", "We", "It"]],
            ["Father cooks. ___ makes food.", "He", ["He", "She", "It", "They"]],
            ["Birds sing. ___ are loud.", "They", ["We", "They", "It", "He"]]
        ];
        return pool.slice(0, this.rounds).map(([prompt, answer, options]) => ({ kind: "tap", prompt, answer, options, hint: `Pick "${answer}".` }));
    }

    buildAdjectiveQuestions() {
        const pool = [
            ["The elephant is ___", "big", ["big", "run", "quickly", "jump"]],
            ["The feather is ___", "light", ["light", "read", "swim", "talk"]],
            ["The lemon is ___", "sour", ["sour", "fast", "chair", "eat"]],
            ["The ice is ___", "cold", ["cold", "sing", "tree", "draw"]],
            ["The road is ___", "long", ["long", "write", "cook", "play"]],
            ["The rabbit is ___", "small", ["small", "jumped", "table", "run"]],
            ["The soup is ___", "hot", ["hot", "dance", "pen", "read"]],
            ["The pillow is ___", "soft", ["soft", "walk", "book", "eat"]]
        ];
        return pool.slice(0, this.rounds).map(([prompt, answer, options]) => ({ kind: "tap", prompt, answer, options, hint: `Describing word is "${answer}".` }));
    }

    buildOppositeQuestions() {
        const pool = [
            ["hot", "cold"], ["up", "down"], ["big", "small"], ["day", "night"],
            ["open", "close"], ["happy", "sad"], ["fast", "slow"], ["in", "out"]
        ];
        return pool.slice(0, this.rounds).map(([word, opposite]) => {
            const options = shuffle([opposite, "tall", "green", "chair"]);
            return {
                kind: "tap",
                prompt: `Choose opposite of "${word}"`,
                answer: opposite,
                options,
                hint: `Opposite is "${opposite}".`
            };
        });
    }

    buildRequestCommandQuestions() {
        const pool = [
            ["Please pass me the book.", "Request"],
            ["Stand up now.", "Command"],
            ["Could you help me?", "Request"],
            ["Finish your homework.", "Command"],
            ["Please open the door.", "Request"],
            ["Sit quietly.", "Command"],
            ["May I borrow your pencil?", "Request"],
            ["Line up in a row.", "Command"]
        ];
        return pool.slice(0, this.rounds).map(([prompt, answer]) => ({
            kind: "tap",
            prompt: `Is this a Request or Command?\\n${prompt}`,
            answer,
            options: ["Request", "Command", "Question", "Story"],
            hint: `This one is "${answer}".`
        }));
    }

    buildThereTheirQuestions() {
        const pool = [
            ["___ are five apples.", "There"],
            ["This is ___ classroom.", "their"],
            ["___ is a kite in the sky.", "There"],
            ["The boys lost ___ ball.", "their"],
            ["___ is a cat under the table.", "There"],
            ["Girls brought ___ bags.", "their"],
            ["___ is my pencil.", "There"],
            ["Children cleaned ___ room.", "their"]
        ];
        return pool.slice(0, this.rounds).map(([sentence, answer]) => ({
            kind: "tap",
            prompt: sentence,
            answer,
            options: ["There", "their", "They", "Them"],
            hint: `"${answer}" fits this sentence.`
        }));
    }

    buildTimeQuestions() {
        const pool = [
            ["School starts in the ___", "morning"],
            ["We sleep at ___", "night"],
            ["Lunch is in the ___", "afternoon"],
            ["The sun rises in the ___", "morning"],
            ["Stars shine at ___", "night"],
            ["Tea time is in the ___", "evening"],
            ["Birds return in the ___", "evening"],
            ["Breakfast is in the ___", "morning"]
        ];
        return pool.slice(0, this.rounds).map(([prompt, answer]) => ({
            kind: "tap",
            prompt,
            answer,
            options: ["morning", "afternoon", "evening", "night"],
            hint: `Best fit is "${answer}".`
        }));
    }

    buildPluralQuestions() {
        const pool = [
            ["child", "children"], ["man", "men"], ["woman", "women"], ["tooth", "teeth"],
            ["foot", "feet"], ["mouse", "mice"], ["goose", "geese"], ["person", "people"]
        ];
        return pool.slice(0, this.rounds).map(([single, plural]) => ({
            kind: "tap",
            prompt: `Choose plural of "${single}"`,
            answer: plural,
            options: shuffle([plural, `${single}s`, `${single}es`, single]),
            hint: `Irregular plural is "${plural}".`
        }));
    }

    buildPunctuationQuestions() {
        const pool = [
            ["what is your name", "What is your name?"],
            ["ali likes apples", "Ali likes apples."],
            ["wow that is big", "Wow! That is big."],
            ["please open the door", "Please open the door."],
            ["where are you going", "Where are you going?"],
            ["we are friends", "We are friends."],
            ["hurray we won", "Hurray! We won."],
            ["this is my bag", "This is my bag."]
        ];
        return pool.slice(0, this.rounds).map(([raw, fixed]) => ({
            kind: "tap",
            prompt: `Pick correct punctuation:\\n${raw}`,
            answer: fixed,
            options: shuffle([
                fixed,
                raw,
                `${raw}!`,
                `${raw}?`
            ]),
            hint: `Correct form: ${fixed}`
        }));
    }

    buildCompositionQuestions() {
        const compositions = [
            { tokens: ["The", "boy", "is", "flying", "a", "kite", "."], hint: "Start with The" },
            { tokens: ["A", "girl", "is", "watering", "plants", "."], hint: "Place girl after A" },
            { tokens: ["Children", "are", "playing", "in", "the", "park", "."], hint: "Verb after are" },
            { tokens: ["The", "cat", "is", "sleeping", "on", "a", "mat", "."], hint: "Use is before sleeping" },
            { tokens: ["Two", "birds", "are", "sitting", "on", "a", "tree", "."], hint: "Two starts sentence" }
        ];
        return compositions.map(item => ({
            kind: "compose",
            prompt: "Arrange words to make a sentence.",
            answer: item.tokens.join(" "),
            options: shuffle(item.tokens),
            hint: item.hint
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

        const question = this.questions[this.questionIndex];
        this.currentQuestion = question;
        this.promptText.setText(question.prompt);
        this.updateRoundProgress(this.questionIndex + 1, this.questions.length);

        if (question.kind === "compose") this.renderCompose(question);
        else this.renderTap(question);
    }

    renderTap(question) {
        const y = this.scale.height * 0.58;
        const spacing = Math.min(220, this.scale.width * 0.22);
        const startX = this.scale.width / 2 - spacing * 1.5;

        question.options.forEach((option, index) => {
            const x = startX + spacing * index;
            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(180, 160)
                .setInteractive({ useHandCursor: true });
            const label = this.add.text(x, y, option, {
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "28px",
                color: "#111827",
                align: "center",
                wordWrap: { width: 150 }
            }).setOrigin(0.5);

            card.on("pointerdown", () => {
                this.sounds.playTap();
                this.resolveAnswer(option === question.answer);
            });
            this.roundItems.push(card, label);
        });
    }

    renderCompose(question) {
        const dropY = this.scale.height * 0.46;
        const drop = this.add.rectangle(this.scale.width / 2, dropY, Math.min(this.scale.width * 0.82, 980), 100, 0x1d3557, 0.82)
            .setStrokeStyle(3, 0xa8dadc);
        this.roundItems.push(drop);

        const placed = [];
        const target = question.answer;

        const slots = question.options.length;
        const startX = this.scale.width / 2 - ((slots - 1) * 105) / 2;
        const wordY = this.scale.height * 0.78;

        question.options.forEach((word, idx) => {
            const x = startX + idx * 105;
            const token = this.add.rectangle(x, wordY, 100, 60, 0xf4a261, 0.95)
                .setStrokeStyle(2, 0x0b132b)
                .setInteractive({ useHandCursor: true, draggable: true });
            const text = this.add.text(x, wordY, word, {
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "20px",
                color: "#0b132b"
            }).setOrigin(0.5);

            this.input.setDraggable(token);
            token.word = word;
            token.on("drag", (pointer, dragX, dragY) => {
                token.x = dragX;
                token.y = dragY;
                text.x = dragX;
                text.y = dragY;
            });
            token.on("dragend", () => {
                this.sounds.playTap();
                const isOnDrop = Phaser.Geom.Rectangle.Contains(drop.getBounds(), token.x, token.y);
                if (!isOnDrop || placed.includes(token)) {
                    this.tweens.add({ targets: [token, text], x, y: wordY, duration: 160 });
                    return;
                }
                placed.push(token);
                const placeX = this.scale.width / 2 - ((slots - 1) * 105) / 2 + (placed.length - 1) * 105;
                token.x = placeX;
                token.y = dropY;
                text.x = placeX;
                text.y = dropY;

                if (placed.length === slots) {
                    const sentence = placed.map(item => item.word).join(" ");
                    this.resolveAnswer(sentence === target);
                }
            });
            this.roundItems.push(token, text);
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
            this.showHint(this.currentQuestion?.hint || "Look carefully and try again.");
            this.wrongStreak = 0;
        }
        this.time.delayedCall(this.profile.delay, () => {
            this.locked = false;
        });
    }

    showCompletion() {
        const result = this.completeModule();
        this.notifyLevelCompleted({
            score: this.session.score,
            stars: result.stars,
            status: "completed"
        });

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
