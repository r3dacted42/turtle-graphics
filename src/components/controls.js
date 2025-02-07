import { Pane } from "tweakpane";

export default class Controls {
    constructor(scene) {
        this.scene = scene;
        const pane = new Pane({
            title: 'controls pane',
            expanded: true,
        });
        this.pane = pane;
        this.state = {
            primitive: -1,
        };
        this.primBinding = pane.addBinding(
            this.state, 'primitive',
            {
                options: this.getPrimitiveOptions(),
                label: "primitive",
            }
        );
        this.primBinding.on('change', (e) => {
            console.log("active index:", e.value);
            this.showPrimitiveControls(e.value);
        });
    }

    getPrimitiveOptions() {
        return {
            None: -1,
            ...this.scene.primitives.reduce((acc, p, i) => {
                acc[p.name] = i;
                return acc;
            }, {}),
        }
    }

    showPrimitiveControls(idx) {
        if (this.controls) this.pane.remove(this.controls);
        if (idx === -1) return;
        const primitive = this.scene.primitives[idx];
        this.controls = this.pane.addFolder({
            title: "primitive controls",
        });
        const nameBinding = this.controls.addBinding(primitive, 'name');
        nameBinding.on('change', () => {
            this.primBinding.options = Object.entries(this.getPrimitiveOptions())
                .map(([key, value]) => ({
                    text: key,
                    value: value
                }));
        });
        const deleteButton = this.controls.addButton({
            title: "delete",
            label: "",
        });
        deleteButton.on("click", () => {
            this.scene.remove(primitive);
            this.primBinding.options = Object.entries(this.getPrimitiveOptions())
                .map(([key, value]) => ({
                    text: key,
                    value: value
                }));
            this.state.primitive = idx - 1;
            this.primBinding.refresh();
            this.showPrimitiveControls(idx - 1);
            return;
        });
        const tabs = this.controls.addTab({
            pages: [
                { title: "color" },
                { title: "transform" },
            ],
        });
        tabs.pages[0].addBinding(primitive, 'fillColor', {
            view: 'color',
            label: 'fill',
            color: { alpha: true },
        });
        tabs.pages[0].addBinding(primitive, 'lineColor', {
            view: 'color',
            label: 'line',
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
}