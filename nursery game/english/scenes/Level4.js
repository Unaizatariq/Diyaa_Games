import BaseScene from "../../../../shared/BaseScene.js";
import { GameStorage } from "../../../../shared/GameStorage.js";
import { loadUI } from "../../../ui/uiLoader.js";

export default class Level4 extends BaseScene {
    constructor() {
        super("Level4");
    }

    preload() {
        const level = window.DIYAA_GAME_CONFIG?.level || 4;
        loadUI(this, level);
    }

    create() {
        this.createBase();

        this.score = 0;
        this.matches = 0;
        this.flipped = [];
        this.cards = [];
        this.wrongStreak = 0;
        this.totalPairs = 8;
        this.updateRoundProgress(0, this.totalPairs);

        this.createBoard();
    }

    createBoard() {
        // =========================
        // 🔹 TITLE
        // =========================
        const titleY = this.h * 0.12;

        const panel = this.add.image(this.w / 2, titleY, "panelBg")
            .setDisplaySize(Math.min(this.w * 0.5, 600), 90);

        const title = this.add.text(this.w / 2, titleY, "Match the Letters", {
            fontSize: "26px",
            color: "#333"
        }).setOrigin(0.5);

        // =========================
        // 🔥 GRID SETUP
        // =========================
        const letters = "ABCDEFGH".split("");
        const pool = [...letters, ...letters];

        Phaser.Utils.Array.Shuffle(pool);

        const cols = 4;
        const rows = 4;

        const cardSize = this.w < 900 ? 100 : 130;
        const gap = this.w < 900 ? 16 : 20;

        const totalWidth = cols * cardSize + (cols - 1) * gap;
        const totalHeight = rows * cardSize + (rows - 1) * gap;

        const startX = (this.w - totalWidth) / 2 + cardSize / 2;
        const startY = this.h * 0.25;

        // =========================
        // 🔹 CREATE CARDS
        // =========================
        pool.forEach((letter, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;

            const x = startX + col * (cardSize + gap);
            const y = startY + row * (cardSize + gap);

            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(cardSize, cardSize)
                .setInteractive({ useHandCursor: true });

            const img = this.add.image(x, y, letter);

            // ✅ PERFECT FIT
            const fitScale = Math.min(
                (cardSize * 0.35) / img.width,
                (cardSize * 0.35) / img.height
            );

            img.setScale(fitScale);
            img.setVisible(false);

            card.letter = letter;
            card.img = img;
            card.isFlipped = false;
            card.isMatched = false;

            card.on("pointerdown", () => this.flip(card));

            this.cards.push(card);
        });
    }

    flip(card) {
        if (
            card.isFlipped ||
            card.isMatched ||
            this.flipped.length >= 2
        ) return;

        card.isFlipped = true;
        card.img.setVisible(true);
        this.sounds.playTap();

        this.sounds.playLetter(card.letter);

        this.flipped.push(card);

        if (this.flipped.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const [a, b] = this.flipped;

        if (a.letter === b.letter) {
            this.sounds.playCorrect();
            this.showFloatingFeedback("+10", true);
            this.wrongStreak = 0;

            a.isMatched = true;
            b.isMatched = true;

            this.matches++;
            this.score += 10;
            this.updateScore(this.score);
            this.updateRoundProgress(this.matches, this.totalPairs);

            GameStorage.saveProgress("level4", {
                score: this.score
            });

            this.flipped = [];

            if (this.matches === this.totalPairs) {
                this.time.delayedCall(600, () => this.showCompletion());
            }

        } else {
            this.sounds.playWrong();
            this.showFloatingFeedback("Try again", false);
            this.wrongStreak += 1;
            if (this.wrongStreak >= 2) {
                this.showHint("Hint: Remember the last two flipped cards.");
                this.wrongStreak = 0;
            }

            this.time.delayedCall(700, () => {
                a.img.setVisible(false);
                b.img.setVisible(false);

                a.isFlipped = false;
                b.isFlipped = false;

                this.flipped = [];
            });
        }
    }

    showCompletion() {
        this.sounds.playLevelComplete();
        this.notifyLevelCompleted({ score: this.score, status: "completed" });

        const panel = this.add.image(this.w / 2, this.h / 2, "panelBg")
            .setDisplaySize(500, 300);

        const text = this.add.text(this.w / 2, this.h / 2, "Memory Master!", {
            fontSize: "30px",
            color: "#000"
        }).setOrigin(0.5);

        const score = this.add.text(this.w / 2, this.h / 2 + 60, `Score: ${this.score}`, {
            fontSize: "24px",
            color: "#333"
        }).setOrigin(0.5);
    }
}
