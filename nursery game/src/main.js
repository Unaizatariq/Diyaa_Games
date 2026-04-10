import Menu from "../scenes/Menu.js";
import Start from "../scenes/Start.js";

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: "game",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [Menu, Start]
};

new Phaser.Game(config);