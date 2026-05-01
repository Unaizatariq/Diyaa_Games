import BaseScene from "./BaseScene.js";
import ModuleSession from "./ModuleSession.js";
import { getModuleById } from "../config/moduleCatalog.js";

export default class CurriculumScene extends BaseScene {
    constructor(sceneKey, moduleId) {
        super(sceneKey);
        this.moduleId = moduleId;
        this.moduleMeta = getModuleById(moduleId);
    }

    create() {
        this.createBase();
        this.session = new ModuleSession(this.moduleMeta || {
            moduleId: this.moduleId,
            rounds: 10,
            scoring: { scorePerCorrect: 10, starThresholds: [60, 80, 100] }
        });
        this.updateScore(0);
    }

    onCorrectAnswer() {
        this.session.markCorrect();
        this.sounds.playCorrect();
        this.updateScore(this.session.score);
    }

    onWrongAnswer() {
        this.session.markWrong();
        this.sounds.playWrong();
    }

    completeModule() {
        const result = this.session.finalize();
        this.sounds.playLevelComplete();
        return result;
    }
}

