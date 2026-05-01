export default class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // ✅ ONLY global shared assets

        // Alphabets + audio
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);

            this.load.image(letter, `assets/alphabets/${letter}.png`);
            this.load.audio(letter, `assets/audio/${letter}.wav`);
        }
    }

    create() {
        const rawLevel = Number(window.DIYAA_GAME_CONFIG?.level || 1);
        const level = Math.min(6, Math.max(1, rawLevel));
        this.scene.start(`Level${level}`);
    }
}
