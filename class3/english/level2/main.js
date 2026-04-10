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
        this.load.image("wood", "../assets/kids-bg.jpg");

        this.load.audio("correct", "../assets/correct.mp3");
        this.load.audio("wrong", "../assets/wrong.mp3");
    }

    create() {
        // ✅ CLEAN BACKGROUND (NO WHITE BOX ISSUE)
        this.cameras.main.setBackgroundColor("#f5e6cc");

        this.add.text(this.scale.width / 2, 150, "🎯 FIND THE NOUN", {
            fontSize: "60px",
            fontFamily: "Fredoka One",
            color: "#2e7d32"
        }).setOrigin(0.5);

        let btn = this.add.image(this.scale.width / 2, this.scale.height / 2, "startbtn")
            .setInteractive().setScale(0.6);

        btn.on("pointerdown", () => {
            this.scene.start("GameScene", { index: 0, score: 0, lives: 3 });
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
        // ✅ CLEAN BACKGROUND
        this.cameras.main.setBackgroundColor("#f5e6cc");

        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;

        // 🔥 SHADOW + WOOD PANEL
        this.add.image(centerX + 5, centerY + 5, "wood")
            .setTint(0x000000)
            .setAlpha(0.2)
            .setDisplaySize(800, 450);

        this.panel = this.add.image(centerX, centerY, "wood")
            .setDisplaySize(800, 450);

        // TITLE
        this.add.text(centerX, centerY - 200, "Find the Noun", {
            fontSize: "40px",
            fontFamily: "Fredoka One",
            color: "#2e7d32"
        }).setOrigin(0.5);

        // SCORE
        this.scoreText = this.add.text(40, 40, "⭐ " + this.score, {
            fontSize: "28px",
            fontFamily: "Fredoka One"
        });

        // LIVES
        this.hearts = [];
        for (let i = 0; i < this.lives; i++) {
            this.hearts.push(this.add.text(40 + i * 35, 80, "❤️", { fontSize: "28px" }));
        }

        this.loadSentence();
    }

    loadSentence() {
        let data = sentences[this.index];
        let words = data.sentence.split(" ");

        this.found = [];

        let cols = 4;
        let spacingX = 160;
        let spacingY = 100;

        let startX = this.scale.width / 2 - (cols / 2) * spacingX + spacingX / 2;

        words.forEach((word, i) => {
            let x = startX + (i % cols) * spacingX;
            let y = this.scale.height / 2 - 40 + Math.floor(i / cols) * spacingY;

            let btn = this.add.container(x, y);

            // 🔥 ROUNDED BUTTON
            let bg = this.add.graphics();
            bg.fillStyle(0xffffff, 1);
            bg.lineStyle(3, 0x999999);

            bg.fillRoundedRect(-70, -30, 140, 60, 25);
            bg.strokeRoundedRect(-70, -30, 140, 60, 25);

            let text = this.add.text(0, 0, word, {
                fontSize: "22px",
                fontFamily: "Fredoka One",
                color: "#000"
            }).setOrigin(0.5);

            btn.add([bg, text]);
            btn.setSize(140, 60);
            btn.setInteractive();

            // HOVER EFFECT
            btn.on("pointerover", () => btn.setScale(1.1));
            btn.on("pointerout", () => btn.setScale(1));

            btn.on("pointerdown", () => {
                this.handleClick(btn, word, data.nouns);
            });
        });
    }

    handleClick(btn, word, nouns) {
        let bg = btn.list[0];

        if (nouns.includes(word)) {
            this.sound.play("correct");

            bg.clear();
            bg.fillStyle(0x81c784, 1);
            bg.fillRoundedRect(-70, -30, 140, 60, 25);

            this.score += 10;
            this.scoreText.setText("⭐ " + this.score);

            this.found.push(word);

            if (this.found.length === nouns.length) {
                this.time.delayedCall(800, () => {
                    this.scene.restart({
                        index: this.index + 1,
                        score: this.score,
                        lives: this.lives
                    });
                });
            }

        } else {
            this.sound.play("wrong");

            bg.clear();
            bg.fillStyle(0xe57373, 1);
            bg.fillRoundedRect(-70, -30, 140, 60, 25);

            this.lives--;
            let heart = this.hearts.pop();
            if (heart) heart.destroy();

            if (this.lives <= 0) {
                this.scene.restart({ index: 0, score: 0, lives: 3 });
            }
        }
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