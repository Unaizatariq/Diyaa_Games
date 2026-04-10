// ================= SPEAK =================
function speak(text) {
    let u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}

// ================= BG =================
function setBG(scene, key) {
    let bg = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, key);

    function resize(w, h) {
        let scale = Math.max(w / bg.width, h / bg.height);
        bg.setPosition(w / 2, h / 2);
        bg.setScale(scale);
    }

    resize(scene.scale.width, scene.scale.height);
    scene.scale.on("resize", g => resize(g.width, g.height));
    bg.setDepth(-1);
}

// ================= DATA =================
const nouns = [
    { name: "teacher", type: "person" },
    { name: "doctor", type: "person" },
    { name: "student", type: "person" },
    { name: "police", type: "person" },
    { name: "farmer", type: "person" },
    { name: "chef", type: "person" },
    { name: "driver", type: "person" },
    { name: "baby", type: "person" },

    { name: "school", type: "place" },
    { name: "park", type: "place" },
    { name: "zoo", type: "place" },
    { name: "market", type: "place" },
    { name: "beach", type: "place" },
    { name: "library", type: "place" },
    { name: "hospital", type: "place" },
    { name: "playground", type: "place" },

    { name: "ball", type: "thing" },
    { name: "book", type: "thing" },
    { name: "car", type: "thing" },
    { name: "chair", type: "thing" },
    { name: "pencil", type: "thing" },
    { name: "bag", type: "thing" },
    { name: "cup", type: "thing" },
    { name: "bicycle", type: "thing" }
];

// ================= START =================
class StartScene extends Phaser.Scene {
    constructor() { super({ key: "StartScene" }); }

    preload() {
        this.load.image("bg", "../assets/game-bg.jpeg");
        this.load.image("startbtn", "../assets/startbutton.png");

        this.load.audio("correct", "../assets/correct.mp3");
        this.load.audio("wrong", "../assets/wrong.mp3");

        nouns.forEach(n => {
            this.load.image(n.name, `../assets/${n.name}.jpeg`);
        });
    }

    create() {
        setBG(this, "bg");

        this.add.text(this.scale.width / 2, 120, "NOUN SORTER", {
            fontSize: "70px",
            fontFamily: "Fredoka One",
            stroke: "#000",
            strokeThickness: 6
        }).setOrigin(0.5);

        let btn = this.add.image(this.scale.width / 2, this.scale.height / 2, "startbtn")
            .setInteractive().setScale(0.6);

        btn.on("pointerdown", () => {
            this.scene.start("GameScene", { score: 0, lives: 3 });
        });
    }
}

// ================= GAME =================
class GameScene extends Phaser.Scene {
    constructor() { super({ key: "GameScene" }); }

    init(data) {
        this.score = data.score;
        this.lives = data.lives;
        this.completed = 0;
    }

    create() {
        setBG(this, "bg");

        // UI
        this.scoreText = this.add.text(20, 20, "⭐ " + this.score, { fontSize: "32px" });

        this.hearts = [];
        for (let i = 0; i < this.lives; i++) {
            this.hearts.push(this.add.text(20 + i * 40, 60, "❤️", { fontSize: "32px" }));
        }

        // ✅ NEW STYLE BOXES (LIKE IMAGE)
        this.personBox = this.createLabelBox(250, 140, "person", "👤");
        this.placeBox = this.createLabelBox(640, 140, "place", "🌍");
        this.thingBox = this.createLabelBox(1030, 140, "thing", "✂️");

        this.createGrid();
    }

    createLabelBox(x, y, label, icon) {
        let container = this.add.container(x, y);

        let bg = this.add.rectangle(0, 0, 320, 120, 0xffffff)
            .setStrokeStyle(3, 0x000000);

        let text = this.add.text(-80, 0, label, {
            fontSize: "36px",
            fontFamily: "Fredoka One",
            color: "#000"
        }).setOrigin(0.5);

        let iconText = this.add.text(100, 0, icon, {
            fontSize: "40px"
        }).setOrigin(0.5);

        container.add([bg, text, iconText]);

        container.setSize(320, 120);

        return container;
    }

    createGrid() {
        let shuffled = Phaser.Utils.Array.Shuffle([...nouns]);

        shuffled.forEach((item, i) => {
            let cols = 6;
            let spacingX = 180;
            let spacingY = 180;

            let startX = this.scale.width / 2 - (cols / 2) * spacingX + spacingX / 2;

            let x = startX + (i % cols) * spacingX;
            let y = 320 + Math.floor(i / cols) * spacingY;

            let card = this.add.container(x, y);

            let bg = this.add.rectangle(0, 0, 140, 140, 0xffffff)
                .setStrokeStyle(4, 0x000);

            let img = this.add.image(0, -10, item.name).setDisplaySize(90, 90);

            let label = this.add.text(0, 60, item.name, {
                fontSize: "18px",
                fontFamily: "Fredoka One"
            }).setOrigin(0.5);

            card.add([bg, img, label]);

            card.setSize(140, 140);
            card.setInteractive();
            card.data = item;

            this.input.setDraggable(card);

            card.on("dragstart", () => {
                speak(item.name);
                card.setScale(1.1);
            });

            card.on("drag", (p, dx, dy) => {
                card.x = dx;
                card.y = dy;
            });

            card.on("dragend", () => {
                card.setScale(1);
                this.checkDrop(card);
            });
        });
    }

    checkDrop(card) {
        let type = card.data.type;

        let box =
            type === "person" ? this.personBox :
                type === "place" ? this.placeBox :
                    this.thingBox;

        let bounds = box.getBounds();

        // ✅ ONLY COUNT IF ACTUALLY DROPPED INSIDE
        if (Phaser.Geom.Rectangle.Contains(bounds, card.x, card.y)) {
            this.handleCorrect(card);
        } else {
            // ❌ Just return to position (NO LIFE LOSS unless clearly dropped near box)
            this.tweens.add({
                targets: card,
                x: card.input.dragStartX,
                y: card.input.dragStartY,
                duration: 300
            });
        }
    }

    handleCorrect(card) {
        this.sound.play("correct");

        this.tweens.add({
            targets: card,
            scale: 1.2,
            yoyo: true,
            duration: 200
        });

        this.tweens.add({
            targets: card,
            alpha: 0,
            duration: 300,
            delay: 200
        });

        this.score += 10;
        this.scoreText.setText("⭐ " + this.score);

        this.completed++;

        if (this.completed === nouns.length) {
            this.add.text(this.scale.width / 2, 680, "🎉 LEVEL COMPLETE!", {
                fontSize: "40px",
                fontFamily: "Fredoka One"
            }).setOrigin(0.5);
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