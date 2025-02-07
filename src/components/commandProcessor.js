import { Primitive2D } from "../lib/primitive2d";

export default class CommandProcessor {
    constructor(scene, onPrimEnd) {
        this.scene = scene;
        this.turtle = scene.turtle;
        this.cmdInput = document.getElementById('cmd-input');
        this.cmdFeedback = document.getElementById('cmd-feedback');
        
        this.cmdInput.addEventListener("keydown", (e) => {
            if (e.key !== 'Enter') return;
            const cmd = String(this.cmdInput.value);
            if (cmd.length === 0) return;
            this.processCommand(cmd);
            this.cmdInput.value = "";
        });

        this.currentPrimitive = null;
        this.onPrimEnd = onPrimEnd;
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
                    this.currentPrimitive = new Primitive2D(`prim${this.scene.primitives.length}`);
                    this.currentPrimitive.addVertex(this.turtle.position[0], this.turtle.position[1]);
                    this.scene.add(this.currentPrimitive);
                } else if (tokens[1] === 'up') {
                    // end primitive
                    this.setFeedback("end primitive");
                    this.currentPrimitive.fill = true;
                    this.currentPrimitive = null;
                    this.onPrimEnd();
                } else if (tokens[1] === 'reset') {
                    this.turtle.position = this.turtle.initPos;
                    this.setFeedback("turtle position reset");
                    this.turtle.angle = 0;
                    this.turtle.forward(0);
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
                    if (this.currentPrimitive) {
                        this.currentPrimitive.addVertex(this.turtle.position[0], this.turtle.position[1]);
                    }
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