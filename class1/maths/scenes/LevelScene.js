import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass1MathsLevel } from "../data/levels.js";

function shuffle(items) {
    const clone = [...items];
    Phaser.Utils.Array.Shuffle(clone);
    return clone;
}

const numberWords = {
    71: "seventy one", 72: "seventy two", 73: "seventy three", 74: "seventy four", 75: "seventy five",
    76: "seventy six", 77: "seventy seven", 78: "seventy eight", 79: "seventy nine",
    80: "eighty", 81: "eighty one", 82: "eighty two", 83: "eighty three", 84: "eighty four",
    85: "eighty five", 86: "eighty six", 87: "eighty seven", 88: "eighty eight", 89: "eighty nine",
    90: "ninety", 91: "ninety one", 92: "ninety two", 93: "ninety three", 94: "ninety four",
    95: "ninety five", 96: "ninety six", 97: "ninety seven", 98: "ninety eight", 99: "ninety nine",
    100: "one hundred"
};

export default class LevelScene extends CurriculumScene {
    constructor() {
        const level = getClass1MathsLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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

    buildQuestions() {
        switch (this.levelMeta.mechanic) {
            case "table-oral-4":
                return this.buildTableQuestions(4);
            case "table-written-5":
                return this.buildTableQuestions(5);
            case "count-forward":
                return this.buildForwardQuestions();
            case "count-backward":
                return this.buildBackwardQuestions();
            case "number-spelling":
                return this.buildNumberSpellingQuestions();
            case "addition":
                return this.buildAdditionQuestions();
            case "subtraction":
                return this.buildSubtractionQuestions();
            case "time-read":
                return this.buildTimeQuestions();
            default:
                return [];
        }
    }

    buildTableQuestions(table) {
        return Array.from({ length: this.profile.rounds }, (_, index) => {
            const n = index + 2;
            const answer = table * n;
            const options = shuffle([answer, answer + table, Math.max(0, answer - table), answer + 2]);
            return {
                kind: "tap",
                prompt: `${table} x ${n} = ?`,
                answer,
                options,
                hint: `${table} added ${n} times gives ${answer}.`
            };
        });
    }

    buildForwardQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const start = Phaser.Math.Between(401, 496);
            const answer = start + 1;
            const options = shuffle([answer, answer + 1, answer - 1, answer + 2]);
            return {
                kind: "tap",
                prompt: `What comes after ${start}?`,
                answer,
                options,
                hint: "Forward counting increases by 1."
            };
        });
    }

    buildBackwardQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const start = Phaser.Math.Between(4, 100);
            const answer = start - 1;
            const options = shuffle([answer, answer - 1, answer + 1, answer + 2]);
            return {
                kind: "tap",
                prompt: `What comes before ${start}?`,
                answer,
                options,
                hint: "Backward counting decreases by 1."
            };
        });
    }

    buildNumberSpellingQuestions() {
        const numbers = shuffle(Object.keys(numberWords).map(Number).filter(num => num >= 71));
        return numbers.slice(0, this.profile.rounds).map(number => {
            const answer = numberWords[number];
            const distractors = shuffle(Object.values(numberWords)).filter(word => word !== answer).slice(0, 3);
            return {
                kind: "tap",
                prompt: `Choose correct spelling of ${number}`,
                answer,
                options: shuffle([answer, ...distractors]),
                hint: `Correct spelling starts with "${answer.split(" ")[0]}".`
            };
        });
    }

    buildAdditionQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const a = Phaser.Math.Between(10, 60);
            const b = Phaser.Math.Between(5, 40);
            const answer = a + b;
            return {
                kind: "tap",
                prompt: `${a} + ${b} = ?`,
                answer,
                options: shuffle([answer, answer + 2, answer - 2, answer + 4]),
                hint: `Add ones and tens carefully.`
            };
        });
    }

    buildSubtractionQuestions() {
        return Array.from({ length: this.profile.rounds }, () => {
            const a = Phaser.Math.Between(20, 90);
            const b = Phaser.Math.Between(5, 19);
            const answer = a - b;
            return {
                kind: "tap",
                prompt: `${a} - ${b} = ?`,
                answer,
                options: shuffle([answer, answer + 1, answer - 1, answer + 3]),
                hint: `Count backward from ${a}.`
            };
        });
    }

    buildTimeQuestions() {
        const pool = [
            ["09:00", "nine o'clock"], ["03:00", "three o'clock"], ["07:00", "seven o'clock"], ["12:00", "twelve o'clock"],
            ["04:30", "half past four"], ["08:30", "half past eight"], ["01:30", "half past one"], ["10:30", "half past ten"]
        ];
        return pool.slice(0, this.profile.rounds).map(([time, answer]) => ({
            kind: "tap",
            prompt: `Select the correct reading for ${time}`,
            answer,
            options: shuffle([
                answer,
                "quarter past five",
                "one o'clock",
                "half past two"
            ]),
            hint: time.endsWith(":00") ? "At :00 we say o'clock." : "At :30 we say half past."
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
        this.renderTap(question);
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
                fontFamily: "Trebuchet MS, Arial",
                fontSize: "26px",
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
            this.showHint(this.currentQuestion?.hint || "Try one step at a time.");
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

