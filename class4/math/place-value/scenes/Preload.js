export default class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        // images
        this.load.image('bg', './assets/images/bg.png');
        this.load.image('panel', './assets/images/panel.png');
        this.load.image('button', './assets/images/button.png');
        this.load.image('candy_one', './assets/images/candy_one.png');
        this.load.image('candy_ten', './assets/images/candy_ten.png');
        this.load.image('drop_zone', './assets/images/drop_zone.png');

        // audio
        this.load.audio('click', './assets/audio/pop.mp3');
        this.load.audio('correct', './assets/audio/correct.mp3');
        this.load.audio('wrong', './assets/audio/wrong.mp3');
    }

    create() {
        this.scene.start('Menu'); // ONLY start, NO scene.add
    }
}