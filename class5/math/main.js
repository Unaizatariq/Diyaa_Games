import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import Menu from './scenes/Menu.js';
import LevelSelect from './scenes/LevelSelect.js';
import Game from './scenes/Game.js';
import Result from './scenes/Result.js';

const config = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.RESIZE,   // ✅ KEY FIX
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },

    scene: [Boot, Preload, Menu, LevelSelect, Game, Result]
};

new Phaser.Game(config);