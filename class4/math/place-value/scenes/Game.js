export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        const { width, height } = this.scale;

        // 🌸 Background
        this.add.image(width / 2, height / 2, 'bg')
            .setDisplaySize(width, height);

        // 🧠 State
        this.score = 0;
        this.lives = 3;
        this.currentSum = 0;
        this.isGameOver = false;

        // 🔷 UI
        this.scoreText = this.add.text(30, 20, '⭐ 0', {
            fontSize: '26px',
            fontFamily: 'Verdana',
            color: '#222',
            fontStyle: 'bold'
        });

        this.livesText = this.add.text(width - 140, 20, '❤️ 3', {
            fontSize: '26px',
            fontFamily: 'Verdana',
            color: '#222',
            fontStyle: 'bold'
        });

        this.questionText = this.add.text(width / 2, 100, '', {
            fontSize: '40px',
            fontFamily: 'Verdana',
            color: '#111',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.totalText = this.add.text(width / 2, 200, 'Total: 0', {
            fontSize: '30px',
            fontFamily: 'Verdana',
            color: '#ff4da6',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.createCandyButtons(width, height);

        this.newQuestion();
    }

    createCandyButtons(width, height) {
        const spacing = 200;
        const centerY = height / 2 + 50;

        this.tensCandy = this.add.image(width / 2 - spacing / 2, centerY, 'candy_ten')
            .setDisplaySize(110, 110)
            .setInteractive({ useHandCursor: true });

        this.onesCandy = this.add.image(width / 2 + spacing / 2, centerY, 'candy_one')
            .setDisplaySize(110, 110)
            .setInteractive({ useHandCursor: true });

        this.tensCandy.value = 10;
        this.onesCandy.value = 1;

        this.tensCandy.on('pointerup', () => this.handleClick(this.tensCandy));
        this.onesCandy.on('pointerup', () => this.handleClick(this.onesCandy));
    }

    handleClick(candy) {
        if (this.isGameOver) return;

        this.currentSum += candy.value;

        // 🔊 SOUND FIX (guaranteed play)
        this.sound.play('click', { volume: 0.5 });

        this.totalText.setText('Total: ' + this.currentSum);

        this.checkAnswer();
    }

    newQuestion() {
        this.currentSum = 0;
        this.totalText.setText('Total: 0');

        this.a = Phaser.Math.Between(10, 40);
        this.b = Phaser.Math.Between(10, 40);
        this.answer = this.a + this.b;

        this.questionText.setText(`${this.a} + ${this.b} = ?`);
    }

    checkAnswer() {
        if (this.currentSum === this.answer) {
            this.showResult(true);
        } else if (this.currentSum > this.answer) {
            this.showResult(false);
        }
    }

    showResult(correct) {
        const { width, height } = this.scale;

        let msg = correct ? 'Correct!' : 'Wrong!';
        let color = correct ? '#00aa00' : '#ff0000';

        // 🔊 SOUND
        this.sound.play(correct ? 'correct' : 'wrong', { volume: 0.7 });

        let text = this.add.text(width / 2, height / 2, msg, {
            fontSize: '48px',
            fontFamily: 'Verdana',
            color: color,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        if (correct) {
            this.score += 10;
            this.scoreText.setText('⭐ ' + this.score);
        } else {
            this.lives--;
            this.livesText.setText('❤️ ' + this.lives);
        }

        // ❌ GAME OVER
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }

        this.time.delayedCall(1200, () => {
            text.destroy();
            this.newQuestion();
        });
    }

    gameOver() {
        const { width, height } = this.scale;

        this.isGameOver = true;

        this.add.rectangle(width / 2, height / 2, 400, 250, 0x000000, 0.7);

        this.add.text(width / 2, height / 2 - 40, 'GAME OVER', {
            fontSize: '40px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let restartBtn = this.add.text(width / 2, height / 2 + 40, 'RESTART', {
            fontSize: '30px',
            backgroundColor: '#ff4da6',
            padding: { x: 20, y: 10 },
            color: '#fff'
        })
            .setOrigin(0.5)
            .setInteractive();

        restartBtn.on('pointerup', () => {
            this.scene.restart(); // 🔥 resets everything
        });
    }
}