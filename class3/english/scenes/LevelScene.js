import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass3EnglishLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass3EnglishLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "alphabet") return Array.from({ length: 8 }, () => {
            const a = Phaser.Utils.Array.GetRandom(LETTERS);
            return { prompt: `Pick letter ${a}`, answer: a, options: s([a, ...s(LETTERS.filter(x => x !== a)).slice(0, 3)]), hint: a };
        });
        if (m === "nouns") return this.classify("Noun", ["school", "teacher", "river", "city"], ["run", "quickly", "blue", "and"]);
        if (m === "pronouns") return [["Ali is kind. ___ is kind.", "He"], ["Sara reads. ___ reads.", "She"], ["The boys play. ___ play.", "They"], ["I and Mina work. ___ work.", "We"], ["The cat sleeps. ___ sleeps.", "It"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["He", "She", "They", "We", "It"].slice(0, 4), hint: a }));
        if (m === "verbs") return this.classify("Verb", ["run", "write", "jump", "speak"], ["book", "green", "slowly", "under"]);
        if (m === "adjectives") return this.classify("Adjective", ["bright", "heavy", "small", "tasty"], ["walk", "table", "and", "softly"]);
        if (m === "adverbs") return this.classify("Adverb", ["quickly", "slowly", "carefully", "happily"], ["chair", "run", "red", "because"]);
        if (m === "prepositions") return [["The cat is ___ the table.", "under"], ["The ball is ___ the box.", "in"], ["The bag is ___ the chair.", "on"], ["The school is ___ the park.", "near"]].map(([p, a]) => ({ prompt: p, answer: a, options: ["in", "on", "under", "near"], hint: a }));
        if (m === "conjunctions") return [["Ali and Sara ___ friends.", "are"], ["I was tired ___ I slept.", "so"], ["Tea ___ milk", "and"], ["Run fast ___ carefully", "but"]].map(([p, a]) => ({ prompt: `Choose conjunction in: ${p}`, answer: a === "and" || a === "so" || a === "but" ? a : "and", options: ["and", "but", "so", "because"], hint: "Look for joining word." }));
        if (m === "articles") return [["___ apple", "an"], ["___ sun", "the"], ["___ boy", "a"], ["___ umbrella", "an"]].map(([p, a]) => ({ prompt: `Choose article: ${p}`, answer: a, options: ["a", "an", "the", "none"], hint: a }));
        if (m === "plural") return [["child", "children"], ["city", "cities"], ["box", "boxes"], ["leaf", "leaves"], ["book", "books"]].map(([p, a]) => ({ prompt: `Plural of "${p}"`, answer: a, options: s([a, `${p}s`, `${p}es`, p]), hint: a }));
        if (m === "tenses") return [["Yesterday I ___ to school.", "went"], ["I ___ milk every day.", "drink"], ["She is ___ now.", "reading"], ["They ___ football yesterday.", "played"]].map(([p, a]) => ({ prompt: p, answer: a, options: s([a, "go", "going", "eats"]), hint: a }));
        if (m === "sentence") return this.sequence([
            ["The", "children", "are", "playing", "."],
            ["She", "reads", "a", "story", "."],
            ["My", "father", "drives", "a", "car", "."],
            ["We", "go", "to", "school", "."]
        ]);
        if (m === "comprehension") return this.comp();
        if (m === "creative") return [["My best day was", "My best day was when we visited the zoo."], ["A good friend is", "A good friend is kind and helpful."], ["I feel happy when", "I feel happy when I play with my family."], ["My school is", "My school is clean and beautiful."]].map(([p, a]) => ({ prompt: `Best continuation:\n${p} ...`, answer: a, options: s([a, `${p} and table eats fast.`, `${p} because moon is under chair.`, `${p} with no words.`]), hint: "Choose meaningful sentence." }));
        if (m === "syn-ant") return [["big", "large"], ["small", "tiny"], ["hot", "cold"], ["happy", "sad"], ["fast", "quick"]].map(([w, a]) => ({ prompt: `Best related word for "${w}"`, answer: a, options: s([a, "chair", "river", "yellow"]), hint: a }));
        return [];
    }
    classify(answer, good, bad) {
        return s([...good, ...bad]).slice(0, 8).map(word => ({
            prompt: `Word "${word}" is a...`,
            answer: good.includes(word) ? answer : answer === "Noun" ? "Other" : answer === "Verb" ? "Other" : answer === "Adjective" ? "Other" : "Other",
            options: answer === "Noun" ? ["Noun", "Verb", "Adjective", "Other"] : answer === "Verb" ? ["Verb", "Noun", "Adjective", "Other"] : answer === "Adjective" ? ["Adjective", "Verb", "Noun", "Other"] : ["Adverb", "Verb", "Noun", "Other"],
            hint: good.includes(word) ? `${word} is ${answer}.` : `${word} is not ${answer}.`
        }));
    }
    sequence(groups) {
        return groups.map(tokens => ({ kind: "sequence", prompt: "Arrange words to make sentence.", answer: tokens.join(" "), tokens: s(tokens), hint: tokens[0] }));
    }
    comp() {
        const p = "Zara has a green kite. She flies it on Sunday in the park.";
        return [
            { q: `${p}\nWho has a kite?`, a: "Zara", o: ["Zara", "Ali", "Teacher", "Park"] },
            { q: `${p}\nWhat color is the kite?`, a: "green", o: ["green", "red", "blue", "yellow"] },
            { q: `${p}\nWhen does she fly it?`, a: "Sunday", o: ["Sunday", "Monday", "Friday", "Night"] },
            { q: `${p}\nWhere does she fly it?`, a: "park", o: ["park", "home", "school", "market"] }
        ].map(x => ({ prompt: x.q, answer: x.a, options: x.o, hint: "Read passage carefully." }));
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
            const t = this.add.text(x, y, String(o), { fontFamily: "Trebuchet MS, Arial", fontSize: "24px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
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
            const label = this.add.text(x, y, tok, { fontFamily: "Trebuchet MS, Arial", fontSize: "20px", color: "#0b132b" }).setOrigin(0.5);
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
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "Retry carefully."); this.wrongStreak = 0; }
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

