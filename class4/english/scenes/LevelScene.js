import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass4EnglishLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass4EnglishLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "nouns") return this.classify("Noun", ["river", "village", "doctor", "mountain"], ["run", "quickly", "green", "and"]);
        if (m === "pronouns") return [["Ayesha is absent. ___ is sick.", "She"], ["Bilal and I study. ___ study daily.", "We"], ["The dogs bark. ___ are noisy.", "They"], ["My pen is new. ___ is blue.", "It"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["He", "She", "We", "They"], hint: a }));
        if (m === "verbs") return this.classify("Verb", ["write", "build", "repair", "visit"], ["house", "gentle", "under", "because"]);
        if (m === "adjectives") return this.classify("Adjective", ["brave", "ancient", "smooth", "fragile"], ["jump", "city", "quickly", "and"]);
        if (m === "adverbs") return this.classify("Adverb", ["carefully", "loudly", "silently", "happily"], ["teacher", "big", "run", "before"]);
        if (m === "prepositions") return [["The map is ___ the wall.", "on"], ["The keys are ___ the drawer.", "in"], ["The kitten hid ___ the bed.", "under"], ["Our school is ___ the market.", "near"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["in", "on", "under", "near"], hint: a }));
        if (m === "conjunctions") return [["I was thirsty, ___ I drank water.", "so"], ["Bring tea ___ biscuits.", "and"], ["He is poor ___ honest.", "but"], ["I stayed home ___ it was raining.", "because"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["and", "but", "so", "because"], hint: a }));
        if (m === "articles") return [["___ honest man", "an"], ["___ moon", "the"], ["___ European city", "a"], ["___ elephant", "an"]].map(([p, a]) => ({ prompt: `Choose article: ${p}`, answer: a, options: ["a", "an", "the", "none"], hint: a }));
        if (m === "tenses") return [["She ___ to school every day.", "goes"], ["Yesterday we ___ a match.", "watched"], ["They ___ visit us tomorrow.", "will"], ["I am ___ a letter now.", "writing"]].map(([p, a]) => ({ prompt: p, answer: a, options: s([a, "go", "gone", "wrote"]), hint: a }));
        if (m === "subject-predicate") return [["The little boy / is flying a kite.", "The little boy"], ["Our teacher / explains grammar well.", "Our teacher"], ["The birds / are chirping loudly.", "The birds"], ["My brother / completed his homework.", "My brother"]].map(([pair, a]) => ({ prompt: `Select subject: ${pair}`, answer: a, options: s([a, "is flying a kite.", "explains grammar well.", "completed his homework."]), hint: "Subject tells who/what." }));
        if (m === "sentence") return this.sequence([["The", "students", "are", "solving", "math", "problems", "."], ["My", "mother", "cooks", "delicious", "food", "."], ["We", "visited", "the", "museum", "last", "week", "."]]);
        if (m === "syn-ant") return [["ancient", "old"], ["rapid", "fast"], ["difficult", "hard"], ["beautiful", "ugly"], ["victory", "win"]].map(([w, a]) => ({ prompt: `Closest meaning or opposite clue for "${w}"`, answer: a, options: s([a, "chair", "yellow", "table"]), hint: a }));
        if (m === "comprehension") {
            const p = "Nida planted a mango seed in her garden. She watered it every day. After many weeks, a small plant appeared.";
            return [
                { q: `${p}\nWhat did Nida plant?`, a: "mango seed", o: ["mango seed", "rose", "tree branch", "stone"] },
                { q: `${p}\nWhere did she plant it?`, a: "garden", o: ["garden", "school", "market", "field"] },
                { q: `${p}\nHow often did she water it?`, a: "every day", o: ["every day", "once a week", "never", "twice a month"] },
                { q: `${p}\nWhat appeared after weeks?`, a: "small plant", o: ["small plant", "big tree", "flower", "fruit"] }
            ].map(i => ({ prompt: i.q, answer: i.a, options: i.o, hint: "Read passage closely." }));
        }
        if (m === "paragraph") return [["My Favorite Season", "My favorite season is winter because the weather is cool and pleasant."], ["A Visit to Park", "Last Sunday I visited a park with my family and enjoyed swings."], ["My School", "My school is clean, disciplined, and full of friendly teachers."]].map(([p, a]) => ({ prompt: `Choose best opening for paragraph: ${p}`, answer: a, options: s([a, `${p} and table fly quickly.`, `${p} because moon under carpet.`, `${p} ...`]), hint: "Pick meaningful sentence." }));
        if (m === "story") return [["The Lost Pencil", "I lost my pencil in class but my friend helped me find it."], ["A Kind Boy", "A kind boy shared his lunch with a hungry child."], ["Rainy Day", "On a rainy day we stayed inside and read stories."]].map(([t, a]) => ({ prompt: `Best story line for: ${t}`, answer: a, options: s([a, `${t} and car sleeps in water.`, `${t} because no words table.`, `${t} ...`]), hint: "Story should have clear meaning." }));
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
            const t = this.add.text(x, y, String(o), { fontFamily: "Trebuchet MS, Arial", fontSize: "23px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
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
            const label = this.add.text(x, y, tok, { fontFamily: "Trebuchet MS, Arial", fontSize: "19px", color: "#0b132b" }).setOrigin(0.5);
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

