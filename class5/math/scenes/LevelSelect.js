import ProgressManager from '../components/ProgressManager.js';

export default class LevelSelect extends Phaser.Scene {

    constructor() {
        super('LevelSelect');
    }

    create() {

        let { width, height } = this.scale;

        // 🎨 BACKGROUND (FULL SCREEN FIX)
        let bg = this.add.image(width / 2, height / 2, 'bg');
        bg.setDisplaySize(width, height);

        // TITLE
        this.add.text(width / 2, height * 0.2, 'Select Level', {
            fontSize: '40px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // LEVEL 1 BUTTON
        let lvl1 = this.add.image(width / 2, height * 0.4, 'button')
            .setScale(0.7)
            .setInteractive();

        this.add.text(width / 2, height * 0.4, 'Level 1: Multiplication', {
            fontSize: '24px',
            color: '#000'
        }).setOrigin(0.5);

        lvl1.on('pointerdown', () => {
            this.scene.start('Game', { level: 1 });
        });

        // LEVEL 2 (LOCKED)
        let unlocked = ProgressManager.isLevelUnlocked(2);

        let lvl2 = this.add.image(width / 2, height * 0.6, 'button')
            .setScale(0.7);

        let text = unlocked ? 'Level 2: Division' : 'Locked';

        this.add.text(width / 2, height * 0.6, text, {
            fontSize: '24px',
            color: unlocked ? '#000' : '#555'
        }).setOrigin(0.5);

        if (unlocked) {
            lvl2.setInteractive();
            lvl2.on('pointerdown', () => {
                this.scene.start('Game', { level: 2 });
            });
        } else {
            lvl2.setTint(0x888888); // grey locked look
        }
    }
}