export function resolveGameConfig(defaults = {}) {
    const params = new URLSearchParams(window.location.search);
    const embed = window.DIYAA_EMBED_CONFIG || {};

    const levelFromUrl = Number(params.get("level"));
    const level = Number.isFinite(levelFromUrl) && levelFromUrl > 0
        ? levelFromUrl
        : Number(embed.level || defaults.level || 1);

    return {
        grade: embed.grade || defaults.grade || "nursery",
        subject: embed.subject || defaults.subject || "english",
        gameId: embed.gameId || defaults.gameId || "nursery_english",
        level,
        moduleId: embed.moduleId || params.get("moduleId") || null,
        userId: embed.userId || params.get("userId") || null,
        attemptId: embed.attemptId || params.get("attemptId") || null
    };
}

export function emitFrontendEvent(type, payload = {}) {
    const message = {
        source: "DIYAA_GAME",
        type,
        at: new Date().toISOString(),
        payload
    };

    window.dispatchEvent(new CustomEvent("diyaa-game-event", { detail: message }));

    if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, "*");
    }

    if (typeof window.DIYAA_ON_GAME_EVENT === "function") {
        window.DIYAA_ON_GAME_EVENT(message);
    }
}

export function createFrontendBridge(config) {
    const bridge = {
        config,
        emit: (type, payload) => emitFrontendEvent(type, payload),
        onLoaded(extra = {}) {
            emitFrontendEvent("level_loaded", { ...config, ...extra });
        },
        onProgress(extra = {}) {
            emitFrontendEvent("level_progress", { ...config, ...extra });
        },
        onCompleted(extra = {}) {
            emitFrontendEvent("level_completed", { ...config, ...extra });
        }
    };

    window.DIYAA_FRONTEND_BRIDGE = bridge;
    return bridge;
}

