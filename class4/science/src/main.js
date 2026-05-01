import Boot from "../scenes/Boot.js";
import LevelScene from "../scenes/LevelScene.js";
import { createFrontendBridge, resolveGameConfig } from "../../../shared/frontendIntegration.js";

const config = resolveGameConfig({
    grade: "class4",
    subject: "science",
    gameId: "class4_science",
    level: window.DIYAA_GAME_CONFIG?.level || 1
});
window.DIYAA_GAME_CONFIG = config;
window.DIYAA_GAME_RESULT = null;
createFrontendBridge(config);

new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: window.innerWidth,
    height: window.innerHeight,
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [Boot, LevelScene]
});
