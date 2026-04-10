export default class Menu extends Phaser.Scene {

    constructor() {
        super('Menu'); // ✅ UNIQUE KEY (important)
    }

    create() {

        let { width, height } = this.scale;

        // 🎨 BACKGROUND (FULL SCREEN)
        let bg = this.add.image(width / 2, height / 2, 'bg');

        let scaleX = width / bg.width;
        let scaleY = height / bg.height;
        let scale = Math.max(scaleX, scaleY);

        bg.setScale(scale);

        // 🏷️ TITLE
        this.add.text(width / 2, height * 0.3, 'Class 5 Math', {
            fontSize: '42px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 🔘 START BUTTON (IMAGE)
        let startBtn = this.add.image(width / 2, height * 0.6, 'button')
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        // Button Text
        let startText = this.add.text(width / 2, height * 0.6, 'Start', {
            fontSize: '26px',
            color: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 🖱️ CLICK EVENT
        startBtn.on('pointerdown', () => {
            this.scene.start('LevelSelect');
        });

        // ✨ HOVER EFFECT (makes it feel like real game)
        startBtn.on('pointerover', () => {
            startBtn.setScale(0.75);
        });

        startBtn.on('pointerout', () => {
            startBtn.setScale(0.7);
        });
    }
}