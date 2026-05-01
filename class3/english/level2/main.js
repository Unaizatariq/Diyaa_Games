// ================= DATA =================
const sentences = [
    { sentence: "The boy is playing in the park", nouns: ["boy", "park"] },
    { sentence: "The girl is reading a book", nouns: ["girl", "book"] },
    { sentence: "The dog is under the table", nouns: ["dog", "table"] },
    { sentence: "The teacher is in the school", nouns: ["teacher", "school"] }
];

// ================= START =================
class StartScene extends Phaser.Scene {
    constructor() { super({ key: "StartScene" }); }

    preload() {
        this.load.image("startbtn", "../assets/startbutton.png");
        this.load.image("start_bg", "../assets/game-bg.jpeg");
        this.load.image("game_bg", "../assets/gamebg.png");

        // Correctly point to the audio directory
        this.load.audio("correct", "../assets/audio/correct.mp3");
        this.load.audio("wrong", "../assets/audio/wrong.mp3");
    }

    create() {
        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;

        let bg = this.add.image(centerX, centerY, "start_bg");
        let scaleX = this.scale.width / bg.width;
        let scaleY = this.scale.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setAlpha(0.85);

        let overlay = this.add.graphics();
        overlay.fillStyle(0xffffff, 0.15);
        overlay.fillRect(0, 0, this.scale.width, this.scale.height);

        let title = this.add.text(centerX, 200, " fIND THE NOUN", {
            fontSize: "80px",
            fontFamily: "Fredoka One",
            color: "#ffeb3b",
            stroke: "#388e3c",
            strokeThickness: 10,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, stroke: true, fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: 220,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        });

        let btn = this.add.image(centerX, centerY + 120, "startbtn")
            .setInteractive({ useHandCursor: true }).setScale(0.7);

        this.tweens.add({
            targets: btn,
            scaleX: 0.75,
            scaleY: 0.75,
            duration: 800,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        });

        btn.on("pointerover", () => btn.setTint(0xdddddd));
        btn.on("pointerout", () => btn.clearTint());

        btn.on("pointerdown", () => {
            this.sound.play("correct");
            this.tweens.add({
                targets: btn,
                scaleX: 0.6,
                scaleY: 0.6,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.scene.start("GameScene", { index: 0, score: 0, lives: 3 });
                }
            });
        });
    }
}

// ================= GAME =================
class GameScene extends Phaser.Scene {
    constructor() { super({ key: "GameScene" }); }

    init(data) {
        this.index = data.index;
        this.score = data.score;
        this.lives = data.lives;
    }

    create() {
        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;

        let bg = this.add.image(centerX, centerY, "game_bg");
        let scaleX = this.scale.width / bg.width;
        let scaleY = this.scale.height / bg.height;
        bg.setScale(Math.max(scaleX, scaleY)).setAlpha(0.65);

        let g = this.add.graphics();
        g.fillStyle(0xffd700, 1);
        g.fillCircle(10, 10, 10);
        g.generateTexture('particle_star', 20, 20);
        g.destroy();

        // 🔥 GLASSMORPHISM PANEL
        let panelBg = this.add.graphics();
        panelBg.fillStyle(0xffffff, 0.9);
        panelBg.fillRoundedRect(centerX - 480, centerY - 280, 960, 560, 40);
        panelBg.lineStyle(6, 0x4caf50, 1);
        panelBg.strokeRoundedRect(centerX - 480, centerY - 280, 960, 560, 40);

        let panelInner = this.add.graphics();
        panelInner.fillStyle(0xf1f8e9, 0.6);
        panelInner.fillRoundedRect(centerX - 460, centerY - 260, 920, 520, 30);

        this.add.text(centerX, centerY - 200, "Find all the Nouns!", {
            fontSize: "50px",
            fontFamily: "Fredoka One",
            color: "#2e7d32",
            shadow: { offsetX: 3, offsetY: 3, color: '#e8f5e9', blur: 0, stroke: false, fill: true }
        }).setOrigin(0.5);

        let uiPanel = this.add.graphics();
        uiPanel.fillStyle(0x000000, 0.5);
        uiPanel.fillRoundedRect(30, 30, 280, 120, 25);

        this.scoreText = this.add.text(50, 45, "⭐ Score: " + this.score, {
            fontSize: "30px",
            fontFamily: "Fredoka One",
            color: "#ffeb3b",
            stroke: "#000",
            strokeThickness: 5
        });

        this.hearts = [];
        for (let i = 0; i < this.lives; i++) {
            let heart = this.add.text(50 + i * 45, 90, "❤️", { fontSize: "32px", shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 2 } });
            this.hearts.push(heart);
        }

        this.sentenceGroup = this.add.group();
        this.loadSentence();
    }

    loadSentence() {
        if (this.index >= sentences.length) {
            this.showWinScreen();
            return;
        }

        let data = sentences[this.index];
        let words = data.sentence.split(" ");
        this.found = [];

        let sentenceContainer = this.add.container(0, 0);
        this.sentenceGroup.add(sentenceContainer);

        let cols = Math.min(5, words.length);
        let spacingX = 180;
        let spacingY = 120;

        let startY = this.scale.height / 2 - 40;

        words.forEach((word, i) => {
            let row = Math.floor(i / cols);
            let col = i % cols;
            let wordsInThisRow = Math.min(words.length - row * cols, cols);
            let rowWidth = (wordsInThisRow - 1) * spacingX;
            let rowStartX = this.scale.width / 2 - rowWidth / 2;

            let x = rowStartX + col * spacingX;
            let y = startY + row * spacingY;

            let btn = this.add.container(x, y);

            let bg = this.add.graphics();
            this.drawButton(bg, 0xffffff, 0x4caf50);

            let text = this.add.text(0, 0, word, {
                fontSize: "28px",
                fontFamily: "Fredoka One",
                color: "#1b5e20"
            }).setOrigin(0.5);

            btn.add([bg, text]);
            btn.setSize(160, 80);
            btn.setInteractive({ useHandCursor: true });

            btn.setScale(0);
            this.tweens.add({
                targets: btn,
                scaleX: 1,
                scaleY: 1,
                duration: 500 + (i * 100),
                ease: 'Back.out'
            });

            btn.on("pointerover", () => {
                this.tweens.add({ targets: btn, scaleX: 1.1, scaleY: 1.1, duration: 150, ease: 'Sine.easeOut' });
            });
            btn.on("pointerout", () => {
                this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 150, ease: 'Sine.easeIn' });
            });

            btn.on("pointerdown", () => {
                btn.disableInteractive();
                this.handleClick(btn, word, data.nouns);
            });

            sentenceContainer.add(btn);
        });
    }

    drawButton(graphics, fillColor, strokeColor) {
        graphics.clear();
        graphics.fillStyle(fillColor, 1);
        graphics.fillRoundedRect(-80, -40, 160, 80, 25);
        graphics.lineStyle(5, strokeColor, 1);
        graphics.strokeRoundedRect(-80, -40, 160, 80, 25);
        graphics.fillStyle(0x000000, 0.1);
        graphics.fillRoundedRect(-80, 30, 160, 10, { tl: 0, tr: 0, bl: 25, br: 25 });
    }

    handleClick(btn, word, nouns) {
        let bg = btn.list[0];
        let text = btn.list[1];

        if (nouns.includes(word)) {
            this.sound.play("correct");

            this.drawButton(bg, 0x81c784, 0x2e7d32);
            text.setColor("#ffffff");

            this.tweens.add({
                targets: btn,
                scaleX: 1.25,
                scaleY: 1.25,
                duration: 200,
                yoyo: true,
                ease: 'Quad.easeInOut'
            });

            // Particles fireworks!
            let emitter = this.add.particles(0, 0, 'particle_star', {
                x: btn.x,
                y: btn.y,
                speed: { min: 100, max: 350 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                lifespan: 1200,
                gravityY: 300,
                quantity: 20,
                emitting: false
            });
            emitter.explode();

            this.score += 10;
            this.scoreText.setText("⭐ Score: " + this.score);

            this.tweens.add({
                targets: this.scoreText,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 150,
                yoyo: true
            });

            this.found.push(word);

            if (this.found.length === nouns.length) {
                this.time.delayedCall(1200, () => {
                    this.tweens.add({
                        targets: this.sentenceGroup.getChildren(),
                        x: -this.scale.width,
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2',
                        onComplete: () => {
                            this.scene.restart({
                                index: this.index + 1,
                                score: this.score,
                                lives: this.lives
                            });
                        }
                    });
                });
            }

        } else {
            this.sound.play("wrong");

            this.drawButton(bg, 0xe57373, 0xb71c1c);
            text.setColor("#ffffff");

            this.tweens.add({
                targets: btn,
                x: btn.x + 12,
                duration: 50,
                yoyo: true,
                repeat: 4,
                onComplete: () => {
                    btn.setInteractive();
                    this.drawButton(bg, 0xffffff, 0x4caf50);
                    text.setColor("#1b5e20");
                }
            });

            this.lives--;
            let heart = this.hearts.pop();

            if (heart) {
                this.tweens.add({
                    targets: heart,
                    scaleX: 1.8,
                    scaleY: 1.8,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => heart.destroy()
                });
            }

            if (this.lives <= 0) {
                this.time.delayedCall(600, () => {
                    this.showGameOver();
                });
            }
        }
    }

    createEndScreen(titleText, titleColor, btnText, btnColor, action) {
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, this.scale.width, this.scale.height);
        overlay.setAlpha(0);

        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: 500
        });

        let t = this.add.text(this.scale.width / 2, this.scale.height / 2 - 80, titleText, {
            fontSize: "90px",
            fontFamily: "Fredoka One",
            color: titleColor,
            stroke: "#fff",
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 10, color: '#000', blur: 10 }
        }).setOrigin(0.5).setScale(0);

        this.tweens.add({
            targets: t,
            scaleX: 1,
            scaleY: 1,
            duration: 800,
            ease: "Bounce.easeOut"
        });

        let btn = this.add.container(this.scale.width / 2, this.scale.height / 2 + 100);

        let btnBg = this.add.graphics();
        btnBg.fillStyle(btnColor, 1);
        btnBg.fillRoundedRect(-140, -45, 280, 90, 30);
        btnBg.lineStyle(6, 0xffffff, 1);
        btnBg.strokeRoundedRect(-140, -45, 280, 90, 30);

        let bText = this.add.text(0, 0, btnText, {
            fontSize: "40px",
            fontFamily: "Fredoka One",
            color: "#ffffff",
        }).setOrigin(0.5);

        btn.add([btnBg, bText]);
        btn.setSize(280, 90);
        btn.setInteractive({ useHandCursor: true });

        btn.setScale(0);
        this.tweens.add({
            targets: btn,
            scaleX: 1,
            scaleY: 1,
            delay: 500,
            duration: 500,
            ease: "Back.easeOut"
        });

        this.tweens.add({
            targets: btn,
            y: btn.y + 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        btn.on("pointerover", () => btnBg.setAlpha(0.8));
        btn.on("pointerout", () => btnBg.setAlpha(1));

        btn.on("pointerdown", action);
    }

    showGameOver() {
        this.createEndScreen(
            "GAME OVER", "#f44336",
            "🔄 Try Again", 0x2196f3,
            () => this.scene.restart({ index: 0, score: 0, lives: 3 })
        );
    }

    showWinScreen() {
        let emitter = this.add.particles(0, -50, 'particle_star', {
            x: { min: 0, max: this.scale.width },
            speedY: { min: 200, max: 500 },
            speedX: { min: -50, max: 50 },
            scale: { start: 1.5, end: 0 },
            lifespan: 3000,
            quantity: 2,
            blendMode: 'ADD'
        });

        this.createEndScreen(
            " YOU WIN! 🎉", "#4caf50",
            "🏠 Home", 0xff9800,
            () => this.scene.start("StartScene")
        );
    }
}

// ================= CONFIG =================
new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [StartScene, GameScene]
});