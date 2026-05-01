import BaseScene from "../../../../shared/BaseScene.js";
import { GameStorage } from "../../../../shared/GameStorage.js";
import { loadUI } from "../../../ui/uiLoader.js";

export default class Level6 extends BaseScene {
    constructor() {
        super("Level6");
    }

    preload() {
        const level = window.DIYAA_GAME_CONFIG?.level || 6;
        loadUI(this, level);
    }

    create() {
        this.createBase();

        this.score = 0;
        this.currentIndex = 0;
        this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        this.roundObjects = [];
        this.isLocked = false;
        this.recognition = null;
        this.totalRounds = 8;
        this.wrongStreak = 0;

        this.nextRound();
    }

    clearRound() {
        if (this.recognition) this.recognition.stop();
        this.roundObjects.forEach(o => o.destroy());
        this.roundObjects = [];
    }

    nextRound() {
        this.clearRound();
        this.isLocked = false;

        if (this.currentIndex >= this.totalRounds) {
            this.sounds.playLevelComplete();
            this.showCompletion();
            return;
        }
        this.updateRoundProgress(this.currentIndex + 1, this.totalRounds);

        const first = this.letters[this.currentIndex];
        const correct = this.letters[this.currentIndex + 1];
        const third = this.letters[this.currentIndex + 2];

        this.correctLetter = correct;

        // TITLE
        this.add.image(this.w / 2, this.h * 0.14, "panelBg")
            .setDisplaySize(Math.min(this.w * 0.5, 600), 90);

        this.add.text(this.w / 2, this.h * 0.14, "Speak the Missing Letter", {
            fontSize: "26px",
            color: "#333"
        }).setOrigin(0.5);

        // =========================
        // CARDS
        // =========================
        const centerY = this.h * 0.42;
        const spacing = 260;
        const cardW = 260;
        const cardH = 180;

        [first, "?", third].forEach((item, i) => {
            const x = this.w / 2 + (i - 1) * spacing;

            const card = this.add.image(x, centerY, "optionCard")
                .setDisplaySize(cardW, cardH);

            if (item === "?") {
                this.add.text(x, centerY, "?", {
                    fontSize: "70px",
                    color: "#ff69b4"
                }).setOrigin(0.5);
            } else {
                const img = this.add.image(x, centerY, item);

                const scale = Math.min(
                    (cardW * 0.30) / img.width,
                    (cardH * 0.50) / img.height
                );

                img.setScale(scale);
                img.y -= 20; // fix padding issue
            }
        });

        // =========================
        // SPEAK BUTTON
        // =========================
        const btnY = this.h * 0.72;

        const btn = this.add.image(this.w / 2, btnY, "playBtn")
            .setInteractive()
            .setDisplaySize(280, 100);

        this.add.text(this.w / 2, btnY, "🎤 SPEAK", {
            fontSize: "26px",
            fontStyle: "bold",
            color: "#fff"
        }).setOrigin(0.5);

        btn.on("pointerdown", () => {
            if (!this.isLocked) {
                this.sounds.playTap();
                this.startListening();
            }
        });
    }

    startListening() {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Use Chrome for voice feature");
            return;
        }

        if (this.recognition) {
            this.recognition.stop();
        }

        const recog = new SpeechRecognition();
        this.recognition = recog;

        recog.lang = "en-US";
        recog.interimResults = false;
        recog.maxAlternatives = 1;

        this.isLocked = true;

        console.log("🎤 Listening...");

        recog.onresult = (event) => {
            const transcript = event.results[0][0].transcript
                .trim()
                .toLowerCase();

            console.log("Heard:", transcript);

            const spokenLetter = this.normalizeSpeech(transcript);

            this.checkAnswer(spokenLetter);
        };

        recog.onerror = (e) => {
            console.log("Speech error:", e.error);
            this.isLocked = false;
        };

        recog.onend = () => {
            console.log("Recognition ended");

            // 🔥 CRITICAL FIX:
            // Allow user to click again ALWAYS
            this.isLocked = false;
        };

        try {
            recog.start();
        } catch (e) {
            console.log("Start error:", e);
            this.isLocked = false;
        }
    }

    // =========================
    // NORMALIZE SPEECH
    // =========================
    normalizeSpeech(word) {
        const map = {
            "a": "A", "ay": "A",
            "b": "B", "bee": "B",
            "c": "C", "see": "C",
            "d": "D", "dee": "D",
            "e": "E",
            "f": "F",
            "g": "G",
            "h": "H",
            "i": "I",
            "j": "J",
            "k": "K",
            "l": "L",
            "m": "M",
            "n": "N",
            "o": "O",
            "p": "P",
            "q": "Q",
            "r": "R",
            "s": "S",
            "t": "T",
            "u": "U",
            "v": "V",
            "w": "W",
            "x": "X",
            "y": "Y",
            "z": "Z"
        };

        return map[word] || word.charAt(0).toUpperCase();
    }

    // =========================
    // CHECK ANSWER
    // =========================
    checkAnswer(spoken) {
        if (spoken === this.correctLetter) {
            this.sounds.playCorrect(); // right.mp3
            this.showFloatingFeedback("+10", true);
            this.wrongStreak = 0;

            this.score += 10;
            this.updateScore(this.score);

            GameStorage.saveProgress("level6", {
                score: this.score
            });

            this.currentIndex++;

            this.time.delayedCall(800, () => this.nextRound());
        } else {
            this.sounds.playWrong(); // wrong.mp3
            this.showFloatingFeedback("Try again", false);
            this.wrongStreak += 1;
            if (this.wrongStreak >= 2) {
                this.showHint(`Hint: Missing letter is "${this.correctLetter}"`);
                this.wrongStreak = 0;
            }

            this.isLocked = false; // allow retry
        }
    }

    showCompletion() {
        this.notifyLevelCompleted({ score: this.score, status: "completed" });
        const panel = this.add.image(this.w / 2, this.h / 2, "panelBg")
            .setDisplaySize(500, 300);

        const text = this.add.text(this.w / 2, this.h / 2, "Voice Star!", {
            fontSize: "30px",
            color: "#000"
        }).setOrigin(0.5);

        const score = this.add.text(this.w / 2, this.h / 2 + 60, `Score: ${this.score}`, {
            fontSize: "24px",
            color: "#333"
        }).setOrigin(0.5);

        this.roundObjects.push(panel, text, score);
    }
}
