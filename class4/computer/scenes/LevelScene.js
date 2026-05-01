import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass4ComputerLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass4ComputerLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "uses") return [
            ["Computers in schools help in", "learning and research", ["learning and research", "watering plants", "cooking food", "driving buses"]],
            ["In hospitals, computers are used for", "patient records and tests", ["patient records and tests", "making furniture", "flying planes", "digging soil"]],
            ["In banks, computers help with", "accounts and transactions", ["accounts and transactions", "plant growth", "sports training", "painting walls"]],
            ["Common use at home", "study and communication", ["study and communication", "making rain", "erasing roads", "lifting buildings"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "hardware") return [
            ["CPU is the", "brain of computer", ["brain of computer", "screen", "speaker", "paper tray"]],
            ["Monitor shows", "visual output", ["visual output", "typed input", "stored files", "internet speed"]],
            ["Keyboard is used to", "type text", ["type text", "print paper", "play sound only", "scan photos"]],
            ["Mouse helps to", "point and click", ["point and click", "store data", "run electricity", "record audio"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "input-devices") return [
            ["Keyboard is an", "input device", ["input device", "output device", "storage device", "software"]],
            ["Mouse is used for", "selecting items", ["selecting items", "printing pages", "playing sound only", "cooling CPU"]],
            ["Scanner converts", "paper to digital form", ["digital to paper", "paper to digital form", "sound to text", "video to chart"]],
            ["Input devices send data", "to computer", ["to computer", "from speaker", "to wall", "to notebook only"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "output-devices") return [
            ["Monitor is an", "output device", ["input device", "output device", "processing device", "storage device"]],
            ["Printer gives output on", "paper", ["screen", "paper", "keyboard", "mouse pad"]],
            ["Speakers produce", "sound output", ["text output", "sound output", "file storage", "drawing tools"]],
            ["Output devices present", "results from computer", ["results from computer", "commands to CPU", "internet cables", "electric current"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "windows-basics") return [
            ["Desktop is the", "main screen area", ["main screen area", "CPU memory", "type of printer", "file name"]],
            ["Taskbar usually shows", "open apps and shortcuts", ["open apps and shortcuts", "computer wires", "hard disk parts", "drawing effects"]],
            ["An icon is a", "small picture for app/file", ["small picture for app/file", "hardware chip", "sound wave", "keyboard line"]],
            ["Start menu helps to", "open programs and settings", ["open programs and settings", "scan documents", "draw tables", "charge battery"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "file-management") return [
            ["Save command stores", "your work", ["your work", "the monitor", "the keyboard", "the internet"]],
            ["Open command lets you", "access existing file", ["delete file", "access existing file", "format CPU", "create virus"]],
            ["Folder is used to", "organize files", ["organize files", "display sound", "move mouse", "print keyboard"]],
            ["Good file names are", "clear and meaningful", ["random symbols only", "clear and meaningful", "always blank", "very long nonsense"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "tux-paint") return [
            ["Stamp tool in Tux Paint adds", "ready pictures", ["ready pictures", "CPU power", "internet access", "folders"]],
            ["Brush tool is used for", "free drawing", ["free drawing", "file saving only", "audio recording", "printing only"]],
            ["Effects tool can", "change appearance", ["change appearance", "replace hardware", "install windows", "create cables"]],
            ["Undo button helps", "remove last action", ["remove last action", "close computer forever", "format disk", "turn monitor off"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "drawing-creativity") return [
            ["Digital drawing uses", "shapes colors tools", ["shapes colors tools", "only numbers", "hard disks only", "printers only"]],
            ["Creativity in drawing means", "making original ideas", ["copy exactly always", "making original ideas", "deleting all colors", "typing formulas"]],
            ["Layering objects helps", "better composition", ["better composition", "faster internet", "more RAM", "cooler CPU"]],
            ["Choosing matching colors improves", "visual design", ["visual design", "file size only", "keyboard speed", "battery life"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "kturtle") return [
            ["Command to move turtle forward", "forward", ["forward", "erase", "print", "save"]],
            ["Command to turn right", "right", ["right", "open", "copy", "paste"]],
            ["To draw square, you repeat", "forward and right turns", ["only right turns", "forward and right turns", "save and open", "mouse clicks"]],
            ["Kturtle teaches", "basic coding directions", ["basic coding directions", "banking", "medical tests", "hardware repair"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "programming-logic") return this.sequence([
            ["Start", "Think steps", "Write commands", "Test", "End"],
            ["Start", "Input number", "Add 5", "Show result", "End"],
            ["Start", "Open app", "Draw shape", "Save file", "End"]
        ]);
        return [];
    }
    sequence(groups) { return groups.map(tokens => ({ kind: "sequence", prompt: "Arrange the steps in correct order.", answer: tokens.join(" "), tokens: s(tokens), hint: "Start comes first." })); }
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
            const t = this.add.text(x, y, String(o), { fontFamily: "Trebuchet MS, Arial", fontSize: "20px", color: "#111827", align: "center", wordWrap: { width: 160 } }).setOrigin(0.5);
            c.on("pointerdown", () => { this.sounds.playTap(); this.resolve(o === q.answer); });
            this.roundItems.push(c, t);
        });
    }
    renderSequence(q) {
        const dy = this.scale.height * 0.46;
        const drop = this.add.rectangle(this.scale.width / 2, dy, Math.min(this.scale.width * 0.84, 1000), 100, 0x1d3557, 0.84).setStrokeStyle(3, 0xa8dadc);
        this.roundItems.push(drop);
        const placed = [], n = q.tokens.length, sx = this.scale.width / 2 - ((n - 1) * 128) / 2, y = this.scale.height * 0.78;
        q.tokens.forEach((tok, i) => {
            const x = sx + i * 128;
            const chip = this.add.rectangle(x, y, 122, 64, 0xf4a261, 0.95).setStrokeStyle(2, 0x0b132b).setInteractive({ draggable: true, useHandCursor: true });
            const label = this.add.text(x, y, tok, { fontFamily: "Trebuchet MS, Arial", fontSize: "16px", color: "#0b132b", align: "center", wordWrap: { width: 110 } }).setOrigin(0.5);
            chip.token = tok; this.input.setDraggable(chip);
            chip.on("drag", (p, dx, dy2) => { chip.x = dx; chip.y = dy2; label.x = dx; label.y = dy2; });
            chip.on("dragend", () => {
                this.sounds.playTap();
                const inside = Phaser.Geom.Rectangle.Contains(drop.getBounds(), chip.x, chip.y);
                if (!inside || placed.includes(chip)) return this.tweens.add({ targets: [chip, label], x, y, duration: 170 });
                placed.push(chip);
                const px = this.scale.width / 2 - ((n - 1) * 128) / 2 + (placed.length - 1) * 128;
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
