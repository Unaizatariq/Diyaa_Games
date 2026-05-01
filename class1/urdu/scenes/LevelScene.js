import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass1UrduLevel } from "../data/levels.js";

const LETTERS = ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ر", "ز", "س", "ش"];
const DOT_COUNT = {
    "ا": 0, "ح": 0, "د": 0, "ر": 0, "س": 0,
    "ب": 1, "ج": 1, "خ": 1, "ز": 1,
    "ت": 2,
    "پ": 3, "ٹ": 3, "ث": 3, "چ": 3, "ش": 3, "ڈ": 3
};

function shuffle(list) {
    const clone = [...list];
    Phaser.Utils.Array.Shuffle(clone);
    return clone;
}

export default class LevelScene extends CurriculumScene {
    constructor() {
        const level = getClass1UrduLevel(window.DIYAA_GAME_CONFIG?.level || 1);
        super("LevelScene", level.moduleId);
        this.levelMeta = level;
        this.profile = { rounds: 8, delay: 560, hintAfterWrong: 2 };
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
            fontFamily: "Noto Nastaliq Urdu, Arial",
            fontSize: `${Math.max(26, this.scale.width * 0.02)}px`,
            color: "#1f2937",
            wordWrap: { width: Math.min(this.scale.width * 0.68, 840) },
            align: "center"
        }).setOrigin(0.5);
    }

    buildQuestions() {
        switch (this.levelMeta.mechanic) {
            case "tap-letter":
                return this.buildTapLetterQuestions();
            case "dot-count":
                return this.buildDotQuestions();
            case "similar-letters":
                return this.buildSimilarQuestions();
            case "odd-shape":
                return this.buildOddShapeQuestions();
            case "word-build":
                return this.buildWordQuestions();
            case "letter-sequence":
                return this.buildSequenceQuestions();
            case "before-after":
                return this.buildBeforeAfterQuestions();
            case "letter-match":
                return this.buildLetterMatchQuestions();
            case "sentence-build":
                return this.buildSentenceQuestions();
            case "picture-word":
                return this.buildPictureWordQuestions();
            case "memory-match":
                return [{ kind: "memory", prompt: "ایک جیسے حروف کے جوڑے بنائیں", hint: "آخری کھلا کارڈ یاد رکھیں" }];
            case "fill-blanks":
                return this.buildFillBlankQuestions();
            default:
                return [];
        }
    }

    buildTapLetterQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const answer = Phaser.Utils.Array.GetRandom(LETTERS);
            const options = shuffle([answer, ...shuffle(LETTERS.filter(item => item !== answer)).slice(0, 3)]);
            return { kind: "tap", prompt: `درست حرف منتخب کریں: ${answer}`, answer, options, hint: `جو حرف دکھا ہے وہ "${answer}" ہے` };
        });
    }

    buildDotQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const answer = Phaser.Utils.Array.GetRandom(Object.keys(DOT_COUNT));
            const dots = DOT_COUNT[answer];
            const options = shuffle([answer, ...shuffle(Object.keys(DOT_COUNT).filter(item => item !== answer)).slice(0, 3)]);
            return { kind: "tap", prompt: `${dots} نقطے والا حرف منتخب کریں`, answer, options, hint: `صحیح جواب "${answer}" ہے` };
        });
    }

    buildSimilarQuestions() {
        const pool = [
            ["ب", "پ"], ["ت", "ٹ"], ["س", "ش"], ["ح", "خ"],
            ["د", "ڈ"], ["ج", "چ"], ["ر", "ز"], ["ت", "ث"]
        ];
        return pool.map(([base, pair]) => ({
            kind: "tap",
            prompt: `"${base}" سے ملتا جلتا حرف کون سا ہے؟`,
            answer: pair,
            options: shuffle([pair, ...shuffle(LETTERS.filter(item => item !== pair)).slice(0, 3)]),
            hint: `قریب شکل والا حرف "${pair}" ہے`
        }));
    }

    buildOddShapeQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const odd = Phaser.Utils.Array.GetRandom(["@", "%", "#", "&"]);
            const options = shuffle([odd, ...shuffle(LETTERS).slice(0, 3)]);
            return { kind: "tap", prompt: "غیر حرف شکل منتخب کریں", answer: odd, options, hint: "حرف نہیں بلکہ نشان ڈھونڈیں" };
        });
    }

    buildWordQuestions() {
        const pool = [
            { word: "انار", first: "ا" },
            { word: "بکری", first: "ب" },
            { word: "پتنگ", first: "پ" },
            { word: "تتلی", first: "ت" },
            { word: "جہاز", first: "ج" },
            { word: "چابی", first: "چ" },
            { word: "خرگوش", first: "خ" },
            { word: "سیب", first: "س" }
        ];
        return pool.map(item => ({
            kind: "tap",
            prompt: `"${item.word}" کا پہلا حرف منتخب کریں`,
            answer: item.first,
            options: shuffle([item.first, ...shuffle(LETTERS.filter(letter => letter !== item.first)).slice(0, 3)]),
            hint: `اس لفظ کا آغاز "${item.first}" سے ہوتا ہے`
        }));
    }

    buildSequenceQuestions() {
        return Array.from({ length: this.profile.rounds }, (_, index) => {
            const chain = LETTERS.slice(index, index + 3);
            return {
                kind: "sequence",
                prompt: "حروف کو درست ترتیب میں لگائیں",
                answer: chain.join(" "),
                tokens: shuffle(chain),
                hint: chain.join(" → ")
            };
        });
    }

    buildBeforeAfterQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const i = Phaser.Math.Between(1, LETTERS.length - 2);
            const center = LETTERS[i];
            const answer = LETTERS[i + 1];
            const options = shuffle([answer, LETTERS[i - 1], LETTERS[i], LETTERS[i + 2] || LETTERS[0]]);
            return { kind: "tap", prompt: `"${center}" کے بعد آنے والا حرف کون سا ہے؟`, answer, options, hint: `جو حرف "${center}" کے فوراً بعد آئے` };
        });
    }

    buildLetterMatchQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const answer = Phaser.Utils.Array.GetRandom(LETTERS);
            const options = shuffle([answer, ...shuffle(LETTERS.filter(item => item !== answer)).slice(0, 3)]);
            return { kind: "tap", prompt: `"${answer}" کو اسی حرف سے ملائیں`, answer, options, hint: "بالکل وہی حرف منتخب کریں" };
        });
    }

    buildSentenceQuestions() {
        const pool = [
            ["یہ", "میرا", "گھر", "ہے", "۔"],
            ["علی", "اسکول", "جاتا", "ہے", "۔"],
            ["میں", "کتاب", "پڑھتا", "ہوں", "۔"],
            ["بچی", "پانی", "پیتی", "ہے", "۔"],
            ["ہم", "پارک", "میں", "کھیلتے", "ہیں", "۔"]
        ];
        return pool.map(tokens => ({
            kind: "sequence",
            prompt: "سادہ جملہ بنائیں",
            answer: tokens.join(" "),
            tokens: shuffle(tokens),
            hint: `جملہ "${tokens[0]}" سے شروع ہوتا ہے`
        }));
    }

    buildPictureWordQuestions() {
        const pool = [
            ["🍎", "سیب"], ["🐟", "مچھلی"], ["🐱", "بلی"], ["🚗", "گاڑی"],
            ["🌙", "چاند"], ["🌳", "درخت"], ["🏠", "گھر"], ["📘", "کتاب"]
        ];
        return pool.map(([emoji, word]) => ({
            kind: "tap",
            prompt: `${emoji} کے لیے درست لفظ منتخب کریں`,
            answer: word,
            options: shuffle([word, ...shuffle(["سیب", "مچھلی", "بلی", "گاڑی", "چاند", "درخت", "گھر", "کتاب"].filter(item => item !== word)).slice(0, 3)]),
            hint: `صحیح لفظ "${word}" ہے`
        }));
    }

    buildFillBlankQuestions() {
        const pool = [
            ["_ نار", "ا"], ["ب _ ری", "ک"], ["پ _ نگ", "ت"], ["گ _ ڑی", "ا"],
            ["ک _ اب", "ت"], ["م _ لی", "چ"], ["د _ خت", "ر"], ["چ _ ند", "ا"]
        ];
        return pool.map(([prompt, answer]) => ({
            kind: "tap",
            prompt: `خالی جگہ پُر کریں: ${prompt}`,
            answer,
            options: shuffle([answer, ...shuffle(LETTERS.filter(item => item !== answer)).slice(0, 3)]),
            hint: `درست حرف "${answer}" ہے`
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

        if (q.kind === "memory") this.renderMemoryBoard();
        else if (q.kind === "sequence") this.renderSequence(q);
        else this.renderTap(q);
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
            const label = this.add.text(x, y, String(option), {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "44px",
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

    renderSequence(question) {
        const dropY = this.scale.height * 0.44;
        const drop = this.add.rectangle(this.scale.width / 2, dropY, Math.min(this.scale.width * 0.82, 980), 100, 0x1d3557, 0.82)
            .setStrokeStyle(3, 0xa8dadc);
        this.roundItems.push(drop);

        const placed = [];
        const slots = question.tokens.length;
        const tokenStartX = this.scale.width / 2 - ((slots - 1) * 120) / 2;
        const tokenY = this.scale.height * 0.76;

        question.tokens.forEach((word, idx) => {
            const x = tokenStartX + idx * 120;
            const chip = this.add.rectangle(x, tokenY, 108, 64, 0xf4a261, 0.95)
                .setStrokeStyle(2, 0x0b132b)
                .setInteractive({ useHandCursor: true, draggable: true });
            const label = this.add.text(x, tokenY, word, {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "40px",
                color: "#0b132b"
            }).setOrigin(0.5);
            chip.token = word;

            this.input.setDraggable(chip);
            chip.on("drag", (pointer, dragX, dragY) => {
                chip.x = dragX; chip.y = dragY;
                label.x = dragX; label.y = dragY;
            });
            chip.on("dragend", () => {
                this.sounds.playTap();
                const inside = Phaser.Geom.Rectangle.Contains(drop.getBounds(), chip.x, chip.y);
                if (!inside || placed.includes(chip)) {
                    this.tweens.add({ targets: [chip, label], x, y: tokenY, duration: 180 });
                    return;
                }

                placed.push(chip);
                const placeX = this.scale.width / 2 - ((slots - 1) * 120) / 2 + (placed.length - 1) * 120;
                chip.x = placeX; chip.y = dropY;
                label.x = placeX; label.y = dropY;

                if (placed.length === slots) {
                    const sentence = placed.map(item => item.token).join(" ");
                    this.resolveAnswer(sentence === question.answer);
                }
            });
            this.roundItems.push(chip, label);
        });
    }

    renderMemoryBoard() {
        const base = ["ا", "ب", "پ", "ت"];
        const cards = shuffle([...base, ...base]);
        const opened = [];
        let matched = 0;

        cards.forEach((letter, idx) => {
            const col = idx % 4;
            const row = Math.floor(idx / 4);
            const x = this.scale.width * 0.32 + col * 160;
            const y = this.scale.height * 0.42 + row * 170;

            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(130, 130)
                .setInteractive({ useHandCursor: true });
            const text = this.add.text(x, y, letter, {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "58px",
                color: "#111827"
            }).setOrigin(0.5).setVisible(false);

            const state = { letter, card, text, flipped: false, matched: false };
            card.on("pointerdown", () => {
                this.sounds.playTap();
                if (this.locked || state.flipped || state.matched) return;
                state.flipped = true;
                text.setVisible(true);
                opened.push(state);

                if (opened.length === 2) {
                    this.locked = true;
                    const [a, b] = opened;
                    this.time.delayedCall(360, () => {
                        if (a.letter === b.letter) {
                            a.matched = true;
                            b.matched = true;
                            matched += 1;
                            this.onCorrectAnswer();
                            this.showFloatingFeedback("+10", true);
                            if (matched === base.length) {
                                this.questionIndex += 1;
                                this.time.delayedCall(this.profile.delay, () => this.renderQuestion());
                            }
                        } else {
                            a.flipped = false;
                            b.flipped = false;
                            a.text.setVisible(false);
                            b.text.setVisible(false);
                            this.onWrongAnswer();
                            this.showFloatingFeedback("دوبارہ", false);
                        }
                        opened.length = 0;
                        this.locked = false;
                    });
                }
            });
            this.roundItems.push(card, text);
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
        this.showFloatingFeedback("دوبارہ کوشش کریں", false);
        if (this.wrongStreak >= this.profile.hintAfterWrong) {
            this.showHint(this.currentQuestion?.hint || "اشارہ دیکھیں اور دوبارہ کریں");
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
        this.promptText.setText(`${this.levelMeta.title} مکمل`);
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

