function setFullScreenBG(scene, key) {
    let bg = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, key);

    function resize(w, h) {
        let scale = Math.max(w / bg.width, h / bg.height);
        bg.setPosition(w / 2, h / 2);
        bg.setScale(scale);
    }

    resize(scene.scale.width, scene.scale.height);

    scene.scale.on("resize", (gameSize) => {
        resize(gameSize.width, gameSize.height);
    });

    bg.setDepth(-1);
}

// ================= START =================

class StartScene extends Phaser.Scene {
    constructor() { super("StartScene"); }

    preload() {
        this.load.image("start-bg", "assets/start-bg.png");
        this.load.image("bg", "assets/bg.jpg");
        this.load.image("startbutton", "assets/startbutton.png");
        this.load.image("restartbutton", "assets/restartbutton.png");
        this.load.image("nextbtn", "assets/next.png");

        this.load.audio("click", "assets/click.mp3");
        this.load.audio("correct", "assets/correct.mp3");
        this.load.audio("wrong", "assets/wrong.mp3");
    }

    create() {
        setFullScreenBG(this, "start-bg");

        let btn = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "startbutton"
        ).setScale(0.5).setInteractive();

        btn.on("pointerdown", () => {
            this.sound.play("click");
            this.scene.start("MathScene", {
                score: 0,
                lives: 3,
                mode: "addition",
                qIndex: 0
            });
        });

        btn.on("pointerover", () => btn.setScale(0.55));
        btn.on("pointerout", () => btn.setScale(0.5));
    }
}

// ================= MATH =================

class MathScene extends Phaser.Scene {
    constructor() { super("MathScene"); }

    init(data) {
        this.score = data.score ?? 0;
        this.lives = data.lives ?? 3;
        this.mode = data.mode ?? "addition";
        this.qIndex = data.qIndex ?? 0;
    }

    create() {
        setFullScreenBG(this, "bg");

        this.add.text(20, 20, "⭐ " + this.score, {
            fontSize: "30px",
            fontFamily: "Fredoka One",
            color: "#000"
        });

        // ❤️ Hearts
        this.hearts = [];
        for (let i = 0; i < this.lives; i++) {
            let h = this.add.text(20 + i * 40, 70, "❤️", {
                fontSize: "30px"
            });
            this.hearts.push(h);
        }

        this.generateQuestion();
    }

    generateQuestion() {
        if (this.qIndex >= 10) {
            if (this.mode === "addition") {
                this.scene.restart({
                    score: this.score,
                    lives: this.lives,
                    mode: "subtraction",
                    qIndex: 0
                });
                return;
            } else {
                this.scene.start("LevelCompleteScene", { score: this.score });
                return;
            }
        }

        let a = Phaser.Math.Between(1, 10);
        let b = Phaser.Math.Between(1, 10);

        if (this.mode === "subtraction" && b > a) [a, b] = [b, a];

        let answer = this.mode === "addition" ? a + b : a - b;
        let symbol = this.mode === "addition" ? "+" : "-";

        this.current = { a, b, answer };

        this.add.text(this.scale.width / 2, 140, `${a} ${symbol} ${b} = ?`, {
            fontSize: "60px",
            fontFamily: "Fredoka One",
            color: "#000"
        }).setOrigin(0.5);

        // 💡 Hint
        this.hintVisible = false;

        let hintBtn = this.add.text(this.scale.width / 2, 230, "💡 Hint", {
            fontSize: "26px",
            backgroundColor: "#ffd54f",
            padding: 10,
            fontFamily: "Fredoka One"
        }).setOrigin(0.5).setInteractive();

        hintBtn.on("pointerdown", () => {
            if (!this.hintVisible) {
                this.showHint();
                this.hintVisible = true;

                this.hideBtn = this.add.text(this.scale.width - 60, 230, "⬆️", {
                    fontSize: "28px"
                }).setInteractive();

                this.hideBtn.on("pointerdown", () => {
                    this.hintText.destroy();
                    this.hideBtn.destroy();
                    this.hintVisible = false;
                });
            }
        });

        // 🔘 OPTIONS (SHUFFLED)
        let options = new Set();
        options.add(answer);

        while (options.size < 4) {
            let val = answer + Phaser.Math.Between(-3, 3);
            if (val >= 0) options.add(val);
        }

        let optionsArray = Phaser.Utils.Array.Shuffle([...options]);

        let colors = ["#ff5252", "#42a5f5", "#66bb6a", "#ffca28"];

        optionsArray.forEach((opt, i) => {
            let x = this.scale.width / 2 - 250 + i * 170;
            let y = this.scale.height / 2 + 80;

            let btn = this.add.text(x, y, opt, {
                fontSize: "36px",
                backgroundColor: colors[i],
                padding: { x: 30, y: 20 },
                fontFamily: "Fredoka One",
                color: "#fff"
            }).setOrigin(0.5).setInteractive();

            btn.setStroke("#000", 3);

            btn.on("pointerover", () => btn.setScale(1.1));
            btn.on("pointerout", () => btn.setScale(1));

            btn.on("pointerdown", () => {
                if (opt === answer) {
                    this.sound.play("correct");
                    this.score += 10;
                } else {
                    this.sound.play("wrong");
                    this.lives--;
                    this.hearts.pop().destroy();
                }

                if (this.lives <= 0) {
                    this.scene.start("GameOverScene", { score: this.score });
                    return;
                }

                this.scene.restart({
                    score: this.score,
                    lives: this.lives,
                    mode: this.mode,
                    qIndex: this.qIndex + 1
                });
            });
        });
    }

    showHint() {
        let { a, b } = this.current;

        let dotsA = "●".repeat(a);
        let dotsB = "●".repeat(b);

        let text = this.mode === "addition"
            ? `${dotsA} + ${dotsB}`
            : `${dotsA} - ${dotsB}`;

        this.hintText = this.add.text(this.scale.width / 2, 520, text, {
            fontSize: "30px",
            fontFamily: "Fredoka One",
            color: "#000"
        }).setOrigin(0.5);
    }
}

// ================= GAME OVER =================

class GameOverScene extends Phaser.Scene {
    constructor() { super("GameOverScene"); }

    init(data) { this.score = data.score; }

    create() {
        setFullScreenBG(this, "bg");

        this.add.text(this.scale.width / 2, 200, "Game Over", {
            fontSize: "50px",
            fontFamily: "Fredoka One"
        }).setOrigin(0.5);

        let btn = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "restartbutton"
        ).setScale(0.5).setInteractive();

        btn.on("pointerdown", () => {
            this.scene.start("MathScene", {
                score: 0,
                lives: 3,
                mode: "addition",
                qIndex: 0
            });
        });
    }
}

// ================= LEVEL COMPLETE =================

class LevelCompleteScene extends Phaser.Scene {
    constructor() { super("LevelCompleteScene"); }

    init(data) {
        this.score = data.score;
    }

    create() {
        setFullScreenBG(this, "bg");

        this.add.text(this.scale.width / 2, 200, "🎉 Level Complete!", {
            fontSize: "50px",
            fontFamily: "Fredoka One"
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 280, "Score: " + this.score, {
            fontSize: "32px",
            fontFamily: "Fredoka One"
        }).setOrigin(0.5);

        let nextBtn = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2 + 120,
            "nextbtn"
        ).setScale(0.5).setInteractive();

        nextBtn.on("pointerdown", () => {
            this.scene.start("MarketScene");
        });

        nextBtn.on("pointerover", () => nextBtn.setScale(0.55));
        nextBtn.on("pointerout", () => nextBtn.setScale(0.5));
    }
}

// ================= MARKET =================

class MarketScene extends Phaser.Scene {
    constructor() { super("MarketScene"); }

    create() {
        setFullScreenBG(this, "bg");

        this.add.text(this.scale.width / 2, 100, "🛒 Math Market", {
            fontSize: "40px",
            fontFamily: "Fredoka One"
        }).setOrigin(0.5);

        let coins = 30;

        let coinText = this.add.text(20, 20, "Coins: 30", {
            fontSize: "28px",
            fontFamily: "Fredoka One"
        });

        let items = [
            { name: "🍎 Apple", price: 5 },
            { name: "⚽ Ball", price: 10 },
            { name: "🚗 Car", price: 15 }
        ];

        items.forEach((item, i) => {
            let btn = this.add.text(
                this.scale.width / 2,
                200 + i * 100,
                `${item.name} - ${item.price}`,
                {
                    fontSize: "30px",
                    backgroundColor: "#ff9800",
                    padding: 15,
                    fontFamily: "Fredoka One"
                }
            ).setOrigin(0.5).setInteractive();

            btn.on("pointerdown", () => {
                if (coins >= item.price) {
                    coins -= item.price;
                    coinText.setText("Coins: " + coins);
                }
            });
        });
    }
}

// ================= CONFIG =================

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [
        StartScene,
        MathScene,
        GameOverScene,
        LevelCompleteScene,
        MarketScene
    ]
};

new Phaser.Game(config);