import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass5UrduLevel } from "../data/levels.js";

const LETTERS = ["alif", "bay", "pay", "tay", "ttay", "say", "jeem", "chay", "hay", "khay", "daal", "ray", "seen", "sheen"];
function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass5UrduLevel(window.DIYAA_GAME_CONFIG?.level || 1);
        super("LevelScene", meta.moduleId);
        this.meta = meta;
        this.profile = { rounds: 8, delay: 560, hintAfterWrong: 2 };
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
        if (m === "alfaaz") return [["kitab", "k"], ["darakht", "d"], ["mukammal", "m"], ["dost", "d"], ["kahani", "k"]].map(([w, a]) => ({ prompt: `Pehla harf: ${w}`, answer: a, options: s([a, ...s(["a", "b", "d", "k", "m", "s"].filter(x => x !== a)).slice(0, 3)]), hint: a }));
        if (m === "jumlay") return this.sequence([["main", "roz", "sabaq", "parhta", "hoon"], ["woh", "waqt", "par", "school", "jati", "hai"], ["hum", "apne", "ustad", "ka", "ehtram", "karte", "hain"]]);
        if (m === "ism") return this.classify("ism", ["kitab", "shahar", "ustad", "talib-e-ilm"], ["dorna", "khubsurat", "tezi", "aur"]);
        if (m === "fail") return this.classify("fail", ["likhna", "parhna", "dorna", "seekhna"], ["kitab", "bacha", "darakht", "khush"]);
        if (m === "sifat") return this.classify("sifat", ["bahadur", "zeheen", "saaf", "khubsurat"], ["likhna", "kitab", "darakht", "aur"]);
        if (m === "zamir") return [["Ali school gaya. ___ waqt par pohncha.", "woh"], ["Sara aur main khelte hain. ___ khush hain.", "hum"], ["Bachay parh rahe hain. ___ khamosh hain.", "woh"], ["Kitab mez par hai. ___ nayi hai.", "yeh"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["woh", "hum", "yeh", "main"], hint: a }));
        if (m === "jama-wahid") return [["bacha", "bachay"], ["kitab", "kitabein"], ["larki", "larkiyan"], ["khiladi", "khiladi"], ["ustad", "asatza"]].map(([w, a]) => ({ prompt: `${w} ki jama`, answer: a, options: s([a, `${w}on`, `${w}at`, w]), hint: a }));
        if (m === "mutazad") return [["ooncha", "neecha"], ["garm", "thanda"], ["asaan", "mushkil"], ["khush", "udas"], ["naya", "purana"]].map(([w, a]) => ({ prompt: `${w} ka mutazad`, answer: a, options: s([a, "kitab", "shahar", "darakht"]), hint: a }));
        if (m === "imla") return ["taleem", "kitab", "qalam", "ustad", "shagird"].map(word => ({ prompt: `Imla: ${word} select karein`, answer: word, options: s([word, "darakht", "ghar", "dost"]), hint: word }));
        if (m === "khushkhati") return ["alif", "bay", "pay", "tay", "jeem", "daal"].map(ch => ({ prompt: `Khushkhati harf pehchanain: ${ch}`, answer: ch, options: s([ch, ...s(LETTERS.filter(x => x !== ch)).slice(0, 3)]), hint: ch }));
        if (m === "mazmoon") return [["Mera Watan", "Mera watan khubsurat hai aur hum is se mohabbat karte hain."], ["Mera School", "Mera school nazm-o-zabt aur taleem ka markaz hai."], ["Safai ki Ahmiyat", "Safai se sehat behtar rehti hai aur mahol khushgawar hota hai."]].map(([t, a]) => ({ prompt: `Behtareen jumla chunain: ${t}`, answer: a, options: s([a, `${t} aur mez dor rahi hai.`, `${t} kyun ke chand kitab khata hai.`, `${t} ...`]), hint: "Maeni khaiz aur durust jumla chunain." }));
        if (m === "kahani") return [["Ek imandar larka", "Ek larkay ne sarak par para batwa malik ko wapas kiya."], ["Barish ka din", "Barish ke din bachon ne ghar mein kahaniyan parhein."], ["Do dost", "Do dost mushkil waqt mein aik dosray ki madad karte hain."]].map(([t, a]) => ({ prompt: `Kahani ka behtar aghaz: ${t}`, answer: a, options: s([a, `${t} aur darakht gari parhta hai.`, `${t} kyun ke alfaaz baghair maeni.`, `${t} ...`]), hint: "Kahani wazeh aur bamaeni ho." }));
        if (m === "tasveer-kahani") return [["Tasveer: bagh mein bachay safai kar rahe hain", "Bachay bagh mein safai kar ke mahol ko behtar bana rahe hain."], ["Tasveer: ek bachi buzurg aurat ko sadak paar karwa rahi hai", "Bachi ne buzurg aurat ki madad kar ke achi misaal pesh ki."], ["Tasveer: class mein team project chal raha hai", "Talaba mil jul kar project mukammal kar rahe hain."]].map(([p, a]) => ({ prompt: `Tasveer se kahani line chunain:\n${p}`, answer: a, options: s([a, "Tasveer mein sirf rang hain aur koi kaam nahi.", "Sab log udaas thay aur koi baat na hui.", "Aik jumla jo tasveer se mutabiq nahi."]), hint: "Jo manzar dikh raha hai us par mabni jumla chunain." }));
        return [];
    }
    classify(target, good, bad) {
        return s([...good, ...bad]).slice(0, 8).map(word => ({
            prompt: `${word} ${target} hai?`,
            answer: good.includes(word) ? "haan" : "nahin",
            options: ["haan", "nahin", "shayad", "pata nahin"],
            hint: good.includes(word) ? `Yeh ${target} hai` : `Yeh ${target} nahin`
        }));
    }
    sequence(groups) {
        return groups.map(tokens => ({ kind: "sequence", prompt: "Durust jumla banain", answer: tokens.join(" "), tokens: s(tokens), hint: tokens[0] }));
    }
    clearRound() { this.roundItems.forEach(i => i.destroy()); this.roundItems = []; }
    renderQuestion() {
        this.clearRound(); this.locked = false;
        if (this.questionIndex >= this.questions.length) return this.showCompletion();
        const q = this.questions[this.questionIndex];
        this.currentQuestion = q;
        this.promptText.setText(q.prompt);
        this.updateRoundProgress(this.questionIndex + 1, this.questions.length);
        if (q.kind === "sequence") this.renderSequence(q); else this.renderTap(q);
    }
    renderTap(q) {
        const y = this.scale.height * 0.6, sp = Math.min(220, this.scale.width * 0.22), sx = this.scale.width / 2 - sp * 1.5;
        q.options.forEach((o, i) => {
            const x = sx + i * sp;
            const c = this.add.image(x, y, "optionCard").setDisplaySize(185, 165).setInteractive({ useHandCursor: true });
            const t = this.add.text(x, y, String(o), { fontFamily: "Trebuchet MS, Arial", fontSize: "22px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
            c.on("pointerdown", () => { this.sounds.playTap(); this.resolve(o === q.answer); });
            this.roundItems.push(c, t);
        });
    }
    renderSequence(q) {
        const dy = this.scale.height * 0.46;
        const drop = this.add.rectangle(this.scale.width / 2, dy, Math.min(this.scale.width * 0.84, 1000), 100, 0x1d3557, 0.84).setStrokeStyle(3, 0xa8dadc);
        this.roundItems.push(drop);
        const placed = [], n = q.tokens.length, sx = this.scale.width / 2 - ((n - 1) * 112) / 2, y = this.scale.height * 0.78;
        q.tokens.forEach((tok, i) => {
            const x = sx + i * 112;
            const chip = this.add.rectangle(x, y, 108, 64, 0xf4a261, 0.95).setStrokeStyle(2, 0x0b132b).setInteractive({ draggable: true, useHandCursor: true });
            const label = this.add.text(x, y, tok, { fontFamily: "Trebuchet MS, Arial", fontSize: "18px", color: "#0b132b" }).setOrigin(0.5);
            chip.token = tok; this.input.setDraggable(chip);
            chip.on("drag", (p, dx, dy2) => { chip.x = dx; chip.y = dy2; label.x = dx; label.y = dy2; });
            chip.on("dragend", () => {
                this.sounds.playTap();
                const inside = Phaser.Geom.Rectangle.Contains(drop.getBounds(), chip.x, chip.y);
                if (!inside || placed.includes(chip)) return this.tweens.add({ targets: [chip, label], x, y, duration: 170 });
                placed.push(chip);
                const px = this.scale.width / 2 - ((n - 1) * 112) / 2 + (placed.length - 1) * 112;
                chip.x = px; chip.y = dy; label.x = px; label.y = dy;
                if (placed.length === n) this.resolve(placed.map(p2 => p2.token).join(" ") === q.answer);
            });
            this.roundItems.push(chip, label);
        });
    }
    resolve(correct) {
        if (this.locked) return; this.locked = true;
        if (correct) {
            this.wrongStreak = 0; this.onCorrectAnswer(); this.showFloatingFeedback("+10", true); this.questionIndex += 1;
            return this.time.delayedCall(this.profile.delay, () => this.renderQuestion());
        }
        this.wrongStreak += 1; this.onWrongAnswer(); this.showFloatingFeedback("Dobarah", false);
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "Ghor se dobarah karein."); this.wrongStreak = 0; }
        this.time.delayedCall(this.profile.delay, () => { this.locked = false; });
    }
    showCompletion() {
        const r = this.completeModule();
        this.notifyLevelCompleted({ score: this.session.score, stars: r.stars, status: "completed" });
        this.clearRound();
        this.promptText.setText(`${this.meta.title} Completed`);
        const p = this.add.image(this.scale.width / 2, this.scale.height * 0.58, "panelBg").setDisplaySize(Math.min(this.scale.width * 0.66, 620), 320);
        const s1 = this.add.text(this.scale.width / 2, this.scale.height * 0.54, `Score: ${this.session.score}`, { fontFamily: "Trebuchet MS, Arial", fontSize: "38px", color: "#1f2937", fontStyle: "bold" }).setOrigin(0.5);
        const s2 = this.add.text(this.scale.width / 2, this.scale.height * 0.64, `Stars: ${r.stars}/3`, { fontFamily: "Trebuchet MS, Arial", fontSize: "30px", color: "#1f2937" }).setOrigin(0.5);
        this.roundItems.push(p, s1, s2);
    }
}
