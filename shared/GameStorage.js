export const GameStorage = {
    saveProgress(gameId, data) {
        localStorage.setItem(gameId, JSON.stringify(data));
    },

    getProgress(gameId) {
        const saved = localStorage.getItem(gameId);
        return saved ? JSON.parse(saved) : null;
    }
};

