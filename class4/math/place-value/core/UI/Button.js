export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, callback) {
        super(scene, x, y);

        const bg = scene.add.image(0, 0, 'button').setScale(2);

        const label = scene.add.text(0, 0, text, {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add([bg, label]);
        this.setSize(bg.width, bg.height);

        this.setInteractive({ useHandCursor: true });

        this.on('pointerover', () => {
            scene.tweens.add({ targets: this, scale: 1.1, duration: 150 });
        });

        this.on('pointerout', () => {
            scene.tweens.add({ targets: this, scale: 1, duration: 150 });
        });

        this.on('pointerdown', () => {
            scene.tweens.add({
                targets: this,
                scale: 0.9,
                duration: 100,
                yoyo: true
            });
            callback();
        });

        scene.add.existing(this);
    }
}