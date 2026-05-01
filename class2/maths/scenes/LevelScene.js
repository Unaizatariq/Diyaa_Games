import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass2MathsLevel } from "../data/levels.js";

function shuffle(list) {
    const copy = [...list];
    Phaser.Utils.Array.Shuffle(copy);
    return copy;
}

export default class LevelScene extends CurriculumScene {
    constructor() {
        const levelMeta = getClass2MathsLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        const makers = {
            "numbers-1-1000": () => Array.from({ length: 8 }, () => {
                const n = Phaser.Math.Between(101, 999);
                const answer = n + 1;
                return { prompt: `What comes after ${n}?`, answer, options: shuffle([answer, answer + 1, answer - 1, answer + 2]), hint: "Add 1." };
            }),
            "place-value": () => Array.from({ length: 8 }, () => {
                const n = Phaser.Math.Between(100, 999);
                const digit = Number(String(n)[1]);
                return { prompt: `What is the tens digit in ${n}?`, answer: digit, options: shuffle([digit, (digit + 1) % 10, (digit + 2) % 10, (digit + 3) % 10]), hint: "Middle digit is tens." };
            }),
            "addition": () => this.arithmetic("+"),
            "subtraction": () => this.arithmetic("-"),
            "multiplication": () => this.arithmetic("x"),
            "division-basic": () => this.divisionQuestions(),
            "even-odd": () => this.evenOddQuestions(),
            "number-comparison": () => this.comparisonQuestions(),
            "shapes-2d": () => this.shapeQuestions(),
            "measurement": () => this.measurementQuestions(),
            "time-clock": () => this.timeQuestions(),
            "money": () => this.moneyQuestions(),
            "word-problems": () => this.wordProblemQuestions(),
            "patterns": () => this.patternQuestions()
        };
        const make = makers[this.levelMeta.mechanic] || (() => []);
        return make().map(item => ({ kind: "tap", ...item }));
    }

    arithmetic(op) {
        return Array.from({ length: 8 }, () => {
            let a = Phaser.Math.Between(10, 99);
            let b = Phaser.Math.Between(2, 30);
            let answer = 0;
            if (op === "+") answer = a + b;
            if (op === "-") { if (b > a) [a, b] = [b, a]; answer = a - b; }
            if (op === "x") { a = Phaser.Math.Between(2, 12); b = Phaser.Math.Between(2, 10); answer = a * b; }
            return {
                prompt: `${a} ${op} ${b} = ?`,
                answer,
                options: shuffle([answer, answer + 1, answer + 2, Math.max(0, answer - 1)]),
                hint: op === "+" ? "Add both numbers." : op === "-" ? "Count backward." : "Repeated addition."
            };
        });
    }

    divisionQuestions() {
        return Array.from({ length: 8 }, () => {
            const b = Phaser.Math.Between(2, 9);
            const answer = Phaser.Math.Between(2, 9);
            const a = b * answer;
            return {
                prompt: `${a} ÷ ${b} = ?`,
                answer,
                options: shuffle([answer, answer + 1, answer - 1, answer + 2]),
                hint: "Think: b x ? = a"
            };
        });
    }

    evenOddQuestions() {
        return Array.from({ length: 8 }, () => {
            const n = Phaser.Math.Between(1, 200);
            const answer = n % 2 === 0 ? "Even" : "Odd";
            return {
                prompt: `${n} is...`,
                answer,
                options: ["Even", "Odd", "Prime", "Square"],
                hint: "Last digit tells even/odd."
            };
        });
    }

    comparisonQuestions() {
        return Array.from({ length: 8 }, () => {
            const a = Phaser.Math.Between(50, 999);
            const b = Phaser.Math.Between(50, 999);
            const answer = a > b ? ">" : a < b ? "<" : "=";
            return { prompt: `${a} __ ${b}`, answer, options: [">", "<", "=", "!="], hint: "Compare hundreds, then tens." };
        });
    }

    shapeQuestions() {
        const pool = [
            ["3 sides", "Triangle"], ["4 equal sides", "Square"], ["No side, round", "Circle"], ["4 sides, long+short", "Rectangle"],
            ["6 sides", "Hexagon"], ["5 sides", "Pentagon"], ["8 sides", "Octagon"], ["3 corners", "Triangle"]
        ];
        return pool.map(([prompt, answer]) => ({
            prompt: `Which shape has ${prompt}?`,
            answer,
            options: shuffle([answer, "Circle", "Square", "Rectangle"]),
            hint: `Correct shape is "${answer}".`
        }));
    }

    measurementQuestions() {
        return [
            ["A pencil is measured in ___", "cm"],
            ["A bag of rice is measured in ___", "kg"],
            ["A ribbon is measured in ___", "cm"],
            ["A child weighs in ___", "kg"],
            ["A table length is in ___", "cm"],
            ["A watermelon weighs in ___", "kg"],
            ["A thread length is in ___", "cm"],
            ["A school bag weighs in ___", "kg"]
        ].map(([prompt, answer]) => ({
            prompt,
            answer,
            options: ["cm", "kg", "hour", "rupee"],
            hint: `Use "${answer}".`
        }));
    }

    timeQuestions() {
        const pool = [
            ["03:00", "three o'clock"], ["07:00", "seven o'clock"], ["09:30", "half past nine"], ["12:30", "half past twelve"],
            ["05:00", "five o'clock"], ["08:30", "half past eight"], ["10:00", "ten o'clock"], ["01:30", "half past one"]
        ];
        return pool.map(([clock, answer]) => ({
            prompt: `Read this time: ${clock}`,
            answer,
            options: shuffle([answer, "one o'clock", "half past two", "quarter to five"]),
            hint: clock.endsWith(":00") ? "At :00 say o'clock." : "At :30 say half past."
        }));
    }

    moneyQuestions() {
        return [
            [20, 5, 25], [30, 10, 40], [15, 5, 20], [50, 20, 70],
            [100, 50, 150], [25, 25, 50], [40, 30, 70], [60, 20, 80]
        ].map(([a, b, answer]) => ({
            prompt: `Rs ${a} + Rs ${b} = ?`,
            answer: `Rs ${answer}`,
            options: shuffle([`Rs ${answer}`, `Rs ${answer + 5}`, `Rs ${answer - 5}`, `Rs ${answer + 10}`]),
            hint: "Add rupees."
        }));
    }

    wordProblemQuestions() {
        return [
            ["Ali has 12 pencils and gets 8 more. Total?", 20],
            ["There are 30 birds, 12 fly away. Left?", 18],
            ["One box has 5 oranges. 4 boxes have?", 20],
            ["20 candies shared among 4 kids. Each gets?", 5],
            ["A bus has 25 children, 10 more enter. Total?", 35],
            ["40 balloons, 15 burst. Left?", 25],
            ["6 bags with 3 books each. Total books?", 18],
            ["18 apples in 3 baskets equally. Each basket?", 6]
        ].map(([prompt, answer]) => ({
            prompt,
            answer,
            options: shuffle([answer, answer + 2, answer - 2, answer + 4]),
            hint: "Find operation from story."
        }));
    }

    patternQuestions() {
        const pool = [[2, 4, 6], [5, 10, 15], [3, 6, 9], [1, 3, 5], [10, 20, 30], [4, 8, 12], [7, 14, 21], [6, 12, 18]];
        return pool.map(seed => {
            const answer = seed[2] + (seed[1] - seed[0]);
            return {
                prompt: `Pattern: ${seed[0]}, ${seed[1]}, ${seed[2]}, __`,
                answer,
                options: shuffle([answer, answer + 2, answer - 2, answer + 4]),
                hint: "Same jump repeats."
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
        const q = this.questions[this.questionIndex];
        this.currentQuestion = q;
        this.promptText.setText(q.prompt);
        this.updateRoundProgress(this.questionIndex + 1, this.questions.length);
        this.renderTap(q);
    }

    renderTap(question) {
        const y = this.scale.height * 0.6;
        const spacing = Math.min(220, this.scale.width * 0.22);
        const startX = this.scale.width / 2 - spacing * 1.5;
        question.options.forEach((opt, i) => {
            const x = startX + i * spacing;
            const card = this.add.image(x, y, "optionCard").setDisplaySize(185, 165).setInteractive({ useHandCursor: true });
            const txt = this.add.text(x, y, String(opt), {
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "25px",
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
            this.showHint(this.currentQuestion?.hint || "Solve slowly step by step.");
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

