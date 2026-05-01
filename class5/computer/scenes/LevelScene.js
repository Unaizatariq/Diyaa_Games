import CurriculumScene from "../../../shared/CurriculumScene.js";
import { loadUI } from "../../../ui/uiLoader.js";
import { getClass5ComputerLevel } from "../data/levels.js";

function s(list) { const c = [...list]; Phaser.Utils.Array.Shuffle(c); return c; }

export default class LevelScene extends CurriculumScene {
    constructor() {
        const meta = getClass5ComputerLevel(window.DIYAA_GAME_CONFIG?.level || 1);
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
        if (m === "hardware") return [
            ["Brain of computer is", "CPU", ["CPU", "RAM", "Mouse", "Speaker"]],
            ["Temporary memory is", "RAM", ["ROM", "Hard Disk", "RAM", "Monitor"]],
            ["Long term data stored in", "Storage", ["CPU", "Storage", "Keyboard", "Printer"]],
            ["SSD and HDD are", "Storage", ["Input devices", "Storage", "Output devices", "Software"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "io-devices") return [
            ["Keyboard is", "Input", ["Input", "Output", "Storage", "Software"]],
            ["Monitor is", "Output", ["Input", "Output", "CPU", "RAM"]],
            ["Microphone is", "Input", ["Input", "Output", "OS", "Folder"]],
            ["Printer is", "Output", ["Input", "Output", "Browser", "Chart"]],
            ["Scanner is", "Input", ["Input", "Output", "Algorithm", "Slide"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "software-types") return [
            ["Windows is", "System Software", ["System Software", "Application Software", "Hardware", "Input"]],
            ["MS Word is", "Application Software", ["System Software", "Application Software", "Storage", "Output"]],
            ["Antivirus usually works as", "Application Software", ["Input Device", "Application Software", "CPU", "Cable"]],
            ["Device drivers belong to", "System Software", ["System Software", "Output Device", "Algorithm", "Slide"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "os-basics") return [
            ["Taskbar is used to", "switch/open apps", ["switch/open apps", "type letters", "print only", "draw charts"]],
            ["Desktop icons are", "shortcuts to files/apps", ["shortcuts to files/apps", "viruses", "RAM chips", "internet cables"]],
            ["Recycle Bin stores", "deleted items temporarily", ["new files", "deleted items temporarily", "keyboard keys", "web pages"]],
            ["File Explorer helps", "manage files and folders", ["play music only", "manage files and folders", "change RAM", "create hardware"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "ms-word") return [
            ["Ctrl+B makes text", "Bold", ["Italic", "Bold", "Underline", "Copy"]],
            ["Header appears at", "top of page", ["bottom only", "top of page", "inside table only", "taskbar"]],
            ["Footer appears at", "bottom of page", ["top of page", "bottom of page", "desktop", "chart"]],
            ["Rows and columns form a", "Table", ["Slide", "Table", "Folder", "Formula"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "excel-formulas") return [
            ["SUM(A1:A5) does", "adds values", ["adds values", "finds biggest", "counts words", "draws shape"]],
            ["AVERAGE(A1:A5) gives", "mean value", ["total value", "mean value", "smallest value", "chart type"]],
            ["Cell address B3 means", "column B row 3", ["row B column 3", "column B row 3", "sheet 3", "formula 3"]],
            ["Data entry in Excel is done in", "cells", ["slides", "cells", "taskbar", "folders"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "excel-charts") return [
            ["Bar chart is best for", "comparing categories", ["comparing categories", "writing stories", "typing formula", "editing video"]],
            ["Pie chart shows", "parts of a whole", ["line thickness", "parts of a whole", "CPU speed", "keyboard layout"]],
            ["Chart title explains", "what data means", ["cell color", "what data means", "file size", "OS name"]],
            ["X-axis usually shows", "categories/time", ["keyboard keys", "categories/time", "CPU cores", "RAM size"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "powerpoint") return [
            ["PowerPoint is used for", "presentations", ["presentations", "virus scan", "storage format", "hardware repair"]],
            ["A presentation is made of", "slides", ["rows", "slides", "cells", "folders"]],
            ["SmartArt helps show", "organized ideas", ["organized ideas", "CPU temperature", "internet speed", "file deletion"]],
            ["Audio/video in slide is", "multimedia", ["hardware", "multimedia", "firmware", "formula"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "algorithm") return this.sequence([
            ["Start", "Take ingredients", "Mix", "Bake", "Serve"],
            ["Start", "Open notebook", "Write title", "Write answer", "End"],
            ["Start", "Wear shoes", "Tie laces", "Walk to class", "End"]
        ]);
        if (m === "conditional") return [
            ["If it rains, then", "carry an umbrella", ["carry an umbrella", "delete files", "close CPU", "format disk"]],
            ["If password is wrong, then", "access denied", ["access denied", "open all apps", "print chart", "save hardware"]],
            ["If battery is low, then", "charge device", ["charge device", "increase RAM", "add keyboard", "draw SmartArt"]],
            ["If file is important, then", "take backup", ["take backup", "delete it", "rename monitor", "remove OS"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: "Think cause and effect." }));
        if (m === "scratch") return [
            ["In Scratch, sprite means", "character/object", ["character/object", "RAM chip", "browser tab", "printer ink"]],
            ["Blocks are used to", "build program logic", ["build program logic", "clean hardware", "add storage", "draw table"]],
            ["Green flag usually", "starts project", ["deletes project", "starts project", "opens BIOS", "installs CPU"]],
            ["Motion block controls", "movement", ["movement", "sound card", "window border", "file format"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "animation-story") return [
            ["Animation in Scratch is made by", "changing costumes and motion", ["changing costumes and motion", "upgrading RAM", "closing taskbar", "installing CPU"]],
            ["Interactive story needs", "events and responses", ["events and responses", "hard disk repair", "new monitor", "OS reinstall"]],
            ["When key pressed block is an", "event trigger", ["event trigger", "storage tool", "hardware part", "table format"]],
            ["Speech bubble in sprite helps", "show dialogue", ["show dialogue", "draw chart", "create formula", "rename file"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "debugging") return [
            ["Debugging means", "finding and fixing errors", ["finding and fixing errors", "buying hardware", "creating virus", "removing keyboard"]],
            ["First debugging step is", "identify the problem", ["identify the problem", "delete all code", "format drive", "replace CPU"]],
            ["If output is wrong, check", "logic and values", ["logic and values", "screen color", "mouse pad", "speaker wire"]],
            ["Testing after fix is", "necessary", ["optional always", "necessary", "not useful", "hardware only"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "cyber-safety") return [
            ["Strong password should", "mix letters numbers symbols", ["mix letters numbers symbols", "be your name", "be 12345", "be same for all"]],
            ["Do not share", "personal information", ["personal information", "homework tips", "chart colors", "file names"]],
            ["Unknown link can be", "unsafe", ["always safe", "unsafe", "required", "faster internet"]],
            ["Cyber ethics means", "respectful and safe online behavior", ["respectful and safe online behavior", "breaking devices", "copying without credit", "spamming all users"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        if (m === "ai-responsibility") return [
            ["Responsible AI use means", "verify and use fairly", ["verify and use fairly", "copy blindly", "share fake info", "cheat always"]],
            ["Before sharing AI output", "fact-check it", ["fact-check it", "ignore sources", "hide mistakes", "delete evidence"]],
            ["Digital responsibility includes", "kindness and honesty online", ["kindness and honesty online", "harassment", "password sharing", "piracy"]],
            ["AI should help us", "learn and create ethically", ["learn and create ethically", "replace thinking", "spread rumors", "break rules"]]
        ].map(([p, a, o]) => ({ prompt: p, answer: a, options: s(o), hint: a }));
        return [];
    }
    sequence(groups) { return groups.map(tokens => ({ kind: "sequence", prompt: "Arrange the algorithm steps in order.", answer: tokens.join(" "), tokens: s(tokens), hint: "Start comes first." })); }
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
