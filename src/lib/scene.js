export class Scene
{
	constructor(turle)
	{
		this.primitives = []
		this.turtle = turle;
	}

	add(primitive)
	{
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
            console.log(this.primitives)
		}
	}

    remove(primitive) 
	{
		if (this.primitives && primitive) {
			let index = this.primitives.indexOf(primitive);
			if (index > -1) {
				this.primitives.splice(index, 1);
			}
		}
	}

	getPrimitives() 
	{
		return [...this.primitives, this.turtle];
	}


	getPrimitive(index) 
	{
		return this.primitives[index];
	}


	getPrimitiveIndex(primitive) 
	{
		return this.primitives.indexOf(primitive);
	}
}
