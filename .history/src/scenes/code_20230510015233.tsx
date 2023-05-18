import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { createRef } from "@motion-canvas/core/lib/utils";
import {
	CodeBlock,
	edit,
	insert,
	lines,
	remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import {
	Node,
	Circle,
	Grid,
	Line,
	Rect,
	Txt,
	Latex,
	Video,
	Layout,
} from "@motion-canvas/2d/lib/components";
import { all, waitFor, waitUntil } from "@motion-canvas/core/lib/flow";

import render from "../assets/render.webm";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { Origin } from "@motion-canvas/core/lib/types";

export default makeScene2D(function* (view) {
	yield view.add(
		<Rect
			fill="#141414"
			zIndex={-1000}
			height={view.height}
			width={view.width}
		/>
	);

	const layoutRef = createRef<Layout>();
	const layoutGap = createSignal(0);
	const layoutRadius = createSignal(0);
	const colA = createRef<Layout>();
	const colB = createRef<Layout>();

	//
	const codeRef = createRef<CodeBlock>();
	yield view.add(
		<>
			<Layout
				layout
				gap={layoutGap}
				width={view.width}
				height={view.height}
				padding={layoutGap}
				direction="row"
				ref={layoutRef}
			>
				<Rect
					grow={1}
					fill={"#242424"}
					radius={layoutRadius}
					layout
					ref={colB}
					width={0.5}
				>
					<CodeBlock
						ref={codeRef}
						code={``}
						language="python"
						fontSize={80}
						fontFamily={"JetBrains Mono"}
						layout={false}
					/>
				</Rect>
			</Layout>
		</>
	);

	codeRef().unselectedOpacity(0.7);

	let currentCode = "";

	function* addLine(line: string, duration: number = 1) {
		yield* codeRef().edit(duration)`${currentCode}${insert(line + "\n")}`;
		currentCode += line + "\n";
	}

	function* addLines(lines: string[], duration: number = 1) {
		yield* addLine(lines.join("\n"), duration);
	}
	function countCommonStartLength(a: string, b: string) {
		let commonLength = 0;
		for (; commonLength < a.length && commonLength < b.length; commonLength++) {
			if (a[commonLength] !== b[commonLength]) break;
		}
		return commonLength;
	}

	function computeCommonEndLength(a: string, b: string) {
		let commonLength = 0;
		while (
			commonLength < a.length &&
			commonLength < b.length &&
			a[a.length - 1 - commonLength] === b[b.length - 1 - commonLength]
		) {
			commonLength++;
		}
		return commonLength;
	}

	function* deleteLines(
		startLineNumber: number,
		endLineNumber: number,
		duration: number = 1
	) {
		// get the char index of the start of the line to delete and the end of the line to delete
		const lines = currentCode.split("\n");
		const startLine = lines[startLineNumber];
		const endLine = lines[endLineNumber];
		const precedingLines = lines.slice(0, startLineNumber);
		let precedingLinesString = "";
		if (precedingLines.length > 0) {
			precedingLinesString = precedingLines.join("\n") + "\n";
		}
		const followingLines = lines.slice(endLineNumber + 1);
		let followingLinesString = "";
		if (followingLines.length > 0) {
			followingLinesString = "\n" + followingLines.join("\n");
		}
		const startCharIndex = precedingLinesString.length;
		const endCharIndex = startCharIndex + startLine.length + endLine.length + 1;
	}

	function* editLine(
		lineNumber: number,
		newLine: string,
		time: number = 1,
		showCommonStart: boolean = true,
		showCommonEnd: boolean = true
	) {
		let replacedLine = currentCode.split("\n")[lineNumber];
		const precedingLines = currentCode.split("\n").slice(0, lineNumber);
		let precedingLinesString = "";
		if (precedingLines.length > 0) {
			precedingLinesString = precedingLines.join("\n") + "\n";
		}
		const followingLines = currentCode.split("\n").slice(lineNumber + 1);
		let followingLinesString = "";
		if (followingLines.length > 0) {
			followingLinesString = "\n" + followingLines.join("\n");
		}
		if (!showCommonStart) {
			const commonStartLength = countCommonStartLength(replacedLine, newLine);
			const commonStart = replacedLine.slice(0, commonStartLength);
			replacedLine = replacedLine.slice(commonStartLength);
			newLine = newLine.slice(commonStartLength);
			precedingLinesString += commonStart;
		}
		if (!showCommonEnd) {
			const commonEndLength = computeCommonEndLength(replacedLine, newLine);
			const commonEnd = replacedLine.slice(-commonEndLength);
			replacedLine = replacedLine.slice(0, -commonEndLength);
			newLine = newLine.slice(0, -commonEndLength);
			followingLinesString = commonEnd + followingLinesString;
		}

		yield* codeRef().edit(
			time
		)`${precedingLinesString}${edit(replacedLine, newLine)}${followingLinesString}`;

		currentCode = precedingLinesString + newLine + followingLinesString;
	}

	function deleteLine(lineNumber: number, duration: number = 1) {
		const lines = currentCode.split("\n");
		lines.splice(lineNumber, 1);
		currentCode = lines.join("\n");
		return codeRef().edit(duration)`${lines.join("\n")}`;
	}

	yield* addLines(["#imports", "import random"], 1);

	yield* addLines(
		[
			"",
			"#code",
			"def monte_carlo_pi_estimation(iterations):",
			"    points_inside_circle = 0",
			"    for _ in range(iterations):",
			"        x = random.uniform(-1, 1)",
			"        y = random.uniform(-1, 1)",
			"        if x**2 + y**2 <= 1:",
			"            points_inside_circle += 1",
			"    return 4 * (points_inside_circle / iterations)",
		],
		3
	);

	codeRef().unselectedOpacity(0.1, 1);
	yield* editLine(1, "import random as rand", 1);
	yield* editLine(7, "        x = rand.random()", 1, false, false);
	yield* editLine(8, "        y = rand.random()", 1, false, false);
	yield* editLine(4, "def monte_carlo_pi_estimation():", 1, false, false);
	yield* editLine(6, "    for _ in range(1024):", 1);
	yield* editLine(11, "    return points_inside_circle / 256", 1);
	yield* editLine(11, "    return points_inside_circle >> 8", 1);

	// yield* all(editLine(0, "", 1), editLine(1, "", 1));
	// yield* all(deleteLine(0, 1), deleteLine(0, 1), deleteLine(0, 1));

	codeRef().unselectedOpacity(0.7, 2);

	// remove the first 4 lines
	yield* codeRef().selection(lines(0, 4), 2);
	yield* deleteLines(0, 3, 0.1);

	yield* codeRef().selection(lines(0, Infinity), 2);

	const colARect = createRef<Rect>();
	yield layoutRef().add(
		<Rect
			ref={colARect}
			fill={"#242424"}
			radius={layoutRadius}
			direction="column"
			alignItems={"center"}
			justifyContent={"center"}
			gap={20}
		>
			<Layout
				ref={colA}
				direction="column"
				alignItems={"center"}
				justifyContent={"center"}
				gap={20}
				width={colARect().width()}
			></Layout>
		</Rect>
	);

	const percentWidth = 0.3;
	yield* all(
		colA().grow(percentWidth, 2),
		colB().grow(1 - percentWidth, 2),
		layoutGap(80, 2),
		layoutRadius(80, 2)
	);

	let videoRef = createRef<Video>();
	const width = colA().width();
	const height = colA().height();

	// yield* colA().add(<Video ref={videoRef} src={render} layout={true} />);
	// videoRef().play();
	// const videoRef2 = createRef<Video>();
	// yield* colA().add(
	// 	<Video ref={videoRef2} src={render} layout={true} maxWidth={width} />
	// );
	// videoRef2().play();

	// const videoRef3 = createRef<Video>();
	// yield* colA().add(
	// 	<Video ref={videoRef3} src={render} layout={true} maxWidth={width} />
	// );
	// videoRef3().play();

	const steps = [
		{
			// pastel red
			color: "#f66",
			text: "Select a random X/Y pair",
		},
		{
			// pastel yellow
			color: "#ff6",
			text: "Check if the point is inside the circle",
		},
		{
			// pastel purple
			color: "#c7f",
			text: "Divide the number of points ",
		},
	];

	let stepRefs = steps.map(() => createRef<Rect>());

	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		const rect = stepRefs[i];
		yield* colA().add(
			<Rect
				fill={"#fff"}
				width={width}
				radius={layoutRadius}
				stroke={step.color}
				lineWidth={8}
				ref={rect}
				alignItems={"center"}
				justifyContent={"center"}
			>
				<Txt
					position={() => rect().getOriginDelta(Origin.Middle)}
					fontSize={40}
					fontFamily={"monospace"}
					fill={"#fff"}
					alignSelf={"center"}
					justifyContent={"center"}
					alignItems={"center"}
					textAlign={"center"}
				>
					{step.text}
				</Txt>
			</Rect>
		);
	}
	yield* waitUntil("endCode");
});
