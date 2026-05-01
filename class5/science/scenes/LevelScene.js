import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass5ScienceLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass5ScienceLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "classification") return [
            ["Bacteria belong to", "Monera", ["Monera", "Plantae", "Animalia", "Fungi"]],
            ["Mushroom belongs to", "Fungi", ["Protista", "Fungi", "Monera", "Plantae"]],
            ["Amoeba belongs to", "Protista", ["Animalia", "Protista", "Fungi", "Monera"]],
            ["Plants belong to", "Plantae", ["Plantae", "Animalia", "Fungi", "Monera"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "monocot-dicot") return [
            ["Monocot seed has", "one cotyledon", ["one cotyledon", "two cotyledons", "no cotyledon", "three cotyledons"]],
            ["Dicot leaves usually have", "net veins", ["parallel veins", "net veins", "no veins", "circle veins"]],
            ["Wheat is usually", "monocot", ["monocot", "dicot", "fungi", "protist"]],
            ["Bean is usually", "dicot", ["monocot", "dicot", "monera", "virus"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "microorganisms") return [
            ["Viruses need a", "host cell", ["host cell", "flower", "magnet", "lens"]],
            ["Curd is made using", "bacteria", ["fungi", "bacteria", "virus", "algae"]],
            ["Bread mold is a", "fungus", ["bacterium", "fungus", "virus", "plant"]],
            ["Useful bacteria help in", "digestion and decomposition", ["digestion and decomposition", "eclipses", "earthquakes", "magnet making"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "body-systems") return [
            ["Digestive system mainly", "breaks down food", ["breaks down food", "pumps blood", "takes in oxygen", "makes urine"]],
            ["Respiratory system exchanges", "oxygen and carbon dioxide", ["oxygen and carbon dioxide", "light and shadow", "heat and cold", "salt and sugar"]],
            ["Circulatory system includes", "heart and blood vessels", ["heart and blood vessels", "roots and stem", "lungs only", "bones only"]],
            ["Food pipe connects mouth to", "stomach", ["lungs", "stomach", "kidney", "heart"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "ecosystem") return [
            ["Green plants are", "producers", ["producers", "consumers", "decomposers", "predators only"]],
            ["Energy in food chains starts from", "sun", ["moon", "sun", "soil", "water bottle"]],
            ["Animals that eat plants are", "herbivores", ["carnivores", "omnivores", "herbivores", "decomposers"]],
            ["Fungi in ecosystem are", "decomposers", ["producers", "decomposers", "consumers", "predators"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "matter-changes") return [
            ["Melting ice is", "physical change", ["physical change", "chemical change", "nuclear change", "no change"]],
            ["Burning paper is", "chemical change", ["physical change", "chemical change", "state change only", "reversible change"]],
            ["Dissolving sugar in water is mostly", "physical change", ["chemical change", "physical change", "magnetic change", "electrical change"]],
            ["Rusting iron is", "chemical change", ["physical change", "chemical change", "shape change only", "temporary change"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "light") return [
            ["Light travels in", "straight lines", ["curves only", "straight lines", "zigzag always", "circles"]],
            ["Mirror reflection follows", "angle of incidence equals reflection", ["no rule", "angle of incidence equals reflection", "always 90 deg", "always 45 deg"]],
            ["Transparent material lets", "most light pass", ["no light pass", "most light pass", "some sound pass", "electricity only"]],
            ["Periscope uses", "reflection", ["refraction only", "reflection", "magnetism", "evaporation"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "sound") return [
            ["Sound is produced by", "vibrations", ["light rays", "vibrations", "magnets", "evaporation"]],
            ["Loud sound causes", "noise pollution", ["soil erosion", "noise pollution", "photosynthesis", "condensation"]],
            ["Sound needs a", "medium", ["vacuum", "medium", "sunlight", "battery"]],
            ["Human ear helps in", "hearing sound", ["seeing light", "hearing sound", "digesting food", "pumping blood"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "electricity") return [
            ["Rubbing balloon on hair shows", "static electricity", ["current electricity", "static electricity", "magnetism only", "gravity only"]],
            ["A simple circuit needs", "cell wire bulb", ["cell wire bulb", "soil water seed", "lens mirror", "magnet pin"]],
            ["Closed circuit means", "path complete", ["path broken", "path complete", "no battery", "no switch"]],
            ["Conductor allows", "electric current flow", ["no flow", "electric current flow", "light only", "sound only"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "magnetism") return [
            ["Magnets attract", "iron nickel cobalt", ["wood and plastic", "iron nickel cobalt", "paper only", "water only"]],
            ["Like poles", "repel", ["attract", "repel", "melt", "vibrate"]],
            ["Unlike poles", "attract", ["repel", "attract", "freeze", "evaporate"]],
            ["Magnetic compass points", "north-south", ["east-west", "north-south", "up-down", "random"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "earth-structure") return [
            ["Earth has three main layers", "crust mantle core", ["crust mantle core", "soil water air", "north south west", "rock sand clay"]],
            ["We live on the", "crust", ["mantle", "core", "crust", "inner core"]],
            ["Hottest layer is", "core", ["crust", "core", "mantle top", "ocean"]],
            ["Mountains are part of", "earth surface", ["earth surface", "inner core", "atmosphere only", "sun layer"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "soil") return [
            ["Sandy soil drains", "quickly", ["slowly", "quickly", "never", "backwards"]],
            ["Clay soil holds", "more water", ["less water", "more water", "no water", "only air"]],
            ["Humus is", "decayed organic matter", ["metal dust", "decayed organic matter", "plastic powder", "salt crystal"]],
            ["Soil helps plants by", "providing nutrients", ["blocking roots", "providing nutrients", "stopping sunlight", "removing water"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "earth-moon-sun") return [
            ["Earth rotates in about", "24 hours", ["12 hours", "24 hours", "7 days", "30 days"]],
            ["Earth revolution takes about", "365 days", ["30 days", "365 days", "24 hours", "12 months only"]],
            ["Moon revolves around", "Earth", ["Sun", "Mars", "Earth", "Jupiter"]],
            ["Day and night are caused by", "earth rotation", ["earth revolution", "earth rotation", "moon phases", "wind"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "satellites") return [
            ["Artificial satellites are used for", "communication weather navigation", ["communication weather navigation", "growing crops directly", "making magnets", "building roads"]],
            ["A satellite orbits", "a planet", ["a tree", "a planet", "a river", "a mountain"]],
            ["GPS commonly uses", "satellites", ["microscopes", "satellites", "fungi", "magnets"]],
            ["Weather forecasting improves using", "satellite data", ["soil color", "satellite data", "paper charts only", "no instruments"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "technology-impact") return [
            ["Technology in hospitals helps in", "diagnosis and treatment", ["diagnosis and treatment", "stopping oxygen", "reducing knowledge", "blocking communication"]],
            ["Positive technology use includes", "learning and productivity", ["learning and productivity", "spreading rumors", "wasting all time", "unsafe sharing"]],
            ["Too much screen time can", "affect health", ["always improve sleep", "affect health", "grow plants faster", "replace exercise"]],
            ["Best digital habit is", "balanced and responsible use", ["balanced and responsible use", "use all day without break", "share all passwords", "believe all online posts"]]
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
