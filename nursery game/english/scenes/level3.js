import BaseScene from "../../../../shared/BaseScene.js";
import { GameStorage } from "../../../../shared/GameStorage.js";
import { loadUI } from "../../../ui/uiLoader.js";

export default class Level3 extends BaseScene {
    constructor() {
        super("Level3");
    }

    preload() {
        const level = window.DIYAA_GAME_CONFIG?.level || 3;
        loadUI(this, level);
    }

    create() {
        this.createBase();

        this.score = 0;
        this.currentIndex = 0;
        this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        this.roundObjects = [];
        this.isLocked = false;
        this.totalRounds = 8;
        this.wrongStreak = 0;

        this.nextRound();
    }

    clearRound() {
        this.roundObjects.forEach(o => o.destroy());
        this.roundObjects = [];
        this.dropZone = null;
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

        // =========================
        // 🔹 TITLE
        // =========================
        const titleY = this.h * 0.14;

        const panel = this.add.image(this.w / 2, titleY, "panelBg")
            .setDisplaySize(Math.min(this.w * 0.5, 600), 90);

        const title = this.add.text(this.w / 2, titleY, "Drag the Missing Letter", {
            fontSize: "26px",
            color: "#333"
        }).setOrigin(0.5);

        this.roundObjects.push(panel, title);

        // =========================
        // 🔥 SEQUENCE (TOP)
        // =========================
        const centerY = this.h * 0.42;
        const spacing = 220;
        const cardSize = 200;

        [first, "?", third].forEach((item, i) => {
            const x = this.w / 2 + (i - 1) * spacing;

            const card = this.add.image(x, centerY, "optionCard")
                .setDisplaySize(cardSize, cardSize);

            if (item === "?") {
                this.dropZone = this.add.zone(x, centerY, cardSize, cardSize)
                    .setRectangleDropZone(cardSize, cardSize);

                const q = this.add.text(x, centerY, "?", {
                    fontSize: "60px",
                    color: "#ff69b4"
                }).setOrigin(0.5);

                this.roundObjects.push(card, q, this.dropZone);
            } else {
                const img = this.add.image(x, centerY, item);

                const fitScale = Math.min(
                    (cardSize * 0.35) / img.width,
                    (cardSize * 0.35) / img.height
                );

                img.setScale(fitScale);

                this.roundObjects.push(card, img);
            }
        });

        // =========================
        // 🔹 OPTIONS (BOTTOM)
        // =========================
        let options = [correct];

        while (options.length < 4) {
            const r = Phaser.Utils.Array.GetRandom(this.letters);
            if (!options.includes(r)) options.push(r);
        }

        Phaser.Utils.Array.Shuffle(options);

        options.forEach((l, i) => {
            const x = (this.w / 5) * (i + 1);
            const y = this.h * 0.78;

            const cardSize = 200;

            const card = this.add.image(x, y, "optionCard")
                .setDisplaySize(cardSize, cardSize)
                .setInteractive({ draggable: true });

            const img = this.add.image(x, y, l);

            const fitScale = Math.min(
                (cardSize * 0.35) / img.width,
                (cardSize * 0.35) / img.height
            );

            img.setScale(fitScale);

            card.letter = l;
            card.startX = x;
            card.startY = y;
            card.img = img;

            this.input.setDraggable(card);

            card.on("drag", (p, dx, dy) => {
                if (this.isLocked) return;

                card.x = dx;
                card.y = dy;
                img.x = dx;
                img.y = dy;
            });

            card.on("dragend", () => {
                if (this.isLocked) return;
                this.sounds.playTap();

                const hit = Phaser.Geom.Intersects.RectangleToRectangle(
                    card.getBounds(),
                    this.dropZone.getBounds()
                );

                if (hit) {
                    this.checkAnswer(l, card, img);
                } else {
                    this.tweens.add({
                        targets: [card, img],
                        x: card.startX,
                        y: card.startY,
                        duration: 250
                    });
                }
            });

            this.roundObjects.push(card, img);
        });
    }

    checkAnswer(selected, card, img) {
        this.isLocked = true;

        if (selected === this.correctLetter) {
            this.sounds.playCorrect();
            this.showFloatingFeedback("+10", true);
            this.wrongStreak = 0;

            // snap to drop zone
            card.x = this.dropZone.x;
            card.y = this.dropZone.y;
            img.x = this.dropZone.x;
            img.y = this.dropZone.y;

            this.score += 10;
            this.updateScore(this.score);

            GameStorage.saveProgress("level3", {
                score: this.score
            });

            this.currentIndex++;

            this.time.delayedCall(700, () => this.nextRound());
        } else {
            this.sounds.playWrong();
            this.showFloatingFeedback("Try again", false);
            this.wrongStreak += 1;
            if (this.wrongStreak >= 2) {
                this.showHint("Hint: Place the middle letter in sequence.");
                this.wrongStreak = 0;
            }

            this.tweens.add({
                targets: [card, img],
                x: card.startX,
                y: card.startY,
                duration: 250,
                onComplete: () => this.isLocked = false
            });
        }
    }

    showCompletion() {
        this.notifyLevelCompleted({ score: this.score, status: "completed" });
        const panel = this.add.image(this.w / 2, this.h / 2, "panelBg")
            .setDisplaySize(500, 300);

        const text = this.add.text(this.w / 2, this.h / 2, "Level Complete!", {
            fontSize: "30px",
            color: "#000"
        }).setOrigin(0.5);

        this.roundObjects.push(panel, text);
    }
}
