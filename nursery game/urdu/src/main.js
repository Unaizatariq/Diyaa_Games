import Boot from "../scenes/Boot.js";
import LevelScene from "../scenes/LevelScene.js";
import { createFrontendBridge, resolveGameConfig } from "../../../shared/frontendIntegration.js";

const resolvedConfig = resolveGameConfig({
    grade: "nursery",
    subject: "urdu",
    gameId: "nursery_urdu",
    level: window.DIYAA_GAME_CONFIG?.level || 1
});
window.DIYAA_GAME_CONFIG = resolvedConfig;
window.DIYAA_GAME_RESULT = null;
createFrontendBridge(resolvedConfig);

const config = {
    type: Phaser.AUTO,
    parent: "game",
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Boot, LevelScene]
};

new Phaser.Game(config);
