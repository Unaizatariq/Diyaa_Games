import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass4UrduLevel } from "../data/levels.js";

const LETTERS = ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ر", "ز", "س", "ش"];
function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass4UrduLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
            fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: `${Math.max(26, this.scale.width * 0.02)}px`,
            color: "#1f2937", align: "center", wordWrap: { width: Math.min(this.scale.width * 0.7, 880) }
        }).setOrigin(0.5);
        this.questions = this.buildQuestions();
        this.renderQuestion();
    }
    buildQuestions() {
        const m = this.meta.mechanic;
        if (m === "alfaaz") return [["کتاب", "ک"], ["درخت", "د"], ["مکمل", "م"], ["دوست", "د"], ["کہانی", "ک"]].map(([w, a]) => ({ prompt: `"${w}" کا پہلا حرف`, answer: a, options: s([a, ...s(LETTERS.filter(x => x !== a)).slice(0, 3)]), hint: a }));
        if (m === "jumlay") return this.sequence([["میں", "روز", "سبق", "پڑھتا", "ہوں", "۔"], ["وہ", "وقت", "پر", "اسکول", "جاتی", "ہے", "۔"], ["ہم", "اپنے", "استاد", "کا", "احترام", "کرتے", "ہیں", "۔"]]);
        if (m === "ism") return this.classify("اسم", ["کتاب", "شہر", "استاد", "طالبعلم"], ["دوڑنا", "خوبصورت", "تیزی", "اور"]);
        if (m === "fail") return this.classify("فعل", ["لکھنا", "پڑھنا", "دوڑنا", "سیکھنا"], ["کتاب", "بچہ", "درخت", "خوش"]);
        if (m === "sifat") return this.classify("صفت", ["بہادر", "ذہین", "صاف", "خوبصورت"], ["لکھنا", "کتاب", "درخت", "اور"]);
        if (m === "zamir") return [["علی اسکول گیا۔ ___ وقت پر پہنچا۔", "وہ"], ["سارہ اور میں کھیلتے ہیں۔ ___ خوش ہیں۔", "ہم"], ["بچے پڑھ رہے ہیں۔ ___ خاموش ہیں۔", "وہ"], ["کتاب میز پر ہے۔ ___ نئی ہے۔", "یہ"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["وہ", "ہم", "یہ", "میں"], hint: a }));
        if (m === "jama-wahid") return [["بچہ", "بچے"], ["کتاب", "کتابیں"], ["لڑکی", "لڑکیاں"], ["کھلاڑی", "کھلاڑی"], ["استاد", "اساتذہ"]].map(([w, a]) => ({ prompt: `"${w}" کی جمع`, answer: a, options: s([a, `${w}وں`, `${w}ات`, w]), hint: a }));
        if (m === "mutazad") return [["اونچا", "نیچا"], ["گرم", "ٹھنڈا"], ["آسان", "مشکل"], ["خوش", "اداس"], ["نیا", "پرانا"]].map(([w, a]) => ({ prompt: `"${w}" کا متضاد لفظ`, answer: a, options: s([a, "کتاب", "شہر", "درخت"]), hint: a }));
        if (m === "imla") return ["تعلیم", "کتاب", "قلم", "استاد", "شاگرد"].map(word => ({ prompt: `املا: "${word}" منتخب کریں`, answer: word, options: s([word, "درخت", "گھر", "دوست"]), hint: word, speak: word }));
        if (m === "khushkhati") return ["ا", "ب", "پ", "ت", "ج", "د"].map(ch => ({ prompt: `خوشخطی: حرف "${ch}" پہچانیں`, answer: ch, options: s([ch, ...s(LETTERS.filter(x => x !== ch)).slice(0, 3)]), hint: ch }));
        if (m === "mazmoon") return [["میرا وطن", "میرا وطن خوبصورت ہے اور ہم اس سے محبت کرتے ہیں۔"], ["میرا اسکول", "میرا اسکول نظم و ضبط اور تعلیم کا مرکز ہے۔"], ["صفائی کی اہمیت", "صفائی سے صحت بہتر رہتی ہے اور ماحول خوشگوار ہوتا ہے۔"]].map(([t, a]) => ({ prompt: `بہترین جملہ منتخب کریں: ${t}`, answer: a, options: s([a, `${t} اور میز دوڑتی ہے۔`, `${t} کیونکہ چاند کتاب کھاتا ہے۔`, `${t} ...`]), hint: "معنی خیز اور درست جملہ چنیں۔" }));
        if (m === "kahani") return [["ایک ایماندار لڑکا", "ایک لڑکے نے سڑک پر پڑا بٹوہ مالک کو واپس کیا۔"], ["بارش کا دن", "بارش کے دن بچوں نے گھر میں کہانیاں پڑھیں۔"], ["دو دوست", "دو دوست مشکل وقت میں ایک دوسرے کی مدد کرتے ہیں۔"]].map(([t, a]) => ({ prompt: `کہانی کا بہتر آغاز: ${t}`, answer: a, options: s([a, `${t} اور درخت گاڑی پڑھتی ہے۔`, `${t} کیونکہ لفظ بغیر معنی۔`, `${t} ...`]), hint: "کہانی واضح اور بامعنی ہو۔" }));
        return [];
    }
    classify(target, good, bad) {
        return s([...good, ...bad]).slice(0, 8).map(word => ({
            prompt: `"${word}" ${target} ہے؟`,
            answer: good.includes(word) ? "ہاں" : "نہیں",
            options: ["ہاں", "نہیں", "شاید", "پتہ نہیں"],
            hint: good.includes(word) ? `یہ ${target} ہے` : `یہ ${target} نہیں`
        }));
    }
    sequence(groups) {
        return groups.map(tokens => ({ kind: "sequence", prompt: "درست جملہ بنائیں", answer: tokens.join(" "), tokens: s(tokens), hint: tokens[0] }));
    }
    clearRound() { this.roundItems.forEach(i => i.destroy()); this.roundItems = []; }
    renderQuestion() {
        this.clearRound(); this.locked = false;
        if (this.questionIndex >= this.questions.length) return this.showCompletion();
        const q = this.questions[this.questionIndex];
        this.currentQuestion = q;
        this.promptText.setText(q.prompt);
        this.updateRoundProgress(this.questionIndex + 1, this.questions.length);
        if (q.speak && "speechSynthesis" in window) {
            const u = new SpeechSynthesisUtterance(q.speak); u.lang = "ur-PK"; speechSynthesis.cancel(); speechSynthesis.speak(u);
        }
        if (q.kind === "sequence") this.renderSequence(q); else this.renderTap(q);
    }
    renderTap(q) {
        const y = this.scale.height * 0.6, sp = Math.min(220, this.scale.width * 0.22), sx = this.scale.width / 2 - sp * 1.5;
        q.options.forEach((o, i) => {
            const x = sx + i * sp;
            const c = this.add.image(x, y, "optionCard").setDisplaySize(185, 165).setInteractive({ useHandCursor: true });
            const t = this.add.text(x, y, String(o), { fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: "40px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
            c.on("pointerdown", () => { this.sounds.playTap(); this.resolve(o === q.answer); });
            this.roundItems.push(c, t);
        });
    }
    renderSequence(q) {
        const dy = this.scale.height * 0.46;
        const drop = this.add.rectangle(this.scale.width / 2, dy, Math.min(this.scale.width * 0.84, 1000), 100, 0x1d3557, 0.84).setStrokeStyle(3, 0xa8dadc);
        this.roundItems.push(drop);
        const placed = [], n = q.tokens.length, sx = this.scale.width / 2 - ((n - 1) * 120) / 2, y = this.scale.height * 0.78;
        q.tokens.forEach((tok, i) => {
            const x = sx + i * 120;
            const chip = this.add.rectangle(x, y, 108, 64, 0xf4a261, 0.95).setStrokeStyle(2, 0x0b132b).setInteractive({ draggable: true, useHandCursor: true });
            const label = this.add.text(x, y, tok, { fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: "38px", color: "#0b132b" }).setOrigin(0.5);
            chip.token = tok; this.input.setDraggable(chip);
            chip.on("drag", (p, dx, dy2) => { chip.x = dx; chip.y = dy2; label.x = dx; label.y = dy2; });
            chip.on("dragend", () => {
                this.sounds.playTap();
                const inside = Phaser.Geom.Rectangle.Contains(drop.getBounds(), chip.x, chip.y);
                if (!inside || placed.includes(chip)) return this.tweens.add({ targets: [chip, label], x, y, duration: 170 });
                placed.push(chip);
                const px = this.scale.width / 2 - ((n - 1) * 120) / 2 + (placed.length - 1) * 120;
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
        this.wrongStreak += 1; this.onWrongAnswer(); this.showFloatingFeedback("دوبارہ", false);
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "غور سے دوبارہ کریں۔"); this.wrongStreak = 0; }
        this.time.delayedCall(this.profile.delay, () => { this.locked = false; });
    }
    showCompletion() {
        const r = this.completeModule();
        this.notifyLevelCompleted({ score: this.session.score, stars: r.stars, status: "completed" });
        this.clearRound();
        this.promptText.setText(`${this.meta.title} مکمل`);
        const p = this.add.image(this.scale.width / 2, this.scale.height * 0.58, "panelBg").setDisplaySize(Math.min(this.scale.width * 0.66, 620), 320);
        const s1 = this.add.text(this.scale.width / 2, this.scale.height * 0.54, `Score: ${this.session.score}`, { fontFamily: "Trebuchet MS, Arial", fontSize: "38px", color: "#1f2937", fontStyle: "bold" }).setOrigin(0.5);
        const s2 = this.add.text(this.scale.width / 2, this.scale.height * 0.64, `Stars: ${r.stars}/3`, { fontFamily: "Trebuchet MS, Arial", fontSize: "30px", color: "#1f2937" }).setOrigin(0.5);
        this.roundItems.push(p, s1, s2);
    }
}

