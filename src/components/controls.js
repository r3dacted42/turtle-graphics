import { Pane } from "tweakpane";
import CommandProcessor from "./commandProcessor";
import { drawModes } from "../lib/drawModes";

export default class Controls {
    constructor(scene) {
        this.scene = scene;
        const pane = new Pane({
            title: "primitives",
            expanded: true,
            container: document.getElementById("prim"),
        });
        this.pane = pane;
        this.state = {
            primitive: -1,
            lastPrim: -1,
        };
        this.primBinding = pane.addBinding(
            this.state, 'primitive',
            {
                options: this.getPrimitiveOptions(),
                label: undefined,
            }
        );
        this.primBinding.on('change', (e) => {
            if (this.state.lastPrim !== -1) {
                this.scene.primitives[this.state.lastPrim]?.deactivate();
            }
            const newIdx = e.value;
            if (newIdx === this.scene.primitives.length) {
                // select all
            } else {
                this.showPrimitiveControls(e.value);
                this.state.lastPrim = e.value;
            }
        });
        this.cmdPane = new Pane({
            title: "command",
            expanded: true,
            container: document.getElementById("cmd"),
        });
        this.showCommandProc();
    }

    getPrimitiveOptions() {
        return {
            none: -1,
            ...this.scene.primitives.reduce((acc, p, i) => {
                acc[p.name] = i;
                return acc;
            }, {}),
            all: this.scene.primitives.length,
        }
    }

    updatePrimitiveOptions() {
        this.primBinding.options = Object.entries(this.getPrimitiveOptions())
            .map(([key, value]) => ({
                text: key,
                value: value
            }));
    }

    showPrimitiveControls(idx) {
        if (this.controls) {
            this.pane.remove(this.controls);
        }
        if (idx === -1) return;
        const primitive = this.scene.primitives[idx];
        primitive.activate();
        this.controls = this.pane.addFolder({
            title: "primitive controls",
        });
        const nameBinding = this.controls.addBinding(primitive, 'name');
        nameBinding.on('change', () => {
            this.updatePrimitiveOptions();
        });
        const deleteButton = this.controls.addButton({
            title: "delete",
        });
        deleteButton.on("click", () => {
            this.scene.remove(primitive);
            this.updatePrimitiveOptions();
            this.state.primitive = idx - 1;
            this.primBinding.refresh();
            this.showPrimitiveControls(idx - 1);
        });
        const moveUpButton = this.controls.addButton({
            title: "move up",
            disabled: (idx === 0),
        });
        moveUpButton.on("click", () => {
            const newIdx = this.scene.movePrimitive(this.state.primitive, -1);
            this.updatePrimitiveOptions();
            this.state.primitive = newIdx;
            this.primBinding.refresh();
            this.showPrimitiveControls(newIdx);
        });
        const moveDownButton = this.controls.addButton({
            title: "move down",
            disabled: (idx === this.scene.primitives.length - 1),
        });
        moveDownButton.on("click", () => {
            const newIdx = this.scene.movePrimitive(this.state.primitive, +1);
            this.updatePrimitiveOptions();
            this.state.primitive = newIdx;
            this.primBinding.refresh();
            this.showPrimitiveControls(newIdx);
        });
        const tabs = this.controls.addTab({
            pages: [
                { title: "color" },
                { title: "transform" },
            ],
        });
        tabs.pages[0].addBinding(primitive, 'fill');
        tabs.pages[0].addBinding(primitive, 'fillColor', {
            view: 'color',
            label: 'fill color',
            color: { alpha: true },
        });
        tabs.pages[0].addBinding(primitive, 'lineColor', {
            view: 'color',
            label: 'line color',
            color: { alpha: true },
        });
        const transformPage = tabs.pages[1];
        transformPage.addBinding(primitive.transform, 'translate', {
            min: -750,
            max: 750,
        });
        transformPage.addBinding(primitive.transform, 'scale', {
            min: 0,
            max: 10,
        });
        transformPage.addBinding(primitive.transform, 'rotationAngle', {
            label: 'rotate',
            min: -180,
            max: 180,
        });
    }

    refreshList() {
        this.primBinding.options = Object.entries(this.getPrimitiveOptions())
            .map(([key, value]) => ({
                text: key,
                value: value
            }));
        this.primBinding.refresh();
    }

    showCommandProc() {
        this.cmdInput = this.cmdPane.addBlade({
            view: 'text',
            parse: (v) => String(v),
            value: '',
        });
        const cmdInputElem = this.cmdInput.element.getElementsByTagName('input')[0];
        cmdInputElem.focus();
        this.cmdFolder = this.cmdPane.addFolder({
            title: 'command pallete',
            expanded: false,
        });
        this.cmdFolder.addButton({
            title: 'pen down',
        }).on('click', () => {
            cmdInputElem.focus();
            this.cmdInput.value = 'pen down';
        });
        this.cmdFolder.addButton({
            title: 'pen up',
        }).on('click', () => {
            cmdInputElem.focus();
            this.cmdInput.value = 'pen up';
        });
        this.cmdFolder.addButton({
            title: 'pen reset',
        }).on('click', () => {
            cmdInputElem.focus();
            this.cmdInput.value = 'pen reset';
        });
        this.cmdFolder.addButton({
            title: 'pen hide',
        }).on('click', () => {
            cmdInputElem.focus();
            this.cmdInput.value = 'pen hide';
        });
        this.cmdFolder.addButton({
            title: 'pen show',
        }).on('click', () => {
            cmdInputElem.focus();
            this.cmdInput.value = 'pen show';
        });
        this.cmdFolder.addButton({
            title: 'forward $FARG',
        }).on('click', () => {
            cmdInputElem.focus();
            cmdInputElem.value = 'forward $FARG';
            cmdInputElem.setSelectionRange(8, 13);
        });
        this.cmdFolder.addButton({
            title: 'turn $TARG',
        }).on('click', () => {
            cmdInputElem.focus();
            cmdInputElem.value = 'turn $TARG';
            cmdInputElem.setSelectionRange(5, 13);
        });
        this.cmdFolder.addButton({
            title: 'repeat $RARG { forward $FARG turn $TARG }',
        }).on('click', () => {
            cmdInputElem.focus();
            cmdInputElem.value = 'repeat $RARG { forward $FARG turn $TARG }';
            cmdInputElem.setSelectionRange(7, 12);
        });
        cmdInputElem.addEventListener('keydown', (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
                const pos = cmdInputElem.value.indexOf("$");
                cmdInputElem.setSelectionRange(pos, pos + 5);
            }
        });
        this.cmdState = {
            primNameInp: null,
            fillCheckBox: null,
            separator: null,
            lineMode: drawModes().lstrip,
            fillMode: drawModes().tfan,
        };
        this.cmdPane.addBinding(
            this.cmdState, 'lineMode',
            {
                label: "line mode",
                options: {
                    line_strip: drawModes().lstrip,
                    line_loop: drawModes().lloop,
                    lines: drawModes().lines,
                }
            }
        );
        this.cmdPane.addBinding(
            this.cmdState, 'fillMode',
            {
                label: "fill mode",
                options: {
                    triangle_fan: drawModes().tfan,
                    triangle_strip: drawModes().tstrip,
                    triangles: drawModes().triangles,
                }
            }
        );
        const commandProcessor = new CommandProcessor(this.scene,
            () => {
                this.cmdState.primNameInp = this.cmdPane.addBinding(commandProcessor.currentPrimitive, 'name', {
                    index: 0,
                });
                this.cmdState.fillCheckBox = this.cmdPane.addBinding(commandProcessor.currentPrimitive, 'fill', {
                    index: 1,
                });
                this.cmdState.separator = this.cmdPane.addBlade({
                    index: 2,
                    view: 'separator',
                });
            },
            () => {
                this.cmdPane.remove(this.cmdState.primNameInp);
                this.cmdPane.remove(this.cmdState.fillCheckBox);
                this.cmdPane.remove(this.cmdState.separator);
                this.refreshList();
            },
        );
        this.cmdInput.on('change', (e) => {
            if (e.value.length > 0 && !e.value.startsWith("!#")) {
                const res = commandProcessor.processCommand(e.value, this.cmdState);
                if (res === true) {
                    this.cmdInput.value = "";
                } else {
                    this.cmdInput.value = res;
                    cmdInputElem.setSelectionRange(0, res.length + 1);
                }
            }
        });
    }
}