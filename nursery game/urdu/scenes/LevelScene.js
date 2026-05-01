import CurriculumScene from "../../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getUrduLevel } from "../data/levels.js";

const LETTERS = ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ر", "ز", "س", "ش"];
const DOT_COUNT = {
    "ا": 0, "ح": 0, "د": 0, "ر": 0, "س": 0,
    "ب": 1, "ج": 1, "خ": 1, "ز": 1,
    "ت": 2,
    "پ": 3, "ٹ": 3, "ث": 3, "چ": 3, "ش": 3, "ڈ": 3
};

function randomOptions(answer, pool, count = 4) {
    const options = [answer];
    while (options.length < count) {
        const candidate = Phaser.Utils.Array.GetRandom(pool);
        if (!options.includes(candidate)) options.push(candidate);
    }
    Phaser.Utils.Array.Shuffle(options);
    return options;
}

export default class LevelScene extends CurriculumScene {
    constructor() {
        const level = getUrduLevel(window.DIYAA_GAME_CONFIG?.level || 1);
        super("LevelScene", level.moduleId);
        this.levelMeta = level;
        this.profile = level.difficulty || { rounds: 8, answerDelayMs: 540, hintAfterWrong: 2 };
        this.questionIndex = 0;
        this.questions = [];
        this.roundItems = [];
        this.locked = false;
        this.recognition = null;
        this.wrongStreak = 0;
    }

    preload() {
        loadUI(this, window.DIYAA_GAME_CONFIG?.level || 1);
    }

    create() {
        super.create();
        this.promptPanel = this.add.image(this.scale.width / 2, this.scale.height * 0.16, "panelBg")
            .setDisplaySize(Math.min(this.scale.width * 0.7, 880), Math.min(this.scale.height * 0.16, 140));
        this.promptText = this.add.text(this.scale.width / 2, this.scale.height * 0.16, "", {
            fontFamily: "Noto Nastaliq Urdu, Arial",
            fontSize: `${Math.max(28, this.scale.width * 0.022)}px`,
            color: "#20262e",
            align: "center"
        }).setOrigin(0.5);
        this.progressText = this.add.text(this.scale.width - 24, 26, "", {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#00000088",
            padding: { x: 10, y: 4 }
        }).setOrigin(1, 0);

        this.questions = this.buildQuestions();
        this.renderQuestion();
    }

    getRoundLimit() {
        return Math.max(1, this.profile.rounds || 8);
    }

    buildQuestions() {
        switch (this.levelMeta.mechanic) {
            case "tap-letter":
                return Array.from({ length: this.getRoundLimit() }, () => {
                    const answer = Phaser.Utils.Array.GetRandom(LETTERS);
                    return {
                        kind: "tap",
                        prompt: `اس حرف پر ٹیپ کریں: ${answer}`,
                        answer,
                        options: randomOptions(answer, LETTERS),
                        hint: `یہ حرف ${answer} ہے`
                    };
                });
            case "dot-count":
                return Array.from({ length: this.getRoundLimit() }, () => {
                    const answer = Phaser.Utils.Array.GetRandom(Object.keys(DOT_COUNT));
                    const dots = DOT_COUNT[answer];
                    const pool = Object.keys(DOT_COUNT).filter(letter => DOT_COUNT[letter] !== dots);
                    return {
                        kind: "tap",
                        prompt: `${dots} نقطے والا حرف منتخب کریں`,
                        answer,
                        options: randomOptions(answer, pool),
                        hint: `صحیح حرف ${answer} ہے`
                    };
                });
            case "odd-shape":
                return Array.from({ length: this.getRoundLimit() }, () => {
                    const wrong = Phaser.Utils.Array.GetRandom(["@", "#", "%", "&"]);
                    const options = [...Phaser.Utils.Array.Shuffle([...LETTERS]).slice(0, 3), wrong];
                    Phaser.Utils.Array.Shuffle(options);
                    return { kind: "tap", prompt: "غیر حرف شکل منتخب کریں", answer: wrong, options, hint: "صرف ایک نشان حرف نہیں ہے" };
                });
            case "sequence-drag":
                return Array.from({ length: this.getRoundLimit() }, (_, idx) => {
                    const start = idx;
                    const chain = LETTERS.slice(start, start + 3);
                    const shuffled = Phaser.Utils.Array.Shuffle([...chain]);
                    return { kind: "sequence-drag", prompt: "حروف کو درست ترتیب میں رکھیں", chain, shuffled, hint: chain.join(" - ") };
                });
            case "memory-match":
                return [{ kind: "memory", hint: "ایک جیسے دو حروف کا جوڑا بنائیں" }];
            case "first-letter":
                return [
                    ["انار", "ا"], ["بکری", "ب"], ["پتنگ", "پ"], ["تتلی", "ت"],
                    ["جہاز", "ج"], ["چڑیا", "چ"], ["خرگوش", "خ"], ["سیب", "س"]
                ].slice(0, this.getRoundLimit()).map(([word, answer]) => ({
                    kind: "tap",
                    prompt: `لفظ "${word}" کا پہلا حرف کون سا ہے؟`,
                    answer,
                    options: randomOptions(answer, LETTERS),
                    hint: `${word} کا پہلا حرف ${answer} ہے`
                }));
            case "sort-groups":
                return Array.from({ length: this.getRoundLimit() }, () => {
                    const letter = Phaser.Utils.Array.GetRandom(Object.keys(DOT_COUNT));
                    const family = DOT_COUNT[letter] > 0 ? "dots" : "no-dots";
                    return { kind: "sort", prompt: "حرف کو درست گروپ میں رکھیں", letter, family, hint: DOT_COUNT[letter] > 0 ? "نقطہ والے میں رکھیں" : "بغیر نقطہ میں رکھیں" };
                });
            case "voice-letter":
                return Array.from({ length: this.getRoundLimit() }, () => {
                    const answer = Phaser.Utils.Array.GetRandom(["ا", "ب", "پ", "ت", "ج", "چ", "س"]);
                    return { kind: "voice", prompt: `یہ حرف بولیں: ${answer}`, answer, hint: `حرف ${answer} بولیں` };
                });
            default:
                return [];
        }
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
        this.promptText.setText(q.prompt || "");
        this.progressText.setText(`Q ${this.questionIndex + 1}/${this.questions.length}`);
        if (q.kind === "sequence-drag") this.renderSequenceDrag(q);
        else if (q.kind === "memory") this.renderMemory();
        else if (q.kind === "sort") this.renderSort(q);
        else if (q.kind === "voice") this.renderVoice(q);
        else this.renderTap(q);
    }

    renderTap(question) {
        const spacing = Math.min(190, this.scale.width * 0.2);
        const startX = this.scale.width / 2 - spacing * 1.5;
        const y = this.scale.height * 0.55;
        question.options.forEach((option, index) => {
            const card = this.add.image(startX + spacing * index, y, "optionCard")
                .setDisplaySize(150, 150)
                .setInteractive({ useHandCursor: true });
            const text = this.add.text(card.x, card.y, option, {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "56px",
                color: "#111827"
            }).setOrigin(0.5);
            card.on("pointerdown", () => {
                this.sounds.playTap();
                this.resolveAnswer(option === question.answer);
            });
            this.roundItems.push(card, text);
        });
    }

    renderSequenceDrag(question) {
        const slots = [
            { x: this.scale.width * 0.3, y: this.scale.height * 0.6 },
            { x: this.scale.width * 0.5, y: this.scale.height * 0.6 },
            { x: this.scale.width * 0.7, y: this.scale.height * 0.6 }
        ];
        const placed = [null, null, null];

        slots.forEach((slot, idx) => {
            const zone = this.add.rectangle(slot.x, slot.y, 140, 140, 0x1d3557, 0.85).setStrokeStyle(3, 0xa8dadc);
            const marker = this.add.text(slot.x, slot.y - 80, String(idx + 1), {
                fontSize: "26px",
                color: "#ffffff"
            }).setOrigin(0.5);
            this.roundItems.push(zone, marker);
        });

        question.shuffled.forEach((letter, idx) => {
            const startX = this.scale.width * 0.3 + idx * 180;
            const chip = this.add.rectangle(startX, this.scale.height * 0.34, 130, 110, 0xf4a261, 0.95)
                .setInteractive({ draggable: true, useHandCursor: true });
            const label = this.add.text(startX, this.scale.height * 0.34, letter, {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "54px",
                color: "#0b132b"
            }).setOrigin(0.5);
            this.input.setDraggable(chip);
            chip.on("drag", (pointer, dragX, dragY) => {
                chip.x = dragX; chip.y = dragY; label.x = dragX; label.y = dragY;
            });
            chip.on("dragend", () => {
                this.sounds.playTap();
                const slotIndex = slots.findIndex(slot => Phaser.Math.Distance.Between(slot.x, slot.y, chip.x, chip.y) < 80);
                if (slotIndex >= 0) {
                    chip.x = slots[slotIndex].x;
                    chip.y = slots[slotIndex].y;
                    label.x = slots[slotIndex].x;
                    label.y = slots[slotIndex].y;
                    placed[slotIndex] = letter;
                    if (placed.every(Boolean)) {
                        const correct = placed.join("") === question.chain.join("");
                        this.resolveAnswer(correct);
                    }
                } else {
                    this.tweens.add({ targets: [chip, label], x: startX, y: this.scale.height * 0.34, duration: 180 });
                }
            });
            this.roundItems.push(chip, label);
        });
    }

    renderMemory() {
        this.promptText.setText("ایک جیسے حروف کے جوڑے بنائیں");
        const base = ["ا", "ب", "پ", "ت"];
        const cards = [...base, ...base];
        Phaser.Utils.Array.Shuffle(cards);
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
            const txt = this.add.text(x, y, letter, {
                fontFamily: "Noto Nastaliq Urdu, Arial",
                fontSize: "58px",
                color: "#111827"
            }).setOrigin(0.5).setVisible(false);
            const state = { letter, card, txt, flipped: false, matched: false };
            card.on("pointerdown", () => {
                this.sounds.playTap();
                if (this.locked || state.flipped || state.matched) return;
                state.flipped = true;
                txt.setVisible(true);
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
                            this.showFeedback(true, "+10");
                            if (matched === base.length) {
                                this.questionIndex += 1;
                                this.time.delayedCall(this.profile.answerDelayMs, () => this.renderQuestion());
                            }
                        } else {
                            a.flipped = false; b.flipped = false;
                            a.txt.setVisible(false); b.txt.setVisible(false);
                            this.onWrongAnswer();
                            this.showFeedback(false, "دوبارہ کوشش کریں");
                        }
                        opened.length = 0;
                        this.locked = false;
                    });
                }
            });
            this.roundItems.push(card, txt);
        });
    }

    renderSort(question) {
        const dotsZone = this.add.rectangle(this.scale.width * 0.32, this.scale.height * 0.58, 260, 190, 0x1d3557, 0.85)
            .setStrokeStyle(4, 0xa8dadc);
        const cleanZone = this.add.rectangle(this.scale.width * 0.68, this.scale.height * 0.58, 260, 190, 0x1d3557, 0.85)
            .setStrokeStyle(4, 0xa8dadc);
        const t1 = this.add.text(dotsZone.x, dotsZone.y, "نقطہ والے", {
            fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: "32px", color: "#ffffff"
        }).setOrigin(0.5);
        const t2 = this.add.text(cleanZone.x, cleanZone.y, "بغیر نقطہ", {
            fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: "32px", color: "#ffffff"
        }).setOrigin(0.5);

        const chip = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.34, 140, 120, 0xf4a261, 0.95)
            .setInteractive({ draggable: true, useHandCursor: true });
        const txt = this.add.text(chip.x, chip.y, question.letter, {
            fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: "62px", color: "#0b132b"
        }).setOrigin(0.5);
        this.input.setDraggable(chip);
        chip.on("drag", (pointer, dragX, dragY) => {
            chip.x = dragX; chip.y = dragY; txt.x = dragX; txt.y = dragY;
        });
        chip.on("dragend", () => {
            this.sounds.playTap();
            const onDots = Phaser.Geom.Rectangle.Contains(dotsZone.getBounds(), chip.x, chip.y);
            const onClean = Phaser.Geom.Rectangle.Contains(cleanZone.getBounds(), chip.x, chip.y);
            if (!onDots && !onClean) {
                this.tweens.add({ targets: [chip, txt], x: this.scale.width / 2, y: this.scale.height * 0.34, duration: 180 });
                return;
            }
            const correct = (question.family === "dots" && onDots) || (question.family === "no-dots" && onClean);
            this.resolveAnswer(correct);
        });

        this.roundItems.push(dotsZone, cleanZone, t1, t2, chip, txt);
    }

    renderVoice(question) {
        const card = this.add.image(this.scale.width / 2, this.scale.height * 0.45, "optionCard")
            .setDisplaySize(220, 220);
        const letter = this.add.text(card.x, card.y, question.answer, {
            fontFamily: "Noto Nastaliq Urdu, Arial",
            fontSize: "110px",
            color: "#111827"
        }).setOrigin(0.5);

        const mic = this.add.image(this.scale.width / 2, this.scale.height * 0.73, "playBtn")
            .setDisplaySize(280, 100)
            .setInteractive({ useHandCursor: true });
        const micText = this.add.text(mic.x, mic.y, "بولیں", {
            fontFamily: "Noto Nastaliq Urdu, Arial",
            fontSize: "42px",
            color: "#ffffff"
        }).setOrigin(0.5);
        mic.on("pointerdown", () => {
            this.sounds.playTap();
            this.startVoiceCapture(question.answer);
        });

        this.roundItems.push(card, letter, mic, micText);
    }

    startVoiceCapture(answer) {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) {
            this.promptText.setText("وائس فیچر کے لیے Chrome استعمال کریں");
            return;
        }
        if (this.recognition) this.recognition.stop();
        this.locked = true;

        const recog = new Recognition();
        this.recognition = recog;
        recog.lang = "ur-PK";
        recog.interimResults = false;
        recog.maxAlternatives = 1;

        recog.onresult = event => {
            const heard = (event.results[0][0].transcript || "").trim();
            const normalized = heard.charAt(0);
            this.locked = false;
            this.resolveAnswer(normalized === answer);
        };
        recog.onerror = () => {
            this.locked = false;
            this.onWrongAnswer();
            this.showFeedback(false, "آواز واضح نہیں آئی");
        };
        recog.onend = () => {
            this.locked = false;
        };
        try {
            recog.start();
        } catch (error) {
            this.locked = false;
        }
    }

    resolveAnswer(correct) {
        if (this.locked) return;
        this.locked = true;

        if (correct) {
            this.wrongStreak = 0;
            this.onCorrectAnswer();
            this.showFeedback(true, "+10");
            this.questionIndex += 1;
            this.time.delayedCall(this.profile.answerDelayMs, () => this.renderQuestion());
            return;
        }

        this.wrongStreak += 1;
        this.onWrongAnswer();
        this.showFeedback(false, "دوبارہ کوشش کریں");

        if (this.wrongStreak >= (this.profile.hintAfterWrong || 2)) {
            this.showHint(this.currentQuestion?.hint || "اشارہ دیکھیں اور دوبارہ کریں");
            this.wrongStreak = 0;
        }

        this.time.delayedCall(this.profile.answerDelayMs, () => {
            this.locked = false;
        });
    }

    showFeedback(isCorrect, text) {
        const color = isCorrect ? "#22c55e" : "#ef4444";
        const feedback = this.add.text(this.scale.width / 2, this.scale.height * 0.28, text, {
            fontFamily: "Noto Nastaliq Urdu, Arial",
            fontSize: "36px",
            color
        }).setOrigin(0.5);
        this.roundItems.push(feedback);
        this.tweens.add({
            targets: feedback,
            y: feedback.y - 30,
            alpha: 0,
            duration: 420,
            onComplete: () => feedback.destroy()
        });
    }

    showHint(text) {
        const hint = this.add.text(this.scale.width / 2, this.scale.height * 0.24, text, {
            fontFamily: "Noto Nastaliq Urdu, Arial",
            fontSize: "28px",
            color: "#fde68a",
            backgroundColor: "#111827cc",
            padding: { x: 14, y: 6 }
        }).setOrigin(0.5);
        this.roundItems.push(hint);
        this.time.delayedCall(1200, () => hint.destroy());
    }

    showCompletion() {
        const result = this.completeModule();
        this.notifyLevelCompleted({
            score: this.session.score,
            stars: result.stars,
            status: "completed"
        });
        this.clearRound();
        this.progressText.setText(`Q ${this.questions.length}/${this.questions.length}`);
        this.promptText.setText("کمال! آپ نے لیول مکمل کر لیا");
        const panel = this.add.image(this.scale.width / 2, this.scale.height * 0.58, "panelBg")
            .setDisplaySize(Math.min(580, this.scale.width * 0.72), Math.min(360, this.scale.height * 0.52));
        const score = this.add.text(this.scale.width / 2, this.scale.height * 0.54, `Score: ${this.session.score}`, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "38px",
            color: "#1b1f23",
            fontStyle: "bold"
        }).setOrigin(0.5);
        const stars = this.add.text(this.scale.width / 2, this.scale.height * 0.64, `Stars: ${result.stars}/3`, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "30px",
            color: "#1b1f23"
        }).setOrigin(0.5);
        this.roundItems.push(panel, score, stars);
    }
}
