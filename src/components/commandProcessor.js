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
            case 'pen': {
                if (tokens[1] === 'down') {
                    // start new primitive
                    this.setFeedback("new primitive");
                } else if (tokens[1] === 'up') {
                    // end primitive
                    this.setFeedback("end primitive");
                } else {
                    this.setFeedback("invalid cmd");
                }
                break;
            }
            case 'forward': {
                const fwdAmount = Number.parseFloat(tokens[1]);
                if (isNaN(fwdAmount)) {
                    this.setFeedback("err parsing fwd arg");
                } else {
                    this.turtle.forward(fwdAmount);
                    this.setFeedback(`forward ${fwdAmount}`);
                }
                break;
            }
            case 'turn': {
                const turnAmount = Number.parseFloat(tokens[1]);
                if (isNaN(turnAmount)) {
                    this.setFeedback("err parsing turn arg");
                } else {
                    this.turtle.turn(turnAmount);
                    this.setFeedback(`turn ${Math.abs(turnAmount)} ${turnAmount > 0 ? "ccw" : "cw"}`);
                }
                break;
            }
            default: {
                this.setFeedback("invalid cmd");
            }
        }
    }
}