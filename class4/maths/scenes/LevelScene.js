import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass4MathsLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass4MathsLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "numbers") return Array.from({ length: 8 }, () => { const n = Phaser.Math.Between(10000, 99998); return { prompt: `What comes after ${n}?`, answer: n + 1, options: s([n + 1, n + 2, n - 1, n + 3]), hint: "Add 1." }; });
        if (m === "place-value") return Array.from({ length: 8 }, () => { const n = Phaser.Math.Between(10000, 99999); const t = Number(String(n)[2]); return { prompt: `Thousands digit in ${n}?`, answer: Number(String(n)[1]), options: s([Number(String(n)[1]), t, Number(String(n)[3]), Number(String(n)[4])]), hint: "Second digit from left." }; });
        if (m === "add-sub") return Array.from({ length: 8 }, (_, i) => { const add = i % 2 === 0; let a = Phaser.Math.Between(1000, 9000), b = Phaser.Math.Between(200, 3000); if (!add && b > a) [a, b] = [b, a]; const ans = add ? a + b : a - b; return { prompt: `${a} ${add ? "+" : "-"} ${b} = ?`, answer: ans, options: s([ans, ans + 10, ans - 10, ans + 20]), hint: "Align place values." }; });
        if (m === "multiplication") return Array.from({ length: 8 }, () => { const a = Phaser.Math.Between(10, 99), b = Phaser.Math.Between(2, 9), ans = a * b; return { prompt: `${a} x ${b} = ?`, answer: ans, options: s([ans, ans + b, ans - b, ans + 10]), hint: "Use distributive method." }; });
        if (m === "division") return Array.from({ length: 8 }, () => { const b = Phaser.Math.Between(2, 12), ans = Phaser.Math.Between(10, 40), a = b * ans; return { prompt: `${a} ÷ ${b} = ?`, answer: ans, options: s([ans, ans + 1, ans - 1, ans + 2]), hint: "Check by multiplication." }; });
        if (m === "factors-multiples") return [[12, "Factors"], [18, "Factors"], [24, "Multiples"], [30, "Multiples"], [16, "Factors"], [20, "Multiples"]].map(([n, kind]) => ({ prompt: `${kind} question: Which is a factor of ${n}?`, answer: kind === "Factors" ? "2" : String(n * 2), options: kind === "Factors" ? ["2", "5", "7", "9"] : [String(n * 2), String(n + 3), String(n - 1), String(n + 7)], hint: "Factor divides exactly; multiple is n x k." }));
        if (m === "fractions") return [["2/4", "1/2"], ["3/6", "1/2"], ["4/8", "1/2"], ["2/3", "two thirds"], ["3/4", "three quarters"]].map(([f, a]) => ({ prompt: `Best match for ${f}`, answer: a, options: s([a, "one fourth", "double", "full"]), hint: a }));
        if (m === "decimals") return [["0.5", "half"], ["0.25", "quarter"], ["1.2", "one and two tenths"], ["2.5", "two and half"], ["0.75", "three quarters"]].map(([d, a]) => ({ prompt: `${d} means`, answer: a, options: s([a, "ten", "hundred", "whole"]), hint: a }));
        if (m === "geometry") return [["Acute angle", "< 90°"], ["Right angle", "90°"], ["Obtuse angle", "> 90°"], ["Triangle", "3 sides"], ["Quadrilateral", "4 sides"]].map(([x, a]) => ({ prompt: `${x} has`, answer: a, options: s([a, "2 sides", "180°", "circle"]), hint: a }));
        if (m === "measurement") return [["Length of road", "km"], ["Weight of child", "kg"], ["Milk quantity", "litre"], ["Length of pen", "cm"], ["Water tank", "litre"]].map(([q, a]) => ({ prompt: `${q} measured in`, answer: a, options: s([a, "hour", "rupee", "meter"]), hint: a }));
        if (m === "time-calendar") return [["How many days in leap year?", "366"], ["How many weeks in 28 days?", "4"], ["Quarter past 7", "7:15"], ["Half past 9", "9:30"], ["12 months = ?", "1 year"]].map(([q, a]) => ({ prompt: q, answer: a, options: s([a, "5", "10", "300"]), hint: a }));
        if (m === "money") return [[1250, 350, 1600], [999, 1, 1000], [450, 275, 725], [5000, 750, 5750], [200, 80, 280]].map(([a, b, ans]) => ({ prompt: `Rs ${a} + Rs ${b} = ?`, answer: `Rs ${ans}`, options: s([`Rs ${ans}`, `Rs ${ans + 20}`, `Rs ${ans - 20}`, `Rs ${ans + 50}`]), hint: "Add carefully." }));
        if (m === "word-problems") return [["A truck carries 250 boxes each day for 4 days. Total?", 1000], ["72 candies shared among 8 children. Each gets?", 9], ["450 birds, 175 flew away. Left?", 275], ["35 chairs in each row, 6 rows. Total?", 210], ["1200 books packed in 12 cartons. Each carton?", 100]].map(([q, a]) => ({ prompt: q, answer: a, options: s([a, a + 10, a - 10, a + 20]), hint: "Pick operation first." }));
        if (m === "data") return [["Graph: Red=12 Blue=9. Total?", 21], ["Chart: A=30 B=20. Difference?", 10], ["Bar: Jan=15 Feb=25. Total?", 40], ["Votes: X=18 Y=22. More votes by?", 4], ["Books: Class4=50 Class5=45. Total?", 95]].map(([q, a]) => ({ prompt: q, answer: a, options: s([a, a + 2, a - 2, a + 5]), hint: "Read chart values." }));
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
            const t = this.add.text(x, y, String(o), { fontFamily: "Trebuchet MS, Arial", fontSize: "24px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
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
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "Retry step by step."); this.wrongStreak = 0; }
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

