import BaseScene from "../../../../shared/BaseScene.js";
import { GameStorage } from "../../../../shared/GameStorage.js";
import { loadUI } from "../../../ui/uiLoader.js";

export default class Level5 extends BaseScene {
    constructor() {
        super("Level5");
    }

    preload() {
        const level = window.DIYAA_GAME_CONFIG?.level || 5;
        loadUI(this, level);
    }

    create() {
        this.createBase();

        this.score = 0;
        this.currentIndex = 0;
        this.roundObjects = [];
        this.isLocked = false;
        this.wrongStreak = 0;

        this.prompts = [
            { emoji: "🍎", word: "Apple", letter: "A" },
            { emoji: "🍌", word: "Banana", letter: "B" },
            { emoji: "🐱", word: "Cat", letter: "C" },
            { emoji: "🐶", word: "Dog", letter: "D" },
            { emoji: "🐘", word: "Elephant", letter: "E" },
            { emoji: "🐟", word: "Fish", letter: "F" },
            { emoji: "🦒", word: "Giraffe", letter: "G" },
            { emoji: "🏠", word: "House", letter: "H" }
        ];
        this.totalRounds = this.prompts.length;

        this.nextRound();
    }

    clearRound() {
        this.roundObjects.forEach(o => o.destroy());
        this.roundObjects = [];
    }

    nextRound() {
        this.clearRound();
        this.isLocked = false;

        if (this.currentIndex >= this.prompts.length) {
            this.sounds.playLevelComplete();
            this.showCompletion();
            return;
        }
        this.updateRoundProgress(this.currentIndex + 1, this.totalRounds);

        const current = this.prompts[this.currentIndex];

        // =========================
        // 🔹 TITLE
        // =========================
        const titleY = this.h * 0.14;

        const panel = this.add.image(this.w / 2, titleY, "panelBg")
            .setDisplaySize(Math.min(this.w * 0.5, 600), 90);

        const title = this.add.text(this.w / 2, titleY, "Find the First Letter", {
            fontSize: "26px",
            color: "#333"
        }).setOrigin(0.5);

        this.roundObjects.push(panel, title);

        // =========================
        // 🔥 MAIN CARD (IMAGE + WORD)
        // =========================
        const cardY = this.h * 0.40;
        const cardW = Math.min(this.w * 0.30, 320);
        const cardH = Math.min(this.h * 0.25, 220);

        const mainCard = this.add.image(this.w / 2, cardY, "optionCard")
            .setDisplaySize(cardW, cardH);

        // Emoji (big focus)
        const emoji = this.add.text(this.w / 2, cardY - 20, current.emoji, {
            fontSize: `${Math.max(70, this.w * 0.05)}px`
        }).setOrigin(0.5);

        // Word below
        const word = this.add.text(this.w / 2, cardY + cardH * 0.55, current.word, {
            fontSize: `${Math.max(28, this.w * 0.02)}px`,
            fontStyle: "bold",
            color: "#333"
        }).setOrigin(0.5);

        this.roundObjects.push(mainCard, emoji, word);

        // =========================
        // 🔹 OPTIONS
        // =========================
        let options = [current.letter];
        const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        while (options.length < 4) {
            const r = Phaser.Utils.Array.GetRandom(allLetters);
            if (!options.includes(r)) options.push(r);
        }

        Phaser.Utils.Array.Shuffle(options);

        const cardSize = this.w < 900 ? 170 : 210;

        const totalWidth = Math.min(this.w * 0.84, 1000);
        const spacing = totalWidth / 4;
        const startX = (this.w - totalWidth) / 2 + spacing / 2;
        const y = this.h * 0.78;

        options.forEach((l, i) => {
            const x = startX + i * spacing;

            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(cardSize, cardSize)
                .setInteractive({ useHandCursor: true });

            const img = this.add.image(x, y, l);

            const fitScale = Math.min(
                (cardSize * 0.35) / img.width,
                (cardSize * 0.35) / img.height
            );

            img.setScale(fitScale);

            card.on("pointerdown", () => {
                if (!this.isLocked) {
                    this.sounds.playTap();
                    this.checkAnswer(l, current.letter);
                }
            });

            this.roundObjects.push(card, img);
        });
    }

    checkAnswer(selected, correct) {
        this.isLocked = true;

        if (selected === correct) {
            this.sounds.playCorrect();
            this.showFloatingFeedback("+10", true);
            this.wrongStreak = 0;

            this.score += 10;
            this.updateScore(this.score);

            GameStorage.saveProgress("level5", {
                score: this.score
            });

            this.currentIndex++;

            this.time.delayedCall(700, () => this.nextRound());
        } else {
            this.sounds.playWrong();
            this.showFloatingFeedback("Try again", false);
            this.wrongStreak += 1;
            if (this.wrongStreak >= 2) {
                this.showHint(`Hint: "${correct}" is the first letter.`);
                this.wrongStreak = 0;
            }

            this.time.delayedCall(500, () => {
                this.isLocked = false;
            });
        }
    }

    showCompletion() {
        this.notifyLevelCompleted({ score: this.score, status: "completed" });
        const panel = this.add.image(this.w / 2, this.h / 2, "panelBg")
            .setDisplaySize(500, 300);

        const text = this.add.text(this.w / 2, this.h / 2, "Word Master!", {
            fontSize: "30px",
            color: "#000"
        }).setOrigin(0.5);

        const score = this.add.text(this.w / 2, this.h / 2 + 60, `Score: ${this.score}`, {
            fontSize: "24px",
            color: "#333"
        }).setOrigin(0.5);
    }
}
