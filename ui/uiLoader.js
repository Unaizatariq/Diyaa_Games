export function loadUI(scene, level) {
    const safeLevel = ((Math.max(1, Number(level) || 1) - 1) % 6) + 1;
    const base = `/ui/level${safeLevel}/`;

    // ✅ GLOBAL KEYS (same everywhere)
    scene.load.image("panelBg", base + "panel-background.png");
    scene.load.image("optionCard", base + "option-card.png");
    scene.load.image("playBtn", base + "play-button.png");
    scene.load.image("starIcon", base + "star-icon.png");
    scene.load.image("coinIcon", base + "coin-icon.png");

    scene.load.video("bgVideo", base + "bg-video.mp4", "loadeddata", false, true);

    scene.load.audio("rightSound", "/ui/right.mp3");
    scene.load.audio("wrongSound", "/ui/wrong.mp3");
    scene.load.audio("levelCompleteSound", "/ui/level-complete.mp3");
    scene.load.audio("clickSound", "/class1/maths/assets/click.mp3");
}
