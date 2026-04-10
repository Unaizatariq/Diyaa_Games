export default class Menu extends Phaser.Scene {

    constructor() {
        super("Menu");
    }

    preload() {
        this.load.image("bg", "assets/kids-bg.jpg");
    }

    create() {

        let w = this.cameras.main.width;
        let h = this.cameras.main.height;

        // Background
        let bg = this.add.image(0, 0, "bg").setOrigin(0);

        let scale = Math.max(w / bg.width, h / bg.height);
        bg.setScale(scale);

        // Title
        this.add.text(w / 2, 180, "🎮 Nursery Game", {
            fontSize: "64px",
            fontStyle: "bold",
            color: "#fff",
            stroke: "#000",
            strokeThickness: 6
        }).setOrigin(0.5);

        // Play Button
        let play = this.add.text(w / 2, h / 2, "PLAY ▶", {
            fontSize: "50px",
            fontStyle: "bold",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: { x: 40, y: 20 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        play.on("pointerover", () => play.setScale(1.1));
        play.on("pointerout", () => play.setScale(1));

        play.on("pointerdown", () => {
            this.scene.start("Start");
        });
    }
}