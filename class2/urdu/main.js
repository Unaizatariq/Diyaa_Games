// ================= DOM =================
function setTitle(t) { document.getElementById("urdu-title").innerText = t; }
function hideTitle() { document.getElementById("urdu-title").innerText = ""; }
function setQuestion(t) {
    let el = document.getElementById("urdu-question");
    el.innerText = t;
    el.style.display = "block";
    el.style.background = "rgba(255,255,255,0.8)";
}
function clearQuestion() { document.getElementById("urdu-question").style.display = "none"; }

// ================= TTS =================
let voices = [];
speechSynthesis.onvoiceschanged = () => voices = speechSynthesis.getVoices();

function speakUrdu(text) {
    let u = new SpeechSynthesisUtterance(text);
    let v = voices.find(x => x.lang.includes("ur"));
    if (v) u.voice = v; else u.lang = "ur-PK";
    u.rate = 0.85;
    speechSynthesis.cancel();
    setTimeout(() => speechSynthesis.speak(u), 100);
}

// ================= BG =================
function setBG(scene, key) {
    let bg = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, key);
    let resize = (w, h) => {
        let s = Math.max(w / bg.width, h / bg.height);
        bg.setPosition(w / 2, h / 2); bg.setScale(s);
    };
    resize(scene.scale.width, scene.scale.height);
    scene.scale.on("resize", g => resize(g.width, g.height));
    bg.setDepth(-1);
}

// ================= DATA =================
const wordData = [
    { q: "کتاب", a: "کتابیں", o: ["کتابیں", "لڑکا", "درخت", "پانی"] },
    { q: "لڑکا", a: "لڑکے", o: ["لڑکے", "کتابیں", "پانی", "گھر"] },
    { q: "گھر", a: "گھر", o: ["گھر", "گھروں", "کتابیں", "لڑکے"] },
    { q: "پھول", a: "پھول", o: ["پھول", "پھولوں", "کتابیں", "درخت"] },
    { q: "درخت", a: "درخت", o: ["درخت", "درختوں", "لڑکے", "پانی"] }
];

// ================= START =================
class StartScene extends Phaser.Scene {
    constructor() { super({ key: "StartScene" }); }

    preload() {
        this.load.image("start-bg", "assets/start-bg.jpeg");
        this.load.image("game-bg", "assets/start-bg.jpeg");
        this.load.image("startbtn", "assets/startbutton.png");
        this.load.image("nextbtn", "assets/next.png");
        this.load.image("restartbtn", "assets/restartbutton.png");

        this.load.audio("click", "assets/click.mp3");
        this.load.audio("correct", "assets/correct.mp3");
        this.load.audio("wrong", "assets/wrong.mp3");
    }

    create() {
        setBG(this, "start-bg");
        setTitle("جمع جنکشن");

        let btn = this.add.image(this.scale.width / 2, this.scale.height / 2, "startbtn")
            .setInteractive().setScale(0.6);

        btn.on("pointerdown", () => {
            this.sound.context.resume();
            this.sound.play("click");

            hideTitle();

            this.scene.start("GameScene", { qIndex: 0, score: 0, lives: 3 });
        });
    }
}

// ================= GAME =================
class GameScene extends Phaser.Scene {
    constructor() { super({ key: "GameScene" }); }

    init(data) {
        this.qIndex = data.qIndex;
        this.score = data.score;
        this.lives = data.lives;
    }

    create() {
        setBG(this, "game-bg");
        hideTitle();

        this.renderUI();
        this.loadQuestion();
    }

    renderUI() {
        this.add.text(20, 20, "⭐ " + this.score, { fontSize: "32px" });

        this.hearts = [];
        for (let i = 0; i < this.lives; i++) {
            this.hearts.push(this.add.text(20 + i * 40, 70, "❤️", { fontSize: "32px" }));
        }
    }

    loadQuestion() {
        if (this.qIndex >= wordData.length) {
            clearQuestion();
            this.scene.start("CompleteScene", { score: this.score });
            return;
        }

        let data = wordData[this.qIndex];

        setQuestion(`"${data.q}" کی جمع کیا ہے؟`);
        speakUrdu(data.q);

        let options = Phaser.Utils.Array.Shuffle([...data.o]);
        let colors = ["#ff5252", "#42a5f5", "#66bb6a", "#ffca28"];

        options.forEach((opt, i) => {
            let btn = this.add.text(
                this.scale.width / 2 - 300 + i * 200,
                350,
                opt,
                {
                    fontSize: "40px",
                    fontFamily: "Noto Nastaliq Urdu",
                    backgroundColor: colors[i],
                    padding: { x: 30, y: 20 },
                    color: "#fff"
                }
            ).setOrigin(0.5).setInteractive();

            btn.on("pointerdown", () => {

                speechSynthesis.cancel();

                if (opt === data.a) {
                    this.sound.play("correct");
                    this.score += 10;
                } else {
                    this.sound.play("wrong");
                    this.lives--;
                    this.hearts.pop().destroy();
                }

                if (this.lives <= 0) {
                    clearQuestion();
                    this.scene.start("GameOverScene", { score: this.score });
                    return;
                }

                clearQuestion();

                this.scene.restart({
                    qIndex: this.qIndex + 1,
                    score: this.score,
                    lives: this.lives
                });
            });
        });
    }
}

// ================= COMPLETE =================
class CompleteScene extends Phaser.Scene {
    constructor() { super({ key: "CompleteScene" }); }

    create() {
        setBG(this, "game-bg");
        clearQuestion();

        this.add.text(this.scale.width / 2, 200, "🎉 Level Complete", { fontSize: "50px" })
            .setOrigin(0.5);

        let btn = this.add.image(this.scale.width / 2, 400, "nextbtn")
            .setInteractive().setScale(0.6);

        btn.on("pointerdown", () => {
            this.scene.start("StartScene");
        });
    }
}

// ================= GAME OVER =================
class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: "GameOverScene" }); }

    create() {
        setBG(this, "game-bg");
        clearQuestion();

        this.add.text(this.scale.width / 2, 200, "Game Over", { fontSize: "50px" })
            .setOrigin(0.5);

        let btn = this.add.image(this.scale.width / 2, 400, "restartbtn")
            .setInteractive().setScale(0.6);

        btn.on("pointerdown", () => {
            this.scene.start("GameScene", { qIndex: 0, score: 0, lives: 3 });
        });
    }
}

// ================= CONFIG =================
new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [StartScene, GameScene, CompleteScene, GameOverScene]
});