import BaseScene from "../../../../shared/BaseScene.js";
import { GameStorage } from "../../../../shared/GameStorage.js";
import { loadUI } from "../../../ui/uiLoader.js";

export default class Level2 extends BaseScene {
    constructor() {
        super("Level2");
    }

    preload() {
        const level = window.DIYAA_GAME_CONFIG?.level || 2;
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
        const titleY = this.h * 0.14;

        const titlePanel = this.add.image(this.w / 2, titleY, "panelBg");
        titlePanel.setDisplaySize(Math.min(this.w * 0.5, 600), 90);

        const title = this.add.text(this.w / 2, titleY, "Listen & Tap the Letter", {
            fontFamily: "Comic Sans MS, Arial",
            fontSize: `${Math.max(24, this.w * 0.02)}px`,
            fontStyle: "bold",
            color: "#333"
        }).setOrigin(0.5);

        this.roundObjects.push(titlePanel, title);

        // 🔊 PLAY BUTTON (FINAL POSITION + SIZE TUNED)
        const btnY = this.h * 0.48; // ⬅️ moved UP (was ~0.52)

        const playBtn = this.add.image(this.w / 2, btnY, "playBtn")
            .setInteractive({ useHandCursor: true });

        // ✅ Slightly smaller height
        playBtn.setDisplaySize(
            Math.min(this.w * 0.38, 420),   // width
            Math.min(this.h * 0.09, 70)     // height
        );

        // 🔤 TEXT
        const playText = this.add.text(this.w / 2, btnY, "PLAY SOUND", {
            fontFamily: "Comic Sans MS, Arial",
            fontSize: `${Math.max(24, this.w * 0.018)}px`,
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5);

        // DEPTH
        playBtn.setDepth(1);
        playText.setDepth(2);

        // 🖱️ INTERACTION
        playBtn.on("pointerover", () => playBtn.setScale(1.03));
        playBtn.on("pointerout", () => playBtn.setScale(1));
        playBtn.on("pointerdown", () => playBtn.setScale(0.97));
        playBtn.on("pointerup", () => {
            playBtn.setScale(1.03);
            this.sounds.playTap();
            this.sounds.playLetter(targetLetter);
        });
        // 🔁 Auto play once
        this.time.delayedCall(500, () => {
            this.sounds.playLetter(targetLetter);
        });

        this.roundObjects.push(playBtn, playText);

        // 🔹 OPTIONS
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
        const y = this.h * 0.78;

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

            GameStorage.saveProgress("level2", {
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
                this.showHint("Hint: Tap the letter you heard.");
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
