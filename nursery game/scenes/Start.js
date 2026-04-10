export default class Start extends Phaser.Scene {

    constructor() {
        super("Start");
    }

    preload() {

        this.load.image("bg", "assets/kids-bg.jpg");

        for (let i = 65; i <= 90; i++) {
            let letter = String.fromCharCode(i);

            this.load.image(letter, `assets/alphabets/${letter}.jpeg`);
            this.load.audio(letter, `assets/audio/${letter}.wav`);
        }
    }

    create() {

        this.w = this.cameras.main.width;
        this.h = this.cameras.main.height;

        // BACKGROUND
        let bg = this.add.image(0, 0, "bg").setOrigin(0);
        bg.setScale(Math.max(this.w / bg.width, this.h / bg.height));

        // SCORE
        this.score = 0;

        this.scoreText = this.add.text(20, 20, "⭐ Score: 0", {
            fontSize: "32px",
            fontStyle: "bold",
            backgroundColor: "#000",
            color: "#fff",
            padding: { x: 12, y: 8 }
        });

        this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        this.currentIndex = 0;

        // 🔥 IMPORTANT: store round objects here
        this.roundObjects = [];

        this.nextRound();
    }

    clearRound() {

        // destroy ONLY previous round objects
        this.roundObjects.forEach(obj => obj.destroy());
        this.roundObjects = [];
    }

    nextRound() {

        this.clearRound();

        let targetLetter = this.letters[this.currentIndex];

        // TITLE
        let title = this.add.text(this.w / 2, 80, "👆 Find This Letter", {
            fontSize: "48px",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000",
            strokeThickness: 6
        }).setOrigin(0.5);

        this.roundObjects.push(title);

        // 🔠 TARGET (CENTER)
        let targetImg = this.add.image(this.w / 2, this.h / 2 - 80, targetLetter)
            .setScale(0.45);

        this.roundObjects.push(targetImg);

        // OPTIONS (ONLY 4)
        let options = [targetLetter];

        while (options.length < 4) {
            let rand = Phaser.Utils.Array.GetRandom(this.letters);
            if (!options.includes(rand)) options.push(rand);
        }

        Phaser.Utils.Array.Shuffle(options);

        // BOTTOM ROW
        let startX = this.w / 2 - 240;
        let y = this.h - 140;

        options.forEach((letter, index) => {

            let x = startX + index * 160;

            let img = this.add.image(x, y, letter)
                .setScale(0.22)
                .setInteractive({ useHandCursor: true });

            this.roundObjects.push(img);

            img.on("pointerover", () => img.setScale(0.26));
            img.on("pointerout", () => img.setScale(0.22));

            img.on("pointerdown", () => {

                this.sound.play(letter);

                if (letter === targetLetter) {

                    this.score += 10;
                    this.scoreText.setText("⭐ Score: " + this.score);

                    this.currentIndex++;

                    this.time.delayedCall(500, () => {
                        this.nextRound();
                    });

                } else {
                    this.score -= 2;
                    this.scoreText.setText("⭐ Score: " + this.score);
                }
            });

            this.roundObjects.push(img);
        });
    }
}