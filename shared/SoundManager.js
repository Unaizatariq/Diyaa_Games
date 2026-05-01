export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
    }

    playCorrect() {
        this.safePlay("rightSound");
    }

    playWrong() {
        this.safePlay("wrongSound");
    }

    playLevelComplete() {
        this.safePlay("levelCompleteSound");
    }

    playTap() {
        this.safePlay("clickSound");
    }

    playLetter(letter) {
        this.safePlay(letter);
    }

    safePlay(key) {
        if (!key) return;
        if (!this.scene.cache.audio.exists(key)) return;
        this.scene.sound.play(key);
    }
}
