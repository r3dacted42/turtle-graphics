import Primitive2D from "../lib/primitive2d";

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
                if (!this.turtle.hidden && tokens[1] === 'down') {
                    if (this.currentPrimitive !== null) break;
                    res = true;
                    this.currentPrimitive = new Primitive2D(`prim${this.scene.primitives.length}`);
                    if (state.lineMode != this.currentPrimitive.currentMode.lineMode 
                        || state.fillMode != this.currentPrimitive.currentMode.fillMode) {
                        this.currentPrimitive.setMode(state.lineMode, state.fillMode);
                    }
                    this.currentPrimitive.addVertex(this.turtle.position[0], this.turtle.position[1]);
                    this.scene.add(this.currentPrimitive);
                    this.onPrimStart();
                } else if (!this.turtle.hidden && tokens[1] === 'up') {
                    if (this.currentPrimitive === null) break;
                    if (this.currentPrimitive.getVertCount() === 1) {
                        res = "!# discarded";
                        this.scene.remove(this.currentPrimitive);
                        this.currentPrimitive = null;
                        this.onPrimEnd(null);
                        break;
                    }
                    res = true;
                    this.currentPrimitive.fill = true;
                    this.onPrimEnd(this.currentPrimitive);
                    this.currentPrimitive = null;
                } else if (tokens[1] === 'reset') {
                    if (this.currentPrimitive !== null) break;
                    res = true;
                    this.turtle.position = [
                        this.turtle.initPos[0],
                        this.turtle.initPos[1],
                    ];
                    this.turtle.angle = 0;
                    this.turtle.forward(0);
                    this.turtle.hidden = false;
                } else if (!this.turtle.hidden && tokens[1] === 'hide') {
                    if (this.currentPrimitive !== null) break;
                    this.turtle.hidden = true;
                    res = true;
                } else if (this.turtle.hidden && tokens[1] === 'show') {
                    this.turtle.hidden = false;
                    res = true;
                }
                break;
            }
            case 'forward': {
                if (this.turtle.hidden) break;
                const fwdAmount = Number.parseFloat(tokens[1]);
                if (isNaN(fwdAmount)) {
                    res = "!# err parsing fwd arg";
                } else {
                    this.turtle.forward(fwdAmount);
                    res = true;
                    if (this.currentPrimitive) {
                        if (state.lineMode != this.currentPrimitive.currentMode.lineMode 
                            || state.fillMode != this.currentPrimitive.currentMode.fillMode) {
                            this.currentPrimitive.setMode(state.lineMode, state.fillMode);
                        }
                        this.currentPrimitive.addVertex(this.turtle.position[0], this.turtle.position[1]);
                    }
                }
                break;
            }
            case 'turn': {
                if (this.turtle.hidden) break;
                const turnAmount = Number.parseFloat(tokens[1]);
                if (isNaN(turnAmount)) {
                    res = "!# err parsing turn arg";
                } else {
                    this.turtle.turn(turnAmount);
                    res = true;
                }
                break;
            }
            case 'repeat': {
                if (this.turtle.hidden) break;
                const repeatAmount = Number.parseInt(tokens[1]);
                if (isNaN(repeatAmount)) {
                    res = "!# err parsing repeat arg";
                } else if (tokens[2] === '{' && tokens[3] === 'forward' && tokens[5] === 'turn' && tokens[7] === '}') {
                    const fwdAmount = Number.parseFloat(tokens[4]);
                    const turnAmount = Number.parseFloat(tokens[6]);
                    if (!(isNaN(fwdAmount) && isNaN(turnAmount))) {
                        res = true;
                        const fwdCmd = `forward ${fwdAmount}`;
                        const turnCmd = `turn ${turnAmount}`;
                        for (let i = 0; i < repeatAmount; i++) {
                            this.processCommand(fwdCmd, state);
                            this.processCommand(turnCmd, state);
                        }
                    }
                }
                break;
            }
        }
        return res === false ? "!# invalid cmd" : res;
    }
}