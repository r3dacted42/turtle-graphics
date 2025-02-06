export default class CommandProcessor {
    constructor(turtle) {
        this.turtle = turtle;
        this.cmdInput = document.getElementById('cmd-input');
        this.cmdFeedback = document.getElementById('cmd-feedback');
        
        this.cmdInput.addEventListener("keydown", (e) => {
            if (e.key !== 'Enter') return;
            const cmd = String(this.cmdInput.value);
            if (cmd.length === 0) return;
            this.processCommand(cmd);
            this.cmdInput.value = "";
        });
    }

    setFeedback(s) {
        this.cmdFeedback.textContent = s;
    }

    processCommand(cmd) {
        const tokens = cmd.split(' ');
        switch (tokens[0]) {
            case 'forward': {
                const fwdAmount = Number.parseFloat(tokens[1]);
                if (isNaN(fwdAmount)) {
                    this.setFeedback("couldn't parse forward amount");
                } else {
                    this.turtle.forward(fwdAmount);
                    this.setFeedback(`moved forward by ${fwdAmount} units`);
                }
                break;
            }
            case 'turn': {
                const turnAmount = Number.parseFloat(tokens[1]);
                if (isNaN(turnAmount)) {
                    this.setFeedback("couldn't parse turn amount");
                } else {
                    this.turtle.turn(turnAmount);
                    this.setFeedback(`turned ${Math.abs(turnAmount)} degrees ${turnAmount > 0 ? "ccw" : "cw"}`);
                }
                break;
            }
            default: {
                this.setFeedback("invalid command");
            }
        }
    }
}