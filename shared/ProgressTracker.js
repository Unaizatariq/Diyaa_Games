import { GameStorage } from "./GameStorage.js";

const STORAGE_KEY = "diyaa_progress_v1";

function nowISO() {
    return new Date().toISOString();
}

function safeRead() {
    return GameStorage.getProgress(STORAGE_KEY) || {
        modules: {},
        summary: {
            totalScore: 0,
            starsEarned: 0,
            completedModules: 0
        },
        updatedAt: null
    };
}

function computeStars(score, thresholds = []) {
    return thresholds.reduce((count, threshold) => (
        score >= threshold ? count + 1 : count
    ), 0);
}

export const ProgressTracker = {
    getState() {
        return safeRead();
    },

    getModuleState(moduleId) {
        const state = safeRead();
        return state.modules[moduleId] || null;
    },

    completeAttempt({ moduleId, score, maxScore, starThresholds = [], accuracy = 0 }) {
        const state = safeRead();
        const stars = computeStars(score, starThresholds);
        const previous = state.modules[moduleId];

        state.modules[moduleId] = {
            attempts: (previous?.attempts || 0) + 1,
            bestScore: Math.max(previous?.bestScore || 0, score),
            lastScore: score,
            maxScore,
            bestAccuracy: Math.max(previous?.bestAccuracy || 0, accuracy),
            stars,
            completed: true,
            lastPlayedAt: nowISO()
        };

        const moduleEntries = Object.values(state.modules);
        state.summary = {
            totalScore: moduleEntries.reduce((sum, item) => sum + item.bestScore, 0),
            starsEarned: moduleEntries.reduce((sum, item) => sum + item.stars, 0),
            completedModules: moduleEntries.filter(item => item.completed).length
        };
        state.updatedAt = nowISO();

        GameStorage.saveProgress(STORAGE_KEY, state);
        return state.modules[moduleId];
    }
};

