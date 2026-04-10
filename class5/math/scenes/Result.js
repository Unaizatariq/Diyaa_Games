import ProgressManager from '../components/ProgressManager.js';

export default class Result extends Phaser.Scene {

    constructor() {
        super('Result'); // ✅ IMPORTANT FIX
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        let xp = this.score * 5;
        ProgressManager.addXP(xp);

        this.add.text(400, 250, `Score: ${this.score}`, {
            fontSize: '32px',
            color: '#fff'
        }).setOrigin(0.5);

        const btn = this.add.text(400, 350, 'Back', {
            fontSize: '24px',
            backgroundColor: '#ff9800',
            padding: 10
        }).setOrigin(0.5).setInteractive();

        btn.on('pointerdown', () => {
            this.scene.start('Menu');
        });
    }
}