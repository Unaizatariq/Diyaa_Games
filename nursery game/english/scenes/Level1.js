import BaseScene from "../../../../shared/BaseScene.js";
import { GameStorage } from "../../../../shared/GameStorage.js";
import { loadUI } from "../../../ui/uiLoader.js";

export default class Level1 extends BaseScene {
    constructor() {
        super("Level1");
    }

    preload() {
        const level = window.DIYAA_GAME_CONFIG?.level || 1;
        loadUI(this, level);
    }

    create() {
        this.createBase();

        this.isSmall = this.scale.width < 900;

        this.score = 0;
        this.currentIndex = 0;
        this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        this.roundObjects = [];
        this.isLocked = false;
        this.totalRounds = 8;
        this.wrongStreak = 0;

        this.nextRound();

        this.scale.on("resize", () => this.scene.restart());
    }

    clearRound() {
        this.roundObjects.forEach(obj => obj.destroy());
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

        const targetLetter = this.letters[this.currentIndex];

        // 🔹 TITLE PANEL
        const titleY = this.h * 0.12;

        const titlePanel = this.add.image(this.w / 2, titleY, "panelBg");
        titlePanel.setDisplaySize(Math.min(this.w * 0.55, 650), 100);

        const title = this.add.text(this.w / 2, titleY, "Find This Letter", {
            fontFamily: "Comic Sans MS, Arial",
            fontSize: `${Math.max(26, this.w * 0.022)}px`,
            fontStyle: "bold",
            color: "#333"
        }).setOrigin(0.5);

        // 🔹 BIGGER TARGET CARD (FIXED)
        // 🔹 TARGET CARD (ONLY CARD BIGGER, NOT LETTER)
        const targetY = this.h * 0.42;

        const targetCard = this.add.image(this.w / 2, targetY, "optionCard");
        targetCard.setDisplaySize(
            Math.min(this.w * 0.55, 650),   // ⬅️ bigger card
            Math.min(this.h * 0.40, 420)
        );

        // ❗ DO NOT increase letter size
        const targetImg = this.add.image(this.w / 2, targetY, targetLetter);

        const targetScale = Math.min(
            (targetCard.displayWidth * 0.20) / targetImg.width,
            (targetCard.displayHeight * 0.32) / targetImg.height
        );

        targetImg.setScale(targetScale);

        this.roundObjects.push(titlePanel, title, targetCard, targetImg);

        // 🔹 OPTIONS (UNCHANGED STYLE)
        let options = [targetLetter];

        while (options.length < 4) {
            const rand = Phaser.Utils.Array.GetRandom(this.letters);
            if (!options.includes(rand)) options.push(rand);
        }

        Phaser.Utils.Array.Shuffle(options);

        const cardW = this.isSmall ? 180 : 230;
        const cardH = this.isSmall ? 180 : 230;

        const totalWidth = Math.min(this.w * 0.84, 1000);
        const spacing = totalWidth / 4;
        const startX = (this.w - totalWidth) / 2 + spacing / 2;
        const y = this.h * 0.82;

        options.forEach((letter, index) => {
            const x = startX + index * spacing;

            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(cardW, cardH)
                .setInteractive({ useHandCursor: true });

            const img = this.add.image(x, y, letter);

            const fit = Math.min(
                (cardW * 0.34) / img.width,
                (cardH * 0.34) / img.height
            );

            img.setScale(fit);

            card.on("pointerdown", () => {
                if (!this.isLocked) {
                    this.sounds.playTap();
                    this.checkAnswer(letter, targetLetter);
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

            GameStorage.saveProgress("level1", {
                score: this.score
            });

            this.currentIndex++;

            this.time.delayedCall(700, () => {
                this.nextRound();
            });

        } else {
            this.sounds.playWrong();
            this.showFloatingFeedback("Try again", false);
            this.wrongStreak += 1;
            if (this.wrongStreak >= 2) {
                this.showHint(`Hint: Look carefully at "${correct}"`);
                this.wrongStreak = 0;
            }

            this.time.delayedCall(500, () => {
                this.isLocked = false;
            });
        }
    }

    showCompletion() {
        this.notifyLevelCompleted({ score: this.score, status: "completed" });
        const panel = this.add.image(this.w / 2, this.h / 2, "panelBg");
        panel.setDisplaySize(
            Math.min(this.w * 0.55, 700),
            Math.min(this.h * 0.45, 400)
        );

        const text = this.add.text(this.w / 2, this.h / 2, "Level Complete!", {
            fontFamily: "Comic Sans MS, Arial",
            fontSize: `${Math.max(30, this.w * 0.028)}px`,
            fontStyle: "bold",
            color: "#222"
        }).setOrigin(0.5);

        this.roundObjects.push(panel, text);
    }
}
