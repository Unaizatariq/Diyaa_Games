import SoundManager from "./SoundManager.js";
import { emitFrontendEvent } from "./frontendIntegration.js";

export default class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    createResponsiveBackground(textureKey = "bgVideo", isVideo = true) {
        const w = this.scale.width;
        const h = this.scale.height;

        if (isVideo) {
            const bg = this.add.video(w / 2, h / 2, textureKey);
            bg.setLoop(true);
            bg.setMute(true);
            bg.play(true);
            bg.setDisplaySize(w, h);
            return bg;
        } else {
            const bg = this.add.image(w / 2, h / 2, textureKey);
            bg.setDisplaySize(w, h);
            return bg;
        }
    }
    getUIConfig() {
        const w = this.scale.width;
        const h = this.scale.height;

        return {
            panelWidth: Math.min(w * 0.5, 600),
            panelHeight: 90,

            cardWidth: Math.min(w * 0.18, 220),
            cardHeight: Math.min(h * 0.22, 220),

            spacing: Math.min(w * 0.22, 260),

            centerX: w / 2,
            centerY: h / 2
        };
    }

    createBase() {
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.createResponsiveBackground("bgVideo", true);

        this.sounds = new SoundManager(this);

        this.add.image(100, 50, "starIcon").setDisplaySize(34, 34);

        this.scoreText = this.add.text(160, 50, `Score: 0`, {
            fontSize: "22px",
            color: "#fff"
        }).setOrigin(0.5);

        this.progressText = this.add.text(this.w - 24, 26, "", {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "22px",
            color: "#ffffff",
            backgroundColor: "#00000088",
            padding: { x: 10, y: 4 }
        }).setOrigin(1, 0);

        this.notifyLevelLoaded();
    }

    updateScore(value) {
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${value}`);
        }
    }

    updateRoundProgress(current, total) {
        if (!this.progressText) return;
        this.progressText.setText(`Q ${current}/${total}`);
        emitFrontendEvent("level_progress", {
            gameId: window.DIYAA_GAME_CONFIG?.gameId || null,
            level: window.DIYAA_GAME_CONFIG?.level || null,
            current,
            total
        });
    }

    showFloatingFeedback(text, isCorrect = true) {
        const feedback = this.add.text(this.w / 2, this.h * 0.26, text, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "40px",
            fontStyle: "bold",
            color: isCorrect ? "#22c55e" : "#ef4444"
        }).setOrigin(0.5);

        this.tweens.add({
            targets: feedback,
            y: feedback.y - 24,
            alpha: 0,
            duration: 420,
            onComplete: () => feedback.destroy()
        });
        return feedback;
    }

    showHint(text) {
        const hint = this.add.text(this.w / 2, this.h * 0.22, text, {
            fontFamily: "Trebuchet MS, Arial",
            fontSize: "24px",
            color: "#fde68a",
            backgroundColor: "#111827cc",
            padding: { x: 14, y: 6 },
            align: "center"
        }).setOrigin(0.5);

        this.time.delayedCall(1200, () => hint.destroy());
        return hint;
    }

    notifyLevelLoaded(extra = {}) {
        emitFrontendEvent("level_loaded", {
            gameId: window.DIYAA_GAME_CONFIG?.gameId || null,
            level: window.DIYAA_GAME_CONFIG?.level || null,
            ...extra
        });
    }

    notifyLevelCompleted(extra = {}) {
        const score = typeof extra.score === "number" ? extra.score : 0;
        window.DIYAA_GAME_RESULT = {
            score,
            completed: true,
            level: window.DIYAA_GAME_CONFIG?.level || null
        };

        emitFrontendEvent("level_completed", {
            gameId: window.DIYAA_GAME_CONFIG?.gameId || null,
            level: window.DIYAA_GAME_CONFIG?.level || null,
            ...extra
        });
    }
}
