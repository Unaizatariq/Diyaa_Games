import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass3MathsLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass3MathsLevel(window.DIYAA_GAME_CONFIG?.level || 1);
        super("LevelScene", meta.moduleId);
        this.meta = meta;
        this.profile = { rounds: 8, delay: 520, hintAfterWrong: 2 };
        this.questions = [];
        this.questionIndex = 0;
        this.roundItems = [];
        this.locked = false;
        this.wrongStreak = 0;
    }
    preload() { loadUI(this, window.DIYAA_GAME_CONFIG?.level || 1); }
    create() {
        super.create();
        this.promptPanel = this.add.image(this.scale.width / 2, this.scale.height * 0.14, "panelBg").setDisplaySize(Math.min(this.scale.width * 0.78, 950), 120);
        this.promptText = this.add.text(this.scale.width / 2, this.scale.height * 0.14, "", {
            fontFamily: "Trebuchet MS, Arial", fontSize: `${Math.max(22, this.scale.width * 0.017)}px`,
            color: "#1f2937", align: "center", wordWrap: { width: Math.min(this.scale.width * 0.7, 880) }
        }).setOrigin(0.5);
        this.questions = this.buildQuestions();
        this.renderQuestion();
    }
    buildQuestions() {
        const m = this.meta.mechanic;
        if (m === "numbers") return Array.from({ length: 8 }, () => { const n = Phaser.Math.Between(1000, 9998); return { prompt: `What comes after ${n}?`, answer: n + 1, options: s([n + 1, n + 2, n - 1, n + 3]), hint: "Add 1." }; });
        if (m === "place-value") return Array.from({ length: 8 }, () => { const n = Phaser.Math.Between(1000, 9999); const h = Number(String(n)[1]); return { prompt: `Hundreds digit in ${n}?`, answer: h, options: s([h, (h + 1) % 10, (h + 2) % 10, (h + 3) % 10]), hint: "Second digit from left." }; });
        if (m === "add-sub") return Array.from({ length: 8 }, (_, i) => { const add = i % 2 === 0; let a = Phaser.Math.Between(100, 999), b = Phaser.Math.Between(20, 300); if (!add && b > a) [a, b] = [b, a]; const ans = add ? a + b : a - b; return { prompt: `${a} ${add ? "+" : "-"} ${b} = ?`, answer: ans, options: s([ans, ans + 10, ans - 10, ans + 20]), hint: "Solve by place value." }; });
        if (m === "multiplication") return Array.from({ length: 8 }, () => { const a = Phaser.Math.Between(2, 12), b = Phaser.Math.Between(2, 12), ans = a * b; return { prompt: `${a} x ${b} = ?`, answer: ans, options: s([ans, ans + a, ans - a, ans + 2]), hint: "Repeated addition." }; });
        if (m === "division") return Array.from({ length: 8 }, () => { const b = Phaser.Math.Between(2, 12), ans = Phaser.Math.Between(2, 12), a = b * ans; return { prompt: `${a} ÷ ${b} = ?`, answer: ans, options: s([ans, ans + 1, ans - 1, ans + 2]), hint: "Think b x ? = a." }; });
        if (m === "fractions") return [["1/2", "half"], ["1/4", "quarter"], ["3/4", "three quarters"], ["2/3", "two thirds"], ["1/3", "one third"]].map(([f, a]) => ({ prompt: `${f} is read as`, answer: a, options: s([a, "double", "whole", "pair"]), hint: a }));
        if (m === "even-odd") return Array.from({ length: 8 }, () => { const n = Phaser.Math.Between(1, 500); const a = n % 2 === 0 ? "Even" : "Odd"; return { prompt: `${n} is`, answer: a, options: ["Even", "Odd", "Prime", "Square"], hint: "Check last digit." }; });
        if (m === "geometry") return [["Triangle", "3 sides"], ["Square", "4 equal sides"], ["Rectangle", "4 sides"], ["Circle", "No sides"], ["Pentagon", "5 sides"]].map(([shape, prop]) => ({ prompt: `${shape} has...`, answer: prop, options: s([prop, "2 sides", "8 sides", "10 sides"]), hint: prop }));
        if (m === "measurement") return [["Pencil length", "cm"], ["Bag weight", "kg"], ["Water bottle", "litre"], ["Road distance", "km"], ["Milk", "litre"]].map(([item, unit]) => ({ prompt: `${item} measured in`, answer: unit, options: s([unit, "hour", "rupee", "meter"]), hint: unit }));
        if (m === "time-calendar") return [["How many days in a week?", "7"], ["How many months in a year?", "12"], ["Half past 4 means", "4:30"], ["Quarter past 3 means", "3:15"], ["Leap year has days", "366"]].map(([q, a]) => ({ prompt: q, answer: a, options: s([a, "5", "10", "300"]), hint: a }));
        if (m === "money") return [[250, 125, 375], [90, 60, 150], [500, 275, 775], [300, 125, 425], [45, 55, 100]].map(([a, b, ans]) => ({ prompt: `Rs ${a} + Rs ${b} = ?`, answer: `Rs ${ans}`, options: s([`Rs ${ans}`, `Rs ${ans + 10}`, `Rs ${ans - 10}`, `Rs ${ans + 20}`]), hint: "Add rupees." }));
        if (m === "word-problems") return [["A shop sold 45 pens and 30 pencils. Total items?", 75], ["80 mangoes packed in 8 boxes. Each box?", 10], ["120 students in 4 classes. Each class?", 30], ["70 birds, 25 flew away. Left?", 45], ["12 rows with 6 chairs each. Total chairs?", 72]].map(([q, a]) => ({ prompt: q, answer: a, options: s([a, a + 5, a - 5, a + 10]), hint: "Find the operation first." }));
        if (m === "patterns") return [[3, 6, 9], [10, 20, 30], [5, 10, 15], [2, 4, 8], [1, 4, 7]].map(seed => { const d = seed[1] - seed[0]; const ans = seed[2] + d; return { prompt: `Pattern: ${seed[0]}, ${seed[1]}, ${seed[2]}, __`, answer: ans, options: s([ans, ans + d, ans - d, ans + 2]), hint: "Same step repeats." }; });
        if (m === "data") return [["Bar chart shows apples=8, bananas=5. Total?", 13], ["Cars sold Mon=3 Tue=4. Total?", 7], ["Class A=20 Class B=25. Difference?", 5], ["Blue votes=9 Red votes=6. More by?", 3], ["Books Jan=10 Feb=15. Total?", 25]].map(([q, a]) => ({ prompt: q, answer: a, options: s([a, a + 2, a - 2, a + 4]), hint: "Read values then calculate." }));
        return [];
    }
    clearRound() { this.roundItems.forEach(i => i.destroy()); this.roundItems = []; }
    renderQuestion() {
        this.clearRound(); this.locked = false;
        if (this.questionIndex >= this.questions.length) return this.showCompletion();
        const q = this.questions[this.questionIndex];
        this.currentQuestion = q;
        this.promptText.setText(q.prompt);
        this.updateRoundProgress(this.questionIndex + 1, this.questions.length);
        this.renderTap(q);
    }
    renderTap(q) {
        const y = this.scale.height * 0.6, sp = Math.min(220, this.scale.width * 0.22), sx = this.scale.width / 2 - sp * 1.5;
        q.options.forEach((o, i) => {
            const x = sx + i * sp;
            const c = this.add.image(x, y, "optionCard").setDisplaySize(185, 165).setInteractive({ useHandCursor: true });
            const t = this.add.text(x, y, String(o), { fontFamily: "Trebuchet MS, Arial", fontSize: "25px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
            c.on("pointerdown", () => { this.sounds.playTap(); this.resolve(o === q.answer); });
            this.roundItems.push(c, t);
        });
    }
    resolve(correct) {
        if (this.locked) return; this.locked = true;
        if (correct) {
            this.wrongStreak = 0; this.onCorrectAnswer(); this.showFloatingFeedback("+10", true); this.questionIndex += 1;
            return this.time.delayedCall(this.profile.delay, () => this.renderQuestion());
        }
        this.wrongStreak += 1; this.onWrongAnswer(); this.showFloatingFeedback("Try again", false);
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "Solve step by step."); this.wrongStreak = 0; }
        this.time.delayedCall(this.profile.delay, () => { this.locked = false; });
    }
    showCompletion() {
        const r = this.completeModule();
        this.notifyLevelCompleted({ score: this.session.score, stars: r.stars, status: "completed" });
        this.clearRound();
        this.promptText.setText(`${this.meta.title} Completed!`);
        const p = this.add.image(this.scale.width / 2, this.scale.height * 0.58, "panelBg").setDisplaySize(Math.min(this.scale.width * 0.66, 620), 320);
        const s1 = this.add.text(this.scale.width / 2, this.scale.height * 0.54, `Score: ${this.session.score}`, { fontFamily: "Trebuchet MS, Arial", fontSize: "38px", color: "#1f2937", fontStyle: "bold" }).setOrigin(0.5);
        const s2 = this.add.text(this.scale.width / 2, this.scale.height * 0.64, `Stars: ${r.stars}/3`, { fontFamily: "Trebuchet MS, Arial", fontSize: "30px", color: "#1f2937" }).setOrigin(0.5);
        this.roundItems.push(p, s1, s2);
    }
}

