import { Vector2 } from "@motion-canvas/core/lib/types";

function rotateVector(vector: Vector2, angle: number): Vector2 {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		x: vector.x * cos - vector.y * sin,
		y: vector.x * sin + vector.y * cos,
	};
}
