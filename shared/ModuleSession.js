import { ProgressTracker } from "./ProgressTracker.js";

export default class ModuleSession {
    constructor(moduleMeta) {
        this.meta = moduleMeta;
        this.correct = 0;
        this.incorrect = 0;
        this.score = 0;
        this.totalRounds = moduleMeta?.rounds || 10;
        this.scorePerCorrect = moduleMeta?.scoring?.scorePerCorrect || 10;
    }

    markCorrect() {
        this.correct += 1;
        this.score += this.scorePerCorrect;
    }

    markWrong() {
        this.incorrect += 1;
    }

    getAccuracyPercent() {
        const total = this.correct + this.incorrect;
        if (total === 0) return 0;
        return Math.round((this.correct / total) * 100);
    }

    getMaxScore() {
        return this.totalRounds * this.scorePerCorrect;
    }

    finalize() {
        return ProgressTracker.completeAttempt({
            moduleId: this.meta.moduleId,
            score: this.score,
            maxScore: this.getMaxScore(),
            starThresholds: this.meta?.scoring?.starThresholds || [],
            accuracy: this.getAccuracyPercent()
        });
    }
}

