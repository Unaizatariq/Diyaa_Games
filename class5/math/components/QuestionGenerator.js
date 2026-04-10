export default class QuestionGenerator {

    static generate(level) {
        if (level === 1) return this.mul();
        if (level === 2) return this.div();
    }

    static mul() {
        let a = Phaser.Math.Between(10, 50);
        let b = Phaser.Math.Between(2, 9);
        return this.format(`${a} × ${b}`, a * b);
    }

    static div() {
        let b = Phaser.Math.Between(2, 9);
        let q = Phaser.Math.Between(2, 10);
        let a = b * q;
        return this.format(`${a} ÷ ${b}`, q);
    }

    static format(q, ans) {
        let options = [ans];

        while (options.length < 4) {
            let fake = ans + Phaser.Math.Between(-10, 10);
            if (fake > 0 && !options.includes(fake)) options.push(fake);
        }

        Phaser.Utils.Array.Shuffle(options);

        return { question: q, options, answer: ans };
    }
}