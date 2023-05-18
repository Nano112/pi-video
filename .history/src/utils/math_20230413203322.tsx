import { Vector2 } from "@motion-canvas/core/lib/types";

function rotateVector(vector: Vector2, angle: number): Vector2 {
	const x = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
	const y = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
	return new Vector2(x, y);
}
