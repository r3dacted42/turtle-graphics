import { Primitive2D } from "../lib/primitive2d";

export default class CommandProcessor {
    constructor(scene, onPrimStart, onPrimEnd) {
        this.scene = scene;
        this.turtle = scene.turtle;
        this.currentPrimitive = null;
        this.onPrimStart = onPrimStart;
        this.onPrimEnd = onPrimEnd;
    }

    processCommand(cmd, state) {
        const tokens = cmd.split(' ');
        let res = false;
        switch (tokens[0]) {
            case 'pen': {
                if (tokens[1] === 'down') {
                    res = true;
                    this.currentPrimitive = new Primitive2D(`prim${this.scene.primitives.length}`);
                    this.currentPrimitive.addVertex(this.turtle.position[0], this.turtle.position[1]);
                    this.scene.add(this.currentPrimitive);
                    this.onPrimStart();
                } else if (tokens[1] === 'up') {
                    res = true;
                    this.currentPrimitive.fill = true;
                    this.currentPrimitive = null;
                    this.onPrimEnd();
                } else if (tokens[1] === 'reset') {
                    this.turtle.position = this.turtle.initPos;
                    res = true;
                    this.turtle.angle = 0;
                    this.turtle.forward(0);
                } else {
                    res = "!# invalid cmd";
                }
                break;
            }
            case 'forward': {
                const fwdAmount = Number.parseFloat(tokens[1]);
                if (isNaN(fwdAmount)) {
                    res = "!# err parsing fwd arg"
                } else {
                    this.turtle.forward(fwdAmount);
                    res = true;
                    if (this.currentPrimitive) {
                        if (state.lineModeChanged || state.fillModeChanged) {
                            this.currentPrimitive.setMode(state.lineMode, state.fillMode);
                            state.lineModeChanged = false;
                            state.fillModeChanged = false;
                        }
                        this.currentPrimitive.addVertex(this.turtle.position[0], this.turtle.position[1]);
                    }
                }
                break;
            }
            case 'turn': {
                const turnAmount = Number.parseFloat(tokens[1]);
                if (isNaN(turnAmount)) {
                    res = "!# err parsing turn arg"
                } else {
                    this.turtle.turn(turnAmount);
                    res = true;
                }
                break;
            }
            default: {
                res = "!# invalid cmd";
            }
        }
        return res;
    }
}