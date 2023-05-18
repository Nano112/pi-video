function rotateVector(vector: Vector, angle: number): Vector {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		x: vector.x * cos - vector.y * sin,
		y: vector.x * sin + vector.y * cos,
	};
}
