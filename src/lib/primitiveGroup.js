import Transform from "./transform";

export default class PrimitiveGroup {
    constructor(name, primitives, scene) {
        this.id = new Date().getTime();
        this.name = name;
        this.primitives = primitives;
        this.transform = new Transform();
        this.scene = scene;
    }

    hasPrimitive(primitive) {
        return (this.primitives.indexOf(primitive) !== -1);
    }

    activate() {
        for (const p of this.primitives) {
            p.activate();
        }
    }

    deactivate() {
        for (const p of this.primitives) {
            p.deactivate();
        }
    }

    isEquivalent(group) {
        if (group.length !== this.primitives.length) return false;
        for (const p of this.primitives) {
            if (group.indexOf(p) === -1) return false;
        }
        return true;
    }

    getGroupCentroid() {
		const centroid = [0, 0];
		for (const prim of this.primitives) {
            const tc = this.scene.getTransformedCentroid(prim, this);
			centroid[0] += tc[0];
			centroid[1] += tc[1];
		}
		centroid[0] /= this.primitives.length;
		centroid[1] /= this.primitives.length;
		return centroid;
	}

    updateTransformMatrix() {
		this.transform.updateTransformMatrix(this.getGroupCentroid());
	}
}