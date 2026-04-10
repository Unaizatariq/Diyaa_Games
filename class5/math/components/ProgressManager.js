export default class ProgressManager {

    static getXP() {
        return parseInt(localStorage.getItem('xp')) || 0;
    }

    static addXP(amount) {
        let xp = this.getXP() + amount;
        localStorage.setItem('xp', xp);
    }

    static isLevelUnlocked(level) {
        let xp = this.getXP();

        if (level === 1) return true;
        if (level === 2) return xp >= 50;

        return false;
    }
}