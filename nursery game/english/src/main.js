import Boot from "../scenes/Boot.js";
import Level1 from "../scenes/Level1.js";
import Level2 from "../scenes/Level2.js";
import Level3 from "../scenes/level3.js";
import Level4 from "../scenes/Level4.js";
import Level5 from "../scenes/Level5.js";
import Level6 from "../scenes/Level6.js";
import { createFrontendBridge, resolveGameConfig } from "../../../shared/frontendIntegration.js";

const resolvedConfig = resolveGameConfig({
    grade: "nursery",
    subject: "english",
    gameId: "nursery_english",
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

    scene: [Boot, Level1, Level2, Level3, Level4, Level5, Level6]
};

new Phaser.Game(config);
