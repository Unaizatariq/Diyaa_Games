import CurriculumScene from "../../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getMathsLevel } from "../data/levels.js";

function sample(array, count) {
    const clone = [...array];
    Phaser.Utils.Array.Shuffle(clone);
    return clone.slice(0, count);
}

export default class LevelScene extends CurriculumScene {
    constructor() {
        const levelId = window.DIYAA_GAME_CONFIG?.level || 1;
        const level = getMathsLevel(levelId);
        super("LevelScene", level.moduleId);
        this.levelMeta = level;
        this.profile = level.difficulty || { rounds: 8, answerDelayMs: 520, hintAfterWrong: 2 };
        this.questionIndex = 0;
        this.roundItems = [];
        this.questions = [];
        this.locked = false;
        this.wrongStreak = 0;
    }

    preload() {
        loadUI(this, window.DIYAA_GAME_CONFIG?.level || 1);
    }

    create() {
        super.create();
        this.createPromptArea();
        this.questions = this.buildQuestions();
        this.renderQuestion();
    }

    getRoundLimit() {
        return Math.max(1, this.profile.rounds || 8);
    }

    createPromptArea() {
        this.promptPanel = this.add.image(this.scale.width / 2, this.scale.height * 0.16, "panelBg")
            .setDisplaySize(Math.min(this.scale.width * 0.7, 880), Math.min(this.scale.height * 0.16, 140));
        this.promptText = this.add.text(this.scale.width / 2, this.scale.height * 0.16, "", {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: `${Math.max(24, this.scale.width * 0.018)}px`,
            color: "#20262e",
            align: "center",
            wordWrap: { width: Math.min(this.scale.width * 0.6, 760) }
        }).setOrigin(0.5);

        this.progressText = this.add.text(this.scale.width - 24, 26, "", {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#00000088",
            padding: { x: 10, y: 4 }
        }).setOrigin(1, 0);
    }

    buildQuestions() {
        switch (this.levelMeta.mechanic) {
            case "tap-choice":
                return this.buildTapChoiceQuestions();
            case "shape-sort":
                return this.buildShapeSortQuestions();
            case "number-sequence":
                return this.buildSequenceQuestions();
            case "concept-compare":
                return this.buildConceptQuestions();
            case "count-drag":
                return this.buildCountDragQuestions();
            case "missing-number":
                return this.buildMissingNumberQuestions();
            case "memory-number-words":
                return [{ kind: "memory-board" }];
            case "pattern-puzzle":
                return this.buildPatternQuestions();
            default:
                return [];
        }
    }

    buildTapChoiceQuestions() {
        return Array.from({ length: this.getRoundLimit() }, () => {
            const target = Phaser.Math.Between(1, 20);
            const options = [target];
            while (options.length < 4) {
                const next = Phaser.Math.Between(1, 20);
                if (!options.includes(next)) options.push(next);
            }
            Phaser.Utils.Array.Shuffle(options);
            return {
                kind: "tap",
                prompt: `Tap number ${target}`,
                answer: target,
                options,
                hint: `Find ${target} and tap it.`
            };
        });
    }

    buildShapeSortQuestions() {
        const deck = [
            { name: "CIRCLE", family: "curved", color: 0x5dade2 },
            { name: "OVAL", family: "curved", color: 0x85c1e9 },
            { name: "TRIANGLE", family: "edged", color: 0xf8c471 },
            { name: "SQUARE", family: "edged", color: 0xf1948a },
            { name: "RECTANGLE", family: "edged", color: 0xbb8fce },
            { name: "SEMI CIRCLE", family: "curved", color: 0x73c6b6 }
        ];
        return sample(deck, this.getRoundLimit()).map(item => ({
            kind: "shape-sort",
            prompt: `Drag ${item.name} to the correct family`,
            item,
            hint: item.family === "curved" ? "Curved shapes have rounded sides." : "Edged shapes have straight sides."
        }));
    }

    buildSequenceQuestions() {
        const questions = [];
        for (let i = 0; i < this.getRoundLimit(); i++) {
            const start = Phaser.Math.Between(1, 17);
            const a = start;
            const b = start + 1;
            const c = start + 2;
            const patterns = [
                { text: `${a}, __, ${c}`, answer: b },
                { text: `__, ${b}, ${c}`, answer: a },
                { text: `${a}, ${b}, __`, answer: c }
            ];
            const pick = Phaser.Utils.Array.GetRandom(patterns);
            const options = [pick.answer];
            while (options.length < 4) {
                const value = Phaser.Math.Between(1, 20);
                if (!options.includes(value)) options.push(value);
            }
            Phaser.Utils.Array.Shuffle(options);
            questions.push({
                kind: "tap",
                prompt: `Complete: ${pick.text}`,
                answer: pick.answer,
                options,
                hint: "Count one step at a time in order."
            });
        }
        return questions;
    }

    buildConceptQuestions() {
        return [
            { prompt: "Which tower is TALL?", left: "Tall", right: "Short", answer: "left", hint: "Tall means higher." },
            { prompt: "Which rope is LONG?", left: "Long", right: "Short", answer: "left", hint: "Long means greater length." },
            { prompt: "Which basket has MORE apples?", left: "More", right: "Less", answer: "left", hint: "More means bigger quantity." },
            { prompt: "Which pencil is SHORT?", left: "Long", right: "Short", answer: "right", hint: "Short means smaller length." },
            { prompt: "Which line is LONG?", left: "Long", right: "Short", answer: "left", hint: "Long means farther end point." },
            { prompt: "Which cup has LESS water?", left: "More", right: "Less", answer: "right", hint: "Less means smaller quantity." },
            { prompt: "Which plant is SHORT?", left: "Tall", right: "Short", answer: "right", hint: "Short is the lower one." },
            { prompt: "Which pile has MORE blocks?", left: "More", right: "Less", answer: "left", hint: "Compare the counts." }
        ].slice(0, this.getRoundLimit()).map(item => ({ kind: "concept", ...item }));
    }

    buildCountDragQuestions() {
        const icons = ["A", "*", "#", "@", "+", "B", "C", "D"];
        return icons.slice(0, this.getRoundLimit()).map((icon, index) => {
            const count = index + 3;
            const options = [count];
            while (options.length < 4) {
                const val = Phaser.Math.Between(1, 12);
                if (!options.includes(val)) options.push(val);
            }
            Phaser.Utils.Array.Shuffle(options);
            return {
                kind: "count-drag",
                prompt: "Count the symbols and drag the correct number",
                icon,
                count,
                options,
                hint: `Count carefully. There are ${count} symbols.`
            };
        });
    }

    buildMissingNumberQuestions() {
        const questions = [];
        for (let i = 0; i < this.getRoundLimit(); i++) {
            const start = Phaser.Math.Between(1, 15);
            const seq = [start, start + 1, start + 2, start + 3];
            const missingIndex = Phaser.Math.Between(0, 3);
            const answer = seq[missingIndex];
            const view = seq.map((num, idx) => idx === missingIndex ? "__" : String(num)).join("  ");
            const options = [answer];
            while (options.length < 4) {
                const val = Phaser.Math.Between(1, 20);
                if (!options.includes(val)) options.push(val);
            }
            Phaser.Utils.Array.Shuffle(options);
            questions.push({
                kind: "tap",
                prompt: `Number train: ${view}`,
                answer,
                options,
                hint: "Numbers increase one by one in this train."
            });
        }
        return questions;
    }

    buildPatternQuestions() {
        const seeds = [
            [2, 4, 6],
            [1, 3, 5],
            [5, 10, 15],
            [3, 6, 9],
            [4, 8, 12],
            [2, 5, 8],
            [6, 9, 12],
            [1, 4, 7]
        ];
        return seeds.slice(0, this.getRoundLimit()).map(seed => {
            const answer = seed[2] + (seed[1] - seed[0]);
            const options = [answer];
            while (options.length < 4) {
                const val = Phaser.Math.Between(1, 20);
                if (!options.includes(val)) options.push(val);
            }
            Phaser.Utils.Array.Shuffle(options);
            return {
                kind: "tap",
                prompt: `Pattern: ${seed[0]}, ${seed[1]}, ${seed[2]}, __`,
                answer,
                options,
                hint: "The same step repeats each time."
            };
        });
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
        this.promptText.setText(question.prompt || "Match all number-word pairs");
        this.progressText.setText(`Q ${this.questionIndex + 1}/${this.questions.length}`);

        switch (question.kind) {
            case "tap":
                this.renderTapOptions(question);
                break;
            case "shape-sort":
                this.renderShapeSort(question);
                break;
            case "concept":
                this.renderConcept(question);
                break;
            case "count-drag":
                this.renderCountDrag(question);
                break;
            case "memory-board":
                this.renderMemoryBoard();
                break;
            default:
                this.renderTapOptions(question);
                break;
        }
    }

    renderTapOptions(question) {
        const y = this.scale.height * 0.55;
        const spacing = Math.min(190, this.scale.width * 0.2);
        const startX = this.scale.width / 2 - (spacing * 1.5);

        question.options.forEach((option, index) => {
            const x = startX + index * spacing;
            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(150, 150)
                .setInteractive({ useHandCursor: true });
            const label = this.add.text(x, y, String(option), {
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "52px",
                fontStyle: "bold",
                color: "#1f2937"
            }).setOrigin(0.5);

            card.on("pointerdown", () => {
                this.sounds.playTap();
                this.handleAnswer(option === question.answer);
            });
            this.roundItems.push(card, label);
        });
    }

    renderShapeSort(question) {
        const y = this.scale.height * 0.56;
        const leftZone = this.createDropZone(this.scale.width * 0.32, y, "CURVED");
        const rightZone = this.createDropZone(this.scale.width * 0.68, y, "EDGED");
        const draggable = this.createDraggableChip(this.scale.width / 2, this.scale.height * 0.36, question.item.name, question.item.color);
        draggable.on("drag", (pointer, dragX, dragY) => {
            draggable.x = dragX;
            draggable.y = dragY;
        });
        draggable.on("dragend", () => {
            this.sounds.playTap();
            const droppedOnLeft = Phaser.Geom.Rectangle.Contains(leftZone.getBounds(), draggable.x, draggable.y);
            const droppedOnRight = Phaser.Geom.Rectangle.Contains(rightZone.getBounds(), draggable.x, draggable.y);
            const correct = (question.item.family === "curved" && droppedOnLeft) ||
                (question.item.family === "edged" && droppedOnRight);
            if (droppedOnLeft || droppedOnRight) {
                this.handleAnswer(correct);
            } else {
                this.tweens.add({ targets: [draggable, draggable.label], x: this.scale.width / 2, y: this.scale.height * 0.36, duration: 220 });
            }
        });
        this.roundItems.push(leftZone, rightZone, draggable, draggable.label);
    }

    renderConcept(question) {
        const y = this.scale.height * 0.56;
        const leftCard = this.createConceptCard(this.scale.width * 0.33, y, question.left);
        const rightCard = this.createConceptCard(this.scale.width * 0.67, y, question.right);
        leftCard.card.on("pointerdown", () => {
            this.sounds.playTap();
            this.handleAnswer(question.answer === "left");
        });
        rightCard.card.on("pointerdown", () => {
            this.sounds.playTap();
            this.handleAnswer(question.answer === "right");
        });
        this.roundItems.push(leftCard.card, leftCard.text, rightCard.card, rightCard.text);
    }

    renderCountDrag(question) {
        const centerX = this.scale.width / 2;
        const objectLine = Array.from({ length: question.count }).map(() => question.icon).join(" ");
        const objectText = this.add.text(centerX, this.scale.height * 0.38, objectLine, {
            fontSize: `${Math.max(28, 640 / question.count)}px`,
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        const target = this.add.rectangle(centerX, this.scale.height * 0.6, 220, 120, 0x264653, 0.85)
            .setStrokeStyle(4, 0xe9c46a);
        const targetLabel = this.add.text(centerX, this.scale.height * 0.6, "DROP NUMBER", {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "24px",
            color: "#f1faee"
        }).setOrigin(0.5);

        this.roundItems.push(objectText, target, targetLabel);

        const spacing = Math.min(170, this.scale.width * 0.18);
        const startX = centerX - spacing * 1.5;
        question.options.forEach((option, idx) => {
            const chip = this.createDraggableChip(startX + idx * spacing, this.scale.height * 0.82, String(option), 0xf4a261);
            chip.on("drag", (pointer, dragX, dragY) => {
                chip.x = dragX;
                chip.y = dragY;
                chip.label.x = dragX;
                chip.label.y = dragY;
            });
            chip.on("dragend", () => {
                this.sounds.playTap();
                const overTarget = Phaser.Geom.Rectangle.Contains(target.getBounds(), chip.x, chip.y);
                if (overTarget) {
                    this.handleAnswer(option === question.count);
                } else {
                    this.tweens.add({
                        targets: [chip, chip.label],
                        x: startX + idx * spacing,
                        y: this.scale.height * 0.82,
                        duration: 200
                    });
                }
            });
            this.roundItems.push(chip, chip.label);
        });
    }

    renderMemoryBoard() {
        const deck = [
            ["1", "ONE"],
            ["2", "TWO"],
            ["3", "THREE"],
            ["4", "FOUR"]
        ];
        const cards = deck.flatMap(([a, b]) => [{ key: a, pair: a }, { key: b, pair: a }]);
        Phaser.Utils.Array.Shuffle(cards);

        const opened = [];
        let matched = 0;
        this.promptText.setText("Match each number with its word");

        cards.forEach((item, idx) => {
            const col = idx % 4;
            const row = Math.floor(idx / 4);
            const x = this.scale.width * 0.32 + col * 160;
            const y = this.scale.height * 0.42 + row * 170;
            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(130, 130)
                .setInteractive({ useHandCursor: true });
            const valueText = this.add.text(x, y, item.key, {
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "30px",
                color: "#111827"
            }).setOrigin(0.5).setVisible(false);

            const state = { card, valueText, item, flipped: false, matched: false };
            card.on("pointerdown", () => {
                this.sounds.playTap();
                if (this.locked || state.flipped || state.matched) return;
                state.flipped = true;
                valueText.setVisible(true);
                opened.push(state);
                if (opened.length === 2) {
                    this.locked = true;
                    const [a, b] = opened;
                    const isMatch = a.item.pair === b.item.pair && a.item.key !== b.item.key;
                    this.time.delayedCall(420, () => {
                        if (isMatch) {
                            a.matched = true;
                            b.matched = true;
                            matched += 1;
                            this.onCorrectAnswer();
                            this.showFeedback(true, "+10");
                            if (matched >= 4) {
                                this.questionIndex += 1;
                                this.time.delayedCall(this.profile.answerDelayMs, () => this.renderQuestion());
                            }
                        } else {
                            a.flipped = false;
                            b.flipped = false;
                            a.valueText.setVisible(false);
                            b.valueText.setVisible(false);
                            this.onWrongAnswer();
                            this.showFeedback(false, "Try again");
                        }
                        opened.length = 0;
                        this.locked = false;
                    });
                }
            });
            this.roundItems.push(card, valueText);
        });
    }

    createDropZone(x, y, label) {
        const box = this.add.rectangle(x, y, 260, 180, 0x1d3557, 0.85).setStrokeStyle(4, 0xa8dadc);
        const text = this.add.text(x, y, label, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "28px",
            color: "#f1faee"
        }).setOrigin(0.5);
        this.roundItems.push(text);
        return box;
    }

    createDraggableChip(x, y, label, color) {
        const chip = this.add.rectangle(x, y, 200, 94, color, 0.95)
            .setStrokeStyle(3, 0x0b132b)
            .setInteractive({ useHandCursor: true, draggable: true });
        chip.label = this.add.text(x, y, label, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "26px",
            fontStyle: "bold",
            color: "#0b132b"
        }).setOrigin(0.5);
        this.input.setDraggable(chip);
        return chip;
    }

    createConceptCard(x, y, label) {
        const card = this.add.image(x, y, "optionCard")
            .setDisplaySize(280, 210)
            .setInteractive({ useHandCursor: true });
        const text = this.add.text(x, y, label, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "42px",
            fontStyle: "bold",
            color: "#111827"
        }).setOrigin(0.5);
        return { card, text };
    }

    handleAnswer(correct) {
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
        this.showFeedback(false, "Try again");

        if (this.wrongStreak >= (this.profile.hintAfterWrong || 2)) {
            this.showHint(this.currentQuestion?.hint || "Look closely and try once more.");
            this.wrongStreak = 0;
        }

        this.time.delayedCall(this.profile.answerDelayMs, () => {
            this.locked = false;
        });
    }

    showFeedback(isCorrect, text) {
        const color = isCorrect ? "#22c55e" : "#ef4444";
        const feedback = this.add.text(this.scale.width / 2, this.scale.height * 0.28, text, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "42px",
            fontStyle: "bold",
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
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "24px",
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
        this.promptText.setText("Great work! Module completed.");
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
