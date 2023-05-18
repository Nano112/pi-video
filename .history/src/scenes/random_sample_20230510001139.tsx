import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
	Node,
	Circle,
	Grid,
	Line,
	Rect,
	Txt,
	Latex,
	Layout,
} from "@motion-canvas/2d/lib/components";
import { all, waitFor } from "@motion-canvas/core/lib/flow";
import { Color, Vector2 } from "@motion-canvas/core/lib/types";
import { createRef, useDuration } from "@motion-canvas/core/lib/utils";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { waitUntil } from "@motion-canvas/core/lib/flow";
import {
	easeInOutCubic,
	easeInOutElastic,
	easeInOutQuad,
	easeInOutQuart,
	easeInOutQuint,
	easeInOutSine,
	easeOutBounce,
	easeOutCubic,
	easeOutElastic,
	easeOutQuint,
} from "@motion-canvas/core/lib/tweening";
import { CircleSegment } from "@motion-canvas/2d/lib/curves";
import rotateVector from "../utils/math";
const RED = "#F7655E";
const TRANS_RED = "#F7655E55";
const GREEN = "#99C47A";
const TRANS_GREEN = "#99C47A55";
const BLUE = "#68ABDF";
const WHITE = "#fff";
const GRAY = "#444";
const DARK_GRAY = "#141414";
const LESS_DARK_GRAY = "#242424";

export default makeScene2D(function* (view) {
	const group = createRef<Node>();
	const layoutRef = createRef<Layout>();
	const layoutGap = createSignal(0);
	const layoutRadius = createSignal(0);
	const samplingArea = createRef<Layout>();
	const colB = createRef<Layout>();

	const xWidth = createSignal(2000);
	const yHeight = createSignal(2000);
	const scale = createSignal(0);
	const scaleX = createSignal(1);
	const scaleY = createSignal(1);
	const angleY = createSignal(0);
	const position = Vector2.createSignal(() => new Vector2(-xWidth() / 2, 0));
	const randomX = createSignal(Math.random());
	const randomY = createSignal(0);

	const endX = createSignal(() => xWidth() * scale() * scaleX());
	const endY = createSignal(() => yHeight() * scale() * scaleY());

	const zeroLabelPosition = Vector2.createSignal(() => new Vector2(0, -80));
	const xOneLabelPosition = Vector2.createSignal(
		() => new Vector2(endX(), -80)
	);
	// angle the label based on the angle of the y axis
	const yOneLabelPosition = Vector2.createSignal(() =>
		rotateVector(Vector2.right.scale(endX()), angleY()).add(new Vector2(0, -80))
	);

	const randomXPos = createSignal(
		() => randomX() * xWidth() * scale() * scaleX()
	);
	const randomYPos = createSignal(
		() => -randomY() * yHeight() * scale() * scaleY()
	);
	const randomPointRadius = createSignal(0);
	const randomPointLineWidth = createSignal(0);
	const randomPointColor = createSignal(new Color(RED));
	const quandrantStrokeWidth = createSignal(0);

	const randomPointText = createSignal(() => {
		const x = randomX().toFixed(2);
		const y = randomY().toFixed(2);
		if (x == "0.00" && y == "0.00") {
			return ``;
		}
		if (y == "0.00") {
			return `(${x})`;
		}
		if (x == "0.00") {
			return `(${y})`;
		}
		return `(${x}, ${y})`;
	});

	yield* view.add(
		<Rect
			layout
			gap={layoutGap}
			width={view.width}
			height={view.height}
			padding={layoutGap}
			direction="row"
			ref={layoutRef}
			fill={DARK_GRAY}
		></Rect>
	);

	view.add(
		<Node ref={group} position={position}>
			{/* grid between arrows */}
			{/* <Grid width={3840} height={2160} spacing={100} stroke={"#444"} /> */}
			<Rect
				layout
				width={() => endX()}
				height={() => endY() * Math.sin(-angleY())}
				fill={LESS_DARK_GRAY}
				position={() =>
					new Vector2(
						endX() / 2,
						-endY() / 2 + ((1 - Math.sin(-angleY())) * endY()) / 2
					)
				}
				zIndex={-1}
				radius={50}
				clip={true}
			>
				<Grid
					stroke={"#BBB"}
					lineDash={[10, 10]}
					spacing={100}
					width={() => endX()}
					height={() => endY()}
					position={() => new Vector2(endX() / 2, -endY() / 2)}
					zIndex={-1}
				/>
			</Rect>
			<Line
				stroke={WHITE}
				lineWidth={8}
				arrowSize={() => 20 * scale()}
				endArrow={true}
				points={[0, () => Vector2.right.scale(endX())]}
			/>
			<Line
				stroke={WHITE}
				lineWidth={8}
				arrowSize={() => 20 * scale()}
				startArrow={true}
				// points={[() => Vector2.up.scale(-endY()), 0]}
				points={[() => rotateVector(Vector2.right.scale(endX()), angleY()), 0]}
			/>
			<Circle
				fill={WHITE}
				width={() => 40 * scale()}
				height={() => 40 * scale()}
				x={() => 0}
				y={() => 0}
			/>

			<Txt
				text="0"
				fill={WHITE}
				fontSize={() => 100 * scale() * scaleX()}
				fontFamily={"Poppins"}
				position={() => zeroLabelPosition()}
			/>

			<Txt
				text="1"
				fill={WHITE}
				fontSize={() => 100 * scale() * scaleX()}
				fontFamily={"Poppins"}
				position={() => xOneLabelPosition()}
			/>
			<Txt
				text="1"
				fill={WHITE}
				fontSize={() => 100 * scale() * scaleY()}
				fontFamily={"Poppins"}
				position={() => yOneLabelPosition()}
			/>

			<Circle
				fill={() => randomPointColor()}
				width={() => randomPointRadius()}
				height={() => randomPointRadius()}
				x={() => randomXPos()}
				y={() => randomYPos()}
				zIndex={101}
			/>

			<Node>
				<Txt
					text={() => randomPointText()}
					fill={WHITE}
					fontSize={() => randomPointRadius() * scale()}
					fontFamily={"Poppins"}
					position={() =>
						new Vector2(randomXPos(), randomYPos()).add(
							new Vector2(0, -80 * scale())
						)
					}
					zIndex={100}
				/>
			</Node>

			<Line
				stroke={BLUE}
				lineWidth={() => randomPointLineWidth()}
				points={[
					() => new Vector2(randomXPos(), 0),
					() => new Vector2(randomXPos(), randomYPos()),
				]}
			/>
			<Line
				stroke={BLUE}
				lineWidth={() => randomPointLineWidth()}
				points={[
					() => new Vector2(0, randomYPos()),
					() => new Vector2(randomXPos(), randomYPos()),
				]}
			/>
			<Circle
				x={() => 0}
				y={() => 0}
				width={() => endX() * 2}
				height={() => endY() * 2}
				stroke={RED}
				lineWidth={() => quandrantStrokeWidth()}
				startAngle={-90}
				endAngle={0}
			/>
		</Node>
	);

	yield* all(scale(1, useDuration("endExpand"), easeInOutCubic));
	yield* waitUntil("startRandom");
	yield* randomPointRadius(100, 1, easeInOutCubic);

	const numberOfPointsToGenerate = 3;
	for (let i = 0; i < numberOfPointsToGenerate; i++) {
		yield* randomX(Math.random(), 1, easeInOutCubic);
		yield* waitUntil("x_point_" + i);
	}

	yield* waitUntil("endXRandomPoints");
	yield* all(
		zeroLabelPosition(() => new Vector2(-50, 0), 1, easeOutQuint),
		xOneLabelPosition(() => new Vector2(endX() + 20, 0), 1, easeOutQuint),
		angleY(-Math.PI / 2, 2, easeOutQuint),
		position(new Vector2(-xWidth() / 2, yHeight() / 2), 2, easeOutQuint),
		scale(0.9, 2, easeOutQuint)
	);

	yield* waitFor(1);

	// yield* all(randomY(Math.random(), 1, easeInOutCubic));
	const numberOfXYPointsToGenerate = 3;
	const moveTime = 2;
	yield* randomPointLineWidth(4, 1, easeInOutCubic);

	for (let i = 0; i < numberOfXYPointsToGenerate; i++) {
		yield* all(
			randomY(Math.random(), moveTime, easeInOutCubic),
			randomX(Math.random(), moveTime, easeInOutCubic)
		);
		yield* waitUntil("xy_point_" + i);
	}
	const distanceLength = createSignal(0);
	group().add(
		new Node({
			zIndex: 102,
			children: [
				new Line({
					stroke: WHITE,
					lineWidth: () => randomPointLineWidth() * scale(),
					endArrow: true,
					points: [
						() => new Vector2(0, 0),
						() =>
							new Vector2(randomXPos(), randomYPos()).scale(distanceLength()),
					],
					lineDash: [10, 10],
				}),
				new Txt({
					text: () =>
						"d = " + Math.sqrt(randomX() ** 2 + randomY() ** 2).toFixed(2),
					fill: WHITE,
					fontSize: () =>
						0.5 * randomPointRadius() * scale() * distanceLength(),
					fontFamily: "Poppins",
					rotation: () =>
						Math.atan2(randomYPos(), randomXPos()) * (180 / Math.PI),
					position: () =>
						new Vector2(randomXPos(), randomYPos())
							.scale(0.5)
							.scale(distanceLength())
							.add(
								rotateVector(
									new Vector2(0, -40 * scale()),
									Math.atan2(randomYPos(), randomXPos())
								)
							),
				}),
			],
		})
	);

	yield* waitUntil("createQuandrant");

	yield* all(
		quandrantStrokeWidth(4, 1, easeInOutCubic),
		distanceLength(1, 1, easeInOutCubic)
	);
	yield* waitFor(1);

	yield* waitUntil("startSimulation");

	const pointsInsideQuandrant = createSignal(0);
	const totalPoints = createSignal(0);
	yield* position(
		new Vector2(-0.8 * xWidth(), yHeight() / 2),
		1,
		easeInOutCubic
	);
	const latexPosition = createSignal(
		() =>
			new Vector2(1.3 * xWidth() + 100 * scale(), 0.55 * -yHeight() * scale())
	);

	group().add(
		new Latex({
			tex: () =>
				"\\color{white} \\pi \\approx 4 \\cdot \\frac{" +
				pointsInsideQuandrant() +
				"}{" +
				totalPoints() +
				"} = " +
				((4 * pointsInsideQuandrant()) / totalPoints()).toFixed(3),

			// y: () => -yHeight() * scale() * 0.9,
			// x: () => 1.3 * xWidth() + 100 * scale(),
			position: () => latexPosition(),
			width: () => 1500 * scale(),
		})
	);

	const graphScale = createSignal(0);
	const graphHeight = 1000;
	const graphWidth = 1200;
	const graphPosition = createSignal(
		() => new Vector2(1.5 * xWidth() * scale(), -yHeight() * scale() * 0.4)
	);
	const piPoints = createSignal([]);
	const sampleIterations = 3000;

	group().add(
		new Node({
			zIndex: 102,
			position: () => graphPosition(),
			children: [
				new Line({
					stroke: GREEN,
					lineWidth: () => 5 * scale() * graphScale(),
					points: () => {
						const points = piPoints();
						return points.map(
							(p) =>
								new Vector2(
									(p.x / sampleIterations) * graphWidth -
										(graphWidth / 2) * graphScale(),
									Math.max(
										Math.min(
											(p.y + Math.PI) * graphScale() * graphHeight,
											(graphHeight * graphScale()) / 2 - 40
										),
										(-graphHeight * graphScale()) / 2 + 40
									)
								)
						);
					},
				}),
				new Line({
					stroke: RED,
					lineWidth: () => 5 * scale() * graphScale(),
					points: [
						() =>
							new Vector2(
								(-graphWidth / 2) * graphScale(),
								-Math.PI * graphScale()
							),
						() =>
							new Vector2(
								(graphWidth / 2) * graphScale(),
								-Math.PI * graphScale()
							),
					],
				}),
				// pi label
				// new Txt({
				// 	text: () => "π",
				// fill: RED,
				// 	fontSize: () => 100 * scale() * graphScale(),
				// 	fontFamily: "Poppins",
				// 	position: () =>
				// 		new Vector2(
				// 			(-graphWidth / 2) * graphScale() - 60 * scale() * graphScale(),
				// 			-Math.PI * graphScale()
				// 		),
				// }),
				// use Latex instead
				new Latex({
					// use RED constant instead of "red"
					tex: () => "\\color{" + RED + "} \\pi",
					position: () =>
						new Vector2(
							(-graphWidth / 2) * graphScale() - 60 * scale() * graphScale(),
							-Math.PI * graphScale()
						),
					width: () => 100 * scale() * graphScale(),
				}),

				new Rect({
					stroke: WHITE,
					lineWidth: () => 5 * scale() * graphScale(),
					width: () => graphWidth * graphScale(),
					height: () => graphHeight * graphScale(),
					x: () => 0,
					y: () => 0,
					radius: () => 40 * scale(),
					fill: () => LESS_DARK_GRAY,
					zIndex: -1,
				}),

				// <Grid
				// 	stroke={"#BBB"}
				// 	lineDash={[10, 10]}
				// 	spacing={100}
				// 	width={() => graphWidth * graphScale()}
				// 	height={() => graphHeight * graphScale()}
				// 	x={() => 0}
				// 	y={() => 0}
				// 	zIndex={-1}
				// />,
				new Grid({
					stroke: "#BBB",
					lineDash: [10, 10],
					spacing: 90,
					width: () => graphWidth * graphScale(),
					height: () => graphHeight * graphScale(),
					x: () => 0,
					y: () => 0,
					zIndex: -1,
				}),
			],
		})
	);

	var timeBase = 0.2;
	const randomSampleRadius = createSignal(100);
	for (let i = 0; i < sampleIterations; i++) {
		var ratio = i / sampleIterations;

		const x = Math.random();
		const y = Math.random();

		if (ratio <= 0.005) {
			yield* all(
				randomY(y, timeBase, easeInOutCubic),
				randomX(x, timeBase, easeInOutCubic)
			);
		}
		const distance = Math.sqrt(x * x + y * y);

		const inside = distance <= 1;
		const circle = new Circle({
			x: x * xWidth() * scale() * scaleX(),
			y: -y * yHeight() * scale() * scaleY(),
			width: () => randomSampleRadius() * scale(),
			height: () => randomSampleRadius() * scale(),
			fill: inside ? TRANS_GREEN : TRANS_RED,
			zIndex: -1,
		});
		randomPointColor(
			randomPointColor().lerp(inside ? GREEN : RED, 0.1),
			timeBase,
			easeInOutCubic
		);
		group().add(circle);
		if (inside) {
			pointsInsideQuandrant(pointsInsideQuandrant() + 1);
		}
		totalPoints(totalPoints() + 1);
		var piApproximation = (4 * pointsInsideQuandrant()) / totalPoints();
		var piXpos = i;
		var piYpos = -piApproximation;
		const newPoint = new Vector2(piXpos, piYpos);

		piPoints([...piPoints(), newPoint]);

		if (ratio === 0.005) {
			timeBase = 0.001;
			yield* all(
				graphScale(1, 1, easeInOutCubic),
				latexPosition(
					new Vector2(
						1.3 * xWidth() + 100 * scale(),
						0.9 * -yHeight() * scale()
					),

					1,
					easeInOutCubic
				),
				randomSampleRadius(30, 0.5, easeInOutCubic),
				randomY(0, 1, easeInOutCubic),
				randomX(0, 1, easeInOutCubic),
				randomPointRadius(0, 2, easeInOutCubic)
			);
		} else if (ratio == 0.95) {
			timeBase = 0.005;
		} else if (ratio == 0.98) {
			timeBase = 0.01;
		} else if (ratio == 0.998) {
			timeBase = 0.1;
		}
		yield* waitFor(timeBase);
	}

	// reset and hide the circle
	yield* all();

	yield* waitUntil("endSimulation");
	const children = group().children();
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child instanceof Circle) {
			child.remove();
		}
	}

	yield* waitFor(1);

	yield* all(scale(0, 1, easeInOutCubic), graphScale(0, 1, easeInOutCubic));
	yield* waitUntil("endSample");
});
