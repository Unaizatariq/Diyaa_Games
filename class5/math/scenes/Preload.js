export default class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.image('bg', 'assets/images/bg.png');
        this.load.image('button', 'assets/images/button.png');
        this.load.image('panel', 'assets/images/panel.png');
    }

    create() {
        this.scene.start('Menu');
    }
}