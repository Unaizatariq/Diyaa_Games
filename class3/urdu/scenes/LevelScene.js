import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass3UrduLevel } from "../data/levels.js";

const LETTERS = ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ر", "ز", "س", "ش"];
function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass3UrduLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "huroof") return Array.from({ length: 8 }, () => { const a = Phaser.Utils.Array.GetRandom(LETTERS); return { prompt: `درست حرف منتخب کریں: ${a}`, answer: a, options: s([a, ...s(LETTERS.filter(x => x !== a)).slice(0, 3)]), hint: a }; });
        if (m === "alfaaz") return [["کتاب", "ک"], ["درخت", "د"], ["مچھلی", "م"], ["سیب", "س"], ["چاند", "چ"]].map(([w, a]) => ({ prompt: `"${w}" کا پہلا حرف`, answer: a, options: s([a, ...s(LETTERS.filter(x => x !== a)).slice(0, 3)]), hint: a }));
        if (m === "jumlay") return this.sequence([["میں", "اسکول", "جاتا", "ہوں", "۔"], ["وہ", "کتاب", "پڑھتی", "ہے", "۔"], ["ہم", "پارک", "میں", "کھیلتے", "ہیں", "۔"]]);
        if (m === "ism") return this.classify("اسم", ["کتاب", "درخت", "شہر", "استاد"], ["دوڑنا", "تیز", "اور", "خوشی"]);
        if (m === "fail") return this.classify("فعل", ["پڑھنا", "لکھنا", "دوڑنا", "کھانا"], ["کتاب", "بڑا", "دوست", "سبز"]);
        if (m === "sifat") return this.classify("صفت", ["اچھا", "بڑا", "خوبصورت", "تیز"], ["کتاب", "پڑھنا", "دوست", "گھر"]);
        if (m === "mutazad") return [["اونچا", "نیچا"], ["گرم", "ٹھنڈا"], ["خوش", "اداس"], ["تیز", "آہستہ"], ["دن", "رات"]].map(([w, a]) => ({ prompt: `"${w}" کا متضاد لفظ`, answer: a, options: s([a, "کتاب", "شہر", "درخت"]), hint: a }));
        if (m === "jama" || m === "wahid-jama") return [["کتاب", "کتابیں"], ["لڑکا", "لڑکے"], ["درخت", "درخت"], ["چڑیا", "چڑیاں"], ["بچہ", "بچے"]].map(([w, a]) => ({ prompt: `"${w}" کی جمع`, answer: a, options: s([a, `${w}یں`, `${w}ات`, w]), hint: a }));
        if (m === "imla") return ["کتاب", "درخت", "مچھلی", "سیب", "چاند"].map(word => ({ prompt: `املا: "${word}" منتخب کریں`, answer: word, options: s([word, "دوست", "گھر", "شہر"]), hint: word, speak: word }));
        if (m === "khushkhati") return ["ا", "ب", "پ", "ت", "ج"].map(ch => ({ prompt: `خوشخطی: حرف "${ch}" پہچانیں`, answer: ch, options: s([ch, ...s(LETTERS.filter(x => x !== ch)).slice(0, 3)]), hint: ch }));
        if (m === "tasveer-kahani") return [["👦📘🏫", "ایک بچہ اسکول میں کتاب پڑھ رہا ہے۔"], ["🌧️☂️", "بارش ہو رہی ہے اور بچہ چھتری لیے ہے۔"], ["👨‍👩‍👧🏠", "ایک خاندان گھر کے سامنے کھڑا ہے۔"]].map(([pic, a]) => ({ prompt: `${pic} کے لیے درست جملہ`, answer: a, options: s([a, "درخت کتاب پڑھ رہا ہے۔", "گاڑی آسمان میں ہے۔", "کوئی نہیں ہے۔"]), hint: "تصویر کے مطابق جملہ چنیں۔" }));
        if (m === "mazmoon") return [["میرا اسکول", "میرا اسکول صاف اور خوبصورت ہے۔"], ["میرا دوست", "میرا دوست ایماندار اور مددگار ہے۔"], ["میرا پسندیدہ پھل", "میرا پسندیدہ پھل آم ہے کیونکہ یہ میٹھا ہے۔"]].map(([p, a]) => ({ prompt: `بہترین آغاز منتخب کریں: ${p}`, answer: a, options: s([a, `${p} اور کتاب درخت کھاتا ہے۔`, `${p} کیونکہ چاند میز کے نیچے۔`, `${p}...`]), hint: "معنی خیز جملہ منتخب کریں۔" }));
        return [];
    }
    classify(target, good, bad) {
        return s([...good, ...bad]).slice(0, 8).map(word => ({
            prompt: `"${word}" ${target} ہے؟`,
            answer: good.includes(word) ? "ہاں" : "نہیں",
            options: ["ہاں", "نہیں", "شاید", "پتہ نہیں"],
            hint: good.includes(word) ? `"${word}" ${target} ہے` : `"${word}" ${target} نہیں`
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
            const t = this.add.text(x, y, String(o), { fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: "42px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
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
            const label = this.add.text(x, y, tok, { fontFamily: "Noto Nastaliq Urdu, Arial", fontSize: "40px", color: "#0b132b" }).setOrigin(0.5);
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
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "دوبارہ غور کریں۔"); this.wrongStreak = 0; }
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

