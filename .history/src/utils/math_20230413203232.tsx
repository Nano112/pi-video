import { Vector2 } from "@motion-canvas/core/lib/types";

function rotateVector(vector: Vector2, angle: number): Vector2 {
	return {
		x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
		y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
	};
}
