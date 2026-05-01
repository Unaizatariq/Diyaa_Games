import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass2UrduLevel } from "../data/levels.js";

const LETTERS = ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ر", "ز", "س", "ش"];
const DOTS = {
    "ا": 0, "ح": 0, "د": 0, "ر": 0, "س": 0,
    "ب": 1, "ج": 1, "خ": 1, "ز": 1,
    "ت": 2,
    "پ": 3, "ٹ": 3, "ث": 3, "چ": 3, "ش": 3, "ڈ": 3
};

function shuffle(list) {
    const copy = [...list];
    Phaser.Utils.Array.Shuffle(copy);
    return copy;
}

export default class LevelScene extends CurriculumScene {
    constructor() {
        const levelMeta = getClass2UrduLevel(window.DIYAA_GAME_CONFIG?.level || 1);
        super("LevelScene", levelMeta.moduleId);
        this.levelMeta = levelMeta;
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
        this.promptPanel = this.add.image(this.scale.width / 2, this.scale.height * 0.14, "panelBg")
            .setDisplaySize(Math.min(this.scale.width * 0.78, 950), 120);
        this.promptText = this.add.text(this.scale.width / 2, this.scale.height * 0.14, "", {
            fontFamily: "Noto Nastaliq Urdu, Arial",
            fontSize: `${Math.max(26, this.scale.width * 0.02)}px`,
            color: "#1f2937",
            align: "center",
            wordWrap: { width: Math.min(this.scale.width * 0.7, 880) }
        }).setOrigin(0.5);
        this.questions = this.buildQuestions();
        this.renderQuestion();
    }

    buildQuestions() {
        const makers = {
            "huroof-revision": () => Array.from({ length: 8 }, () => {
                const answer = Phaser.Utils.Array.GetRandom(LETTERS);
                return { kind: "tap", prompt: `درست حرف منتخب کریں: ${answer}`, answer, options: shuffle([answer, ...shuffle(LETTERS.filter(ch => ch !== answer)).slice(0, 3)]), hint: answer };
            }),
            "dots": () => Array.from({ length: 8 }, () => {
                const answer = Phaser.Utils.Array.GetRandom(Object.keys(DOTS));
                const d = DOTS[answer];
                return { kind: "tap", prompt: `${d} نقطے والا حرف منتخب کریں`, answer, options: shuffle([answer, ...shuffle(Object.keys(DOTS).filter(ch => ch !== answer)).slice(0, 3)]), hint: `جواب ${answer}` };
            }),
            "odd-shape": () => Array.from({ length: 8 }, () => {
                const answer = Phaser.Utils.Array.GetRandom(["@", "#", "%", "&"]);
                return { kind: "tap", prompt: "غیر حرف شکل منتخب کریں", answer, options: shuffle([answer, ...shuffle(LETTERS).slice(0, 3)]), hint: "حرف نہیں، نشان منتخب کریں" };
            }),
            "similar-letters": () => {
                const pairs = [["ب", "پ"], ["ت", "ٹ"], ["س", "ش"], ["ج", "چ"], ["ح", "خ"], ["د", "ڈ"], ["ر", "ز"], ["ت", "ث"]];
                return pairs.map(([a, answer]) => ({ kind: "tap", prompt: `"${a}" سے ملتا جلتا حرف`, answer, options: shuffle([answer, ...shuffle(LETTERS.filter(ch => ch !== answer)).slice(0, 3)]), hint: answer }));
            },
            "words": () => {
                const items = [["انار", "ا"], ["بکری", "ب"], ["تتلی", "ت"], ["چاند", "چ"], ["خرگوش", "خ"], ["درخت", "د"], ["سیب", "س"], ["زمین", "ز"]];
                return items.map(([word, answer]) => ({ kind: "tap", prompt: `"${word}" کا پہلا حرف`, answer, options: shuffle([answer, ...shuffle(LETTERS.filter(ch => ch !== answer)).slice(0, 3)]), hint: answer }));
            },
            "sequence": () => Array.from({ length: 8 }, (_, i) => {
                const tokens = LETTERS.slice(i, i + 3);
                return { kind: "sequence", prompt: "حروف کی ترتیب بنائیں", answer: tokens.join(" "), tokens: shuffle(tokens), hint: tokens.join(" → ") };
            }),
            "matching-letters": () => Array.from({ length: 8 }, () => {
                const answer = Phaser.Utils.Array.GetRandom(LETTERS);
                return { kind: "tap", prompt: `"${answer}" کو اسی حرف سے ملائیں`, answer, options: shuffle([answer, ...shuffle(LETTERS.filter(ch => ch !== answer)).slice(0, 3)]), hint: answer };
            }),
            "simple-sentences": () => this.makeSentenceSequences([
                ["یہ", "میرا", "گھر", "ہے", "۔"],
                ["میں", "اسکول", "جاتا", "ہوں", "۔"],
                ["وہ", "کتاب", "پڑھتی", "ہے", "۔"],
                ["ہم", "پارک", "میں", "کھیلتے", "ہیں", "۔"]
            ]),
            "complete-sentences": () => this.makeCompleteSentenceQuestions(),
            "opposites": () => {
                const pairs = [["اونچا", "نیچا"], ["گرم", "ٹھنڈا"], ["خوش", "اداس"], ["بڑا", "چھوٹا"], ["دن", "رات"], ["آگے", "پیچھے"], ["کالا", "سفید"], ["تیز", "آہستہ"]];
                return pairs.map(([word, answer]) => ({ kind: "tap", prompt: `"${word}" کا متضاد لفظ`, answer, options: shuffle([answer, "کتاب", "درخت", "دوست"]), hint: answer }));
            },
            "picture-words": () => {
                const pics = [["🍎", "سیب"], ["🐟", "مچھلی"], ["🚗", "گاڑی"], ["🏠", "گھر"], ["🌙", "چاند"], ["🌳", "درخت"], ["📘", "کتاب"], ["🐱", "بلی"]];
                return pics.map(([emoji, answer]) => ({ kind: "tap", prompt: `${emoji} کے لیے لفظ`, answer, options: shuffle([answer, ...shuffle(["سیب", "مچھلی", "گاڑی", "گھر", "چاند", "درخت", "کتاب", "بلی"].filter(x => x !== answer)).slice(0, 3)]), hint: answer }));
            },
            "dictation": () => this.makeDictationQuestions(),
            "handwriting": () => this.makeHandwritingQuestions()
        };
        const make = makers[this.levelMeta.mechanic] || (() => []);
        return make();
    }

    makeSentenceSequences(groups) {
        return groups.map(tokens => ({
            kind: "sequence",
            prompt: "درست جملہ بنائیں",
            answer: tokens.join(" "),
            tokens: shuffle(tokens),
            hint: `جملہ "${tokens[0]}" سے شروع کریں`
        }));
    }

    makeCompleteSentenceQuestions() {
        const pool = [
            ["علی ___ جاتا ہے۔", "اسکول"],
            ["میں ___ کھاتا ہوں۔", "روٹی"],
            ["وہ ___ پڑھتی ہے۔", "کتاب"],
            ["ہم ___ میں کھیلتے ہیں۔", "پارک"],
            ["امی ___ بناتی ہیں۔", "کھانا"],
            ["بچی ___ پیتی ہے۔", "پانی"],
            ["استاد ___ پڑھاتے ہیں۔", "سبق"],
            ["وہ ___ لکھتا ہے۔", "خط"]
        ];
        return pool.map(([prompt, answer]) => ({
            kind: "tap",
            prompt,
            answer,
            options: shuffle([answer, "درخت", "گاڑی", "دوست"]),
            hint: `درست لفظ "${answer}" ہے`
        }));
    }

    makeDictationQuestions() {
        const words = ["کتاب", "درخت", "مچھلی", "سیب", "چاند", "گھر", "گاڑی", "دوست"];
        return words.map(word => ({
            kind: "tap",
            prompt: `املا: "${word}" سن کر منتخب کریں`,
            answer: word,
            options: shuffle([word, ...shuffle(words.filter(w => w !== word)).slice(0, 3)]),
            hint: word,
            speak: word
        }));
    }

    makeHandwritingQuestions() {
        const letters = ["ا", "ب", "پ", "ت", "ج", "چ", "خ", "س"];
        return letters.map(letter => ({
            kind: "tap",
            prompt: `خوشخطی: حرف "${letter}" پہچانیں`,
            answer: letter,
            options: shuffle([letter, ...shuffle(LETTERS.filter(ch => ch !== letter)).slice(0, 3)]),
            hint: letter
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
        if (q.speak && "speechSynthesis" in window) {
            const u = new SpeechSynthesisUtterance(q.speak);
            u.lang = "ur-PK";
            speechSynthesis.cancel();
            speechSynthesis.speak(u);
        }
        if (q.kind === "sequence") this.renderSequence(q);
        else this.renderTap(q);
    }

    renderTap(question) {
        const y = this.scale.height * 0.6;
        const spacing = Math.min(220, this.scale.width * 0.22);
        const startX = this.scale.width / 2 - spacing * 1.5;
        question.options.forEach((opt, i) => {
            const x = startX + i * spacing;
            const card = this.add.image(x, y, "optionCard").setDisplaySize(185, 165).setInteractive({ useHandCursor: true });
            const txt = this.add.text(x, y, String(opt), {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "42px",
                color: "#111827",
                align: "center",
                wordWrap: { width: 160 }
            }).setOrigin(0.5);
            card.on("pointerdown", () => {
                this.sounds.playTap();
                this.resolveAnswer(opt === question.answer);
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
        const startX = this.scale.width / 2 - ((slots - 1) * 120) / 2;
        const y = this.scale.height * 0.78;

        question.tokens.forEach((token, idx) => {
            const x = startX + idx * 120;
            const chip = this.add.rectangle(x, y, 108, 64, 0xf4a261, 0.95)
                .setStrokeStyle(2, 0x0b132b)
                .setInteractive({ useHandCursor: true, draggable: true });
            const label = this.add.text(x, y, token, {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "40px",
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
                const px = this.scale.width / 2 - ((slots - 1) * 120) / 2 + (placed.length - 1) * 120;
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
        this.showFloatingFeedback("دوبارہ", false);
        if (this.wrongStreak >= this.profile.hintAfterWrong) {
            this.showHint(this.currentQuestion?.hint || "آرام سے دوبارہ حل کریں");
            this.wrongStreak = 0;
        }
        this.time.delayedCall(this.profile.delay, () => { this.locked = false; });
    }

    showCompletion() {
        const result = this.completeModule();
        this.notifyLevelCompleted({ score: this.session.score, stars: result.stars, status: "completed" });
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

