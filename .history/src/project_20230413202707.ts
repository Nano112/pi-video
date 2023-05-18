import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import code from "./scenes/code?scene";
import random_sample from "scenes/random_sample?scene";

export default makeProject({
	scenes: [code, random_sample],
});
