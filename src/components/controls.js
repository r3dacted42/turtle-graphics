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
        this.selectionIdx = -1;
        this.primBinding = pane.addBinding(
            this, 'selectionIdx',
            {
                options: this.getSelectionOptions(),
                label: undefined,
            }
        );
        this.onSelectionChange = (newIdx) => {
            console.log(newIdx);
            for (const prim of this.scene.primitives) {
                prim.deactivate();
            }
            if (newIdx === -1) {
                this.selection = null;
                this.showSelectionControls();
            }
            const all = newIdx === -2;
            this.selection = all ? this.scene : this.scene.getSelectables()[newIdx];
            this.showSelectionControls(all);
        }
        this.primBinding.on('change', (e) => {
            this.onSelectionChange(e.value);
        });
        this.cmdPane = new Pane({
            title: "command",
            expanded: true,
            container: document.getElementById("cmd"),
        });
        this.showCommandProc();
    }

    getSelectionOptions() {
        const selectables = this.scene.getSelectables();
        const options = {
            none: -1,
            ...selectables.reduce((acc, p, i) => {
                acc[p.name] = i;
                return acc;
            }, {}),
        }
        if (this.scene.primitives.length > 1) {
            options['all'] = -2;
        }
        return options;
    }

    updateSelectionOptions() {
        this.primBinding.options = Object.entries(this.getSelectionOptions())
            .map(([key, value]) => ({
                text: key,
                value: value
            }));
        this.primBinding.refresh();
    }

    setSelection(obj) {
        if (!obj) {
            this.selectionIdx = -1;
        } else if (obj === this.scene) {
            this.selectionIdx = -2;
        } else {
            this.selectionIdx = this.scene.getSelectables().indexOf(obj);
        }
        this.onSelectionChange(this.selectionIdx);
        this.updateSelectionOptions();
    }

    showSelectionControls(all = false) {
        if (this.controls) {
            this.pane.remove(this.controls);
            this.controls.dispose();
        }
        if (!this.selection) return;
        this.selection.activate();
        this.controls = this.pane.addFolder({
            title: "primitive controls",
        });
        if (!all) {
            const nameBinding = this.controls.addBinding(this.selection, 'name');
            nameBinding.on('change', () => {
                this.updateSelectionOptions();
            });
        }
        this.controls.addButton({
            title: all ? "delete all" : "delete",
        }).on("click", () => {
            if (all) {
                this.scene.primitives = [];
                this.scene.groups = [];
                this.selectionIdx = -1;
            } else {
                this.scene.remove(this.selection);
                this.selectionIdx--;
            }
            this.updateSelectionOptions();
            this.primBinding.refresh();
            this.showSelectionControls();
        });
        const isPrimitive = this.scene.primitives.indexOf(this.selection) !== -1;
        if (isPrimitive) {
            const idx = this.scene.primitives.indexOf(this.selection);
            this.controls.addButton({
                title: "move up",
                disabled: (idx === 0),
            }).on("click", () => {
                const newIdx = this.scene.movePrimitive(this.selectionIdx, -1);
                this.updateSelectionOptions();
                this.selectionIdx = newIdx;
                this.primBinding.refresh();
                this.showSelectionControls();
            });
            this.controls.addButton({
                title: "move down",
                disabled: (idx === this.scene.primitives.length - 1),
            }).on("click", () => {
                const newIdx = this.scene.movePrimitive(this.selectionIdx, +1);
                this.updateSelectionOptions();
                this.selectionIdx = newIdx;
                this.primBinding.refresh();
                this.showSelectionControls();
            });
        }
        const tabs = this.controls.addTab({
            pages: [
                { title: "transform" },
                ...(!isPrimitive ? [] : [{ title: "color" }]),
            ],
        });
        const transformPage = tabs.pages[0];
        transformPage.addBinding(this.selection.transform, 'translate', {
            min: -750,
            max: 750,
        });
        transformPage.addBinding(this.selection.transform, 'scale', {
            min: -10,
            max: 10,
        });
        transformPage.addBinding(this.selection.transform, 'rotationAngle', {
            label: 'rotate',
            min: -180,
            max: 180,
        });
        transformPage.addButton({ title: 'reset' })
            .on('click', () => {
                this.selection.transform.translate = { x: 0, y: 0 };
                this.selection.transform.scale = { x: 1, y: 1 };
                this.selection.transform.rotationAngle = 0;
                transformPage.children.forEach(c => {
                    if (c.refresh) c.refresh();
                });
            });
        if (isPrimitive) {
            const colorPage = tabs.pages[1];
            colorPage.addBinding(this.selection, 'fill');
            colorPage.addBinding(this.selection, 'fillColor', {
                view: 'color',
                label: 'fill color',
            });
            colorPage.addBinding(this.selection, 'lineColor', {
                view: 'color',
                label: 'line color',
            });
        }
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
            (prim) => {
                this.cmdPane.remove(this.cmdState.primNameInp);
                this.cmdPane.remove(this.cmdState.fillCheckBox);
                this.cmdPane.remove(this.cmdState.separator);
                this.setSelection(prim);
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