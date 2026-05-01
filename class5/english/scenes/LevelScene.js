import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass5EnglishLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass5EnglishLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "nouns") return this.classify("Noun", ["democracy", "adventure", "captain", "continent"], ["accelerate", "carefully", "blue", "and"]);
        if (m === "pronouns") return [["The players trained hard. ___ won the match.", "They"], ["Aisha forgot the keys. ___ looked worried.", "She"], ["My brother and I revised. ___ felt confident.", "We"], ["The machine stopped. ___ needs repair.", "It"]].map(([p, a]) => ({ prompt: p, answer: a, options: s([a, ...s(["He", "She", "We", "They", "It"].filter(x => x !== a)).slice(0, 3)]), hint: a }));
        if (m === "verbs") return this.classify("Verb", ["calculate", "investigate", "compose", "observe"], ["mountain", "gentle", "under", "because"]);
        if (m === "adjectives") return this.classify("Adjective", ["ancient", "fragile", "magnificent", "brilliant"], ["jump", "city", "quickly", "and"]);
        if (m === "adverbs") return this.classify("Adverb", ["gracefully", "accurately", "silently", "hastily"], ["teacher", "big", "run", "before"]);
        if (m === "prepositions") return [["The trophy is ___ the shelf.", "on"], ["The files are ___ the folder.", "in"], ["The puppy hid ___ the sofa.", "under"], ["The clinic is ___ the bakery.", "near"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["in", "on", "under", "near"], hint: a }));
        if (m === "conjunctions") return [["I revised well, ___ I passed.", "so"], ["Take a ruler ___ a pencil.", "and"], ["He was tired ___ determined.", "but"], ["We stayed inside ___ it was stormy.", "because"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["and", "but", "so", "because"], hint: a }));
        if (m === "articles") return [["___ honest leader", "an"], ["___ Nile River", "the"], ["___ university student", "a"], ["___ eagle", "an"]].map(([p, a]) => ({ prompt: `Choose article: ${p}`, answer: a, options: ["a", "an", "the", "none"], hint: a }));
        if (m === "tenses") return [["She ___ science every day.", "studies"], ["Last year we ___ Karachi.", "visited"], ["They ___ travel next month.", "will"], ["I am ___ my project now.", "finishing"]].map(([p, a]) => ({ prompt: p, answer: a, options: s([a, "study", "studied", "visits"]), hint: a }));
        if (m === "subject-predicate") return [["The skilled carpenter / repaired the table quickly.", "The skilled carpenter"], ["Our class monitor / organized the notebooks.", "Our class monitor"], ["The migrating birds / crossed the valley.", "The migrating birds"], ["My cousins / planned a picnic.", "My cousins"]].map(([pair, a]) => ({ prompt: `Select subject: ${pair}`, answer: a, options: s([a, "repaired the table quickly.", "organized the notebooks.", "planned a picnic."]), hint: "Subject performs the action." }));
        if (m === "sentence") return this.sequence([["The", "students", "completed", "their", "assignment", "on", "time", "."], ["My", "uncle", "drives", "carefully", "on", "busy", "roads", "."], ["We", "discussed", "the", "project", "during", "class", "."]]);
        if (m === "syn-ant") return [["rapid", "fast"], ["ancient", "old"], ["difficult", "hard"], ["victory", "defeat"], ["expand", "increase"]].map(([w, a]) => ({ prompt: `Best related word for "${w}"`, answer: a, options: s([a, "chair", "yellow", "table"]), hint: a }));
        if (m === "comprehension") {
            const p = "Hassan joined the science fair with his model of a water filter. He used sand, gravel, and cotton. His model cleaned muddy water effectively.";
            return [
                { q: `${p}\nWhat did Hassan build?`, a: "water filter", o: ["water filter", "kite", "bridge", "robot"] },
                { q: `${p}\nWhich materials were used?`, a: "sand, gravel, and cotton", o: ["sand, gravel, and cotton", "wood and nails", "paper only", "plastic only"] },
                { q: `${p}\nWhat kind of water did it clean?`, a: "muddy water", o: ["muddy water", "salt water", "milk", "oil"] },
                { q: `${p}\nWhere did he present it?`, a: "science fair", o: ["science fair", "library", "market", "playground"] }
            ].map(i => ({ prompt: i.q, answer: i.a, options: i.o, hint: "Use details from passage." }));
        }
        if (m === "paragraph") return [["My Role Model", "My role model is my mother because she works hard and stays kind."], ["Importance of Reading", "Reading improves vocabulary and helps us think clearly."], ["A Memorable Day", "A memorable day in my life was when I won the school debate."]].map(([p, a]) => ({ prompt: `Choose best opening for paragraph: ${p}`, answer: a, options: s([a, `${p} and table fly quickly.`, `${p} because moon under carpet.`, `${p} ...`]), hint: "Pick meaningful sentence." }));
        if (m === "story") return [["The Lost Wallet", "A student found a wallet and returned it to the owner honestly."], ["The Helpful Neighbor", "A neighbor helped an old man carry groceries home."], ["The Rainy Match", "Despite rain, the team showed teamwork and completed the match."]].map(([t, a]) => ({ prompt: `Best story line for: ${t}`, answer: a, options: s([a, `${t} and car sleeps in water.`, `${t} because no words table.`, `${t} ...`]), hint: "Story should be clear and logical." }));
        return [];
    }
    classify(target, good, bad) {
        return s([...good, ...bad]).slice(0, 8).map(word => ({
            prompt: `Word "${word}" is a...`,
            answer: good.includes(word) ? target : "Other",
            options: [target, "Noun", "Verb", "Other"],
            hint: good.includes(word) ? `${word} is ${target}.` : `${word} is not ${target}.`
        }));
    }
    sequence(groups) { return groups.map(tokens => ({ kind: "sequence", prompt: "Arrange words to form sentence.", answer: tokens.join(" "), tokens: s(tokens), hint: tokens[0] })); }
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
        this.wrongStreak += 1; this.onWrongAnswer(); this.showFloatingFeedback("Try again", false);
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "Check and retry."); this.wrongStreak = 0; }
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
