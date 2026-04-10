import QuestionGenerator from '../components/QuestionGenerator.js';

export default class Game extends Phaser.Scene {

    constructor() {
        super('Game');
    }

    init(data) {
        this.level = data.level;
        this.score = 0;
        this.lives = 3;
    }

    create() {

        let { width, height } = this.scale;

        // 🎨 BACKGROUND
        let bg = this.add.image(width / 2, height / 2, 'bg');
        bg.setDisplaySize(width, height);

        // ⭐ SCORE
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '22px',
            color: '#fff'
        });

        // ❤️ LIVES
        this.livesText = this.add.text(width - 20, 20, '❤️❤️❤️', {
            fontSize: '22px'
        }).setOrigin(1, 0);

        // 🧾 PANEL
        let panelY = height * 0.25;

        let panel = this.add.image(width / 2, panelY, 'panel');
        panel.setDisplaySize(width * 0.65, height * 0.22);

        // QUESTION
        this.questionText = this.add.text(width / 2, panelY, '', {
            fontSize: '36px',
            color: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // ✅ FEEDBACK TEXT (NEW)
        this.feedbackText = this.add.text(width / 2, panelY + 80, '', {
            fontSize: '28px',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 🔘 BUTTONS (CLEAN GRID)
        let startY = height * 0.5;

        let gapX = width * 0.2;
        let gapY = height * 0.12;

        let positions = [
            { x: width / 2 - gapX, y: startY },
            { x: width / 2 + gapX, y: startY },
            { x: width / 2 - gapX, y: startY + gapY },
            { x: width / 2 + gapX, y: startY + gapY }
        ];

        this.options = [];

        for (let i = 0; i < 4; i++) {

            let pos = positions[i];

            let btn = this.add.image(pos.x, pos.y, 'button');
            btn.setDisplaySize(width * 0.22, height * 0.09);
            btn.setInteractive({ useHandCursor: true });

            let txt = this.add.text(pos.x, pos.y, '', {
                fontSize: '24px',
                color: '#000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                this.checkAnswer(txt.text);
            });

            this.options.push({ text: txt });
        }

        this.loadQuestion();
    }

    loadQuestion() {
        this.q = QuestionGenerator.generate(this.level);

        this.questionText.setText(this.q.question);
        this.feedbackText.setText(''); // clear old feedback

        this.q.options.forEach((opt, i) => {
            this.options[i].text.setText(opt);
        });
    }

    checkAnswer(selected) {

        if (parseInt(selected) === this.q.answer) {

            this.score++;
            this.feedbackText.setText('Correct!');
            this.feedbackText.setColor('#00ff00');

        } else {

            this.lives--;
            this.feedbackText.setText('Wrong!');
            this.feedbackText.setColor('#ff0000');

            this.livesText.setText('❤️'.repeat(this.lives));

            if (this.lives <= 0) {
                this.scene.start('Result', { score: this.score });
                return;
            }
        }

        this.scoreText.setText(`Score: ${this.score}`);

        this.time.delayedCall(800, () => {
            this.loadQuestion();
        });
    }
}