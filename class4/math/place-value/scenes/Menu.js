export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        const { width, height } = this.scale;

        // background
        this.add.image(width / 2, height / 2, 'bg')
            .setDisplaySize(width, height);

        // title
        const title = this.add.text(width / 2, height / 2 - 120, 'Candy Math', {
            fontSize: '64px',
            fontFamily: 'Verdana',
            color: '#ff4da6',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5);

        // animation
        this.tweens.add({
            targets: title,
            y: title.y + 10,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // subtitle
        this.add.text(width / 2, height / 2 - 40, 'Learn Addition with Fun!', {
            fontSize: '24px',
            fontFamily: 'Verdana',
            color: '#333'
        }).setOrigin(0.5);

        // start button
        const btn = this.add.rectangle(width / 2, height / 2 + 80, 220, 80, 0xff4da6)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(width / 2, height / 2 + 80, 'START', {
            fontSize: '30px',
            fontFamily: 'Verdana',
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setScale(1.1));
        btn.on('pointerout', () => btn.setScale(1));

        btn.on('pointerdown', () => {
            btn.setScale(0.9);
            this.time.delayedCall(150, () => {
                this.scene.start('Game'); // ONLY start
            });
        });
    }
}