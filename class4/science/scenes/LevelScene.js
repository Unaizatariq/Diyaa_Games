import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass4ScienceLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass4ScienceLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "life-processes") return [
            ["Living things need food for", "nutrition and energy", ["nutrition and energy", "stopping movement", "becoming metal", "making plastic"]],
            ["Growth means", "increase in size", ["decrease in size", "increase in size", "no change", "no movement ever"]],
            ["Movement in living things helps in", "survival", ["survival", "evaporation", "rusting", "melting"]],
            ["Plants show life process by", "growing and making food", ["growing and making food", "running", "printing", "coding only"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "animal-classification") return [
            ["Animals with backbone are", "vertebrates", ["vertebrates", "invertebrates", "producers", "decomposers"]],
            ["Earthworm is", "invertebrate", ["vertebrate", "invertebrate", "bird", "mammal"]],
            ["Fish belong to", "vertebrates", ["invertebrates", "vertebrates", "fungi", "plants"]],
            ["Insects are mostly", "invertebrates", ["vertebrates", "invertebrates", "amphibians", "mammals"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "body-organs") return [
            ["Heart mainly", "pumps blood", ["pumps blood", "digests food", "filters light", "stores bones"]],
            ["Lungs help in", "breathing", ["breathing", "chewing", "seeing", "hearing"]],
            ["Stomach helps in", "digesting food", ["digesting food", "pumping blood", "moving bones", "producing light"]],
            ["Organ system works when organs", "work together", ["work together", "work alone always", "stop functioning", "turn into bones"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "teeth") return [
            ["Incisors are used for", "cutting food", ["cutting food", "grinding food", "tearing only", "breathing"]],
            ["Canines are for", "tearing food", ["cutting food", "tearing food", "grinding food", "pumping blood"]],
            ["Molars help in", "grinding food", ["grinding food", "tearing food", "seeing", "hearing"]],
            ["Healthy teeth need", "brushing and hygiene", ["brushing and hygiene", "extra sugar", "no water", "no cleaning"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "states-of-matter") return [
            ["Solid has", "fixed shape", ["fixed shape", "no shape", "fills whole room", "always flowing"]],
            ["Liquid takes shape of", "container", ["container", "its own fixed form", "air only", "table"]],
            ["Gas has", "no fixed shape and volume", ["fixed volume only", "no fixed shape and volume", "fixed shape", "hard texture"]],
            ["Ice to water is", "melting", ["freezing", "melting", "evaporation", "condensation"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "properties-of-matter") return [
            ["Matter has", "mass and volume", ["mass and volume", "only color", "only taste", "no space"]],
            ["A rough surface is a", "physical property", ["chemical change", "physical property", "disease", "planet"]],
            ["Wood in water usually", "floats", ["sinks always", "floats", "melts", "evaporates"]],
            ["Iron is attracted by magnet due to", "magnetic property", ["sound property", "magnetic property", "taste property", "light property"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "forms-of-energy") return [
            ["Sun gives", "light and heat energy", ["light and heat energy", "sound only", "magnetic field only", "no energy"]],
            ["Battery in torch gives", "electrical energy", ["sound energy", "electrical energy", "chemical reaction only", "wind energy"]],
            ["Bell produces", "sound energy", ["light energy", "sound energy", "heat only", "nuclear energy"]],
            ["Energy can", "change from one form to another", ["never change", "change from one form to another", "be created from nothing", "disappear instantly"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "forces-machines") return [
            ["Force is a", "push or pull", ["push or pull", "type of food", "kind of light", "shape only"]],
            ["Lever is a", "simple machine", ["simple machine", "living thing", "state of matter", "nutrient"]],
            ["Pulley helps to", "lift loads easily", ["lift loads easily", "make food", "clean teeth", "produce rain"]],
            ["Friction acts when surfaces", "rub together", ["rub together", "stay far apart", "freeze", "evaporate"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "natural-resources") return [
            ["Water is a", "natural resource", ["natural resource", "machine", "software", "disease"]],
            ["Trees provide", "oxygen and wood", ["oxygen and wood", "plastic and steel", "internet and wifi", "only noise"]],
            ["Coal and petroleum are", "non-renewable resources", ["renewable resources", "non-renewable resources", "simple machines", "vitamins"]],
            ["Saving resources means", "using them wisely", ["wasting quickly", "using them wisely", "burning always", "throwing away"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "soil") return [
            ["Soil helps plants by", "providing nutrients", ["providing nutrients", "blocking roots", "stopping sunlight", "turning into gas"]],
            ["Topsoil contains", "humus", ["humus", "metal rods", "plastic", "only stones"]],
            ["Farmers need healthy soil for", "better crops", ["better crops", "less water always", "no seeds", "no sunlight"]],
            ["Erosion means", "wearing away of soil", ["soil creation", "wearing away of soil", "rainfall", "plant growth"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "solar-system") return [
            ["Center of our solar system is", "Sun", ["Moon", "Earth", "Sun", "Mars"]],
            ["Earth is a", "planet", ["star", "planet", "satellite", "comet"]],
            ["Moon is Earths", "natural satellite", ["planet", "natural satellite", "star", "asteroid"]],
            ["Planets move around", "Sun", ["Moon", "Sun", "Earth", "clouds"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "day-night") return [
            ["Day and night happen because Earth", "rotates on its axis", ["revolves around moon", "rotates on its axis", "stops moving", "changes shape"]],
            ["One full rotation takes about", "24 hours", ["12 hours", "24 hours", "7 days", "30 days"]],
            ["When your side faces Sun it is", "day", ["night", "day", "eclipse", "season"]],
            ["Opposite side from Sun has", "night", ["day", "night", "rain only", "no time"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "balanced-diet") return [
            ["Balanced diet includes", "all major nutrients", ["only sugar", "all major nutrients", "only fats", "only water"]],
            ["Proteins help in", "growth and repair", ["growth and repair", "only taste", "only color", "making noise"]],
            ["Vitamins and minerals help", "protect health", ["protect health", "break bones", "cause rust", "remove oxygen"]],
            ["Too much junk food can", "harm health", ["improve all health", "harm health", "replace exercise", "build muscles instantly"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "diseases-prevention") return [
            ["Communicable diseases spread from", "infected person/source", ["infected person/source", "sunlight only", "books", "rocks"]],
            ["Washing hands helps", "prevent infections", ["cause disease", "prevent infections", "remove bones", "stop growth"]],
            ["Vaccination helps", "protect against diseases", ["spread diseases", "protect against diseases", "replace food", "remove sleep"]],
            ["Covering mouth when coughing is", "good prevention habit", ["bad habit", "good prevention habit", "not needed", "only for sports"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
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
            const t = this.add.text(x, y, String(o), { fontFamily: "Trebuchet MS, Arial", fontSize: "20px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
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
        if (this.wrongStreak >= this.profile.hintAfterWrong) { this.showHint(this.currentQuestion?.hint || "Think and retry."); this.wrongStreak = 0; }
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
