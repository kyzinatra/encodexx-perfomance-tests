import Benchmark from "benchmark";
import { simpleObject } from "./data/case1.js";
import { mediumObject } from "./data/case2.js";
import { largeNumericObject } from "./data/case3.js";
import { repetitiveStringObject } from "./data/case4.js";
import { unpack, pack } from "msgpackr";

import zlib from "zlib";

const suite = new Benchmark.Suite();

function addJSONTest(name, object) {
	const str = pack(object);
	const zipped = zlib.deflateSync(encoded.buffer);

	suite
		.add(`${name} MSGPK serialize`, () => {
			pack(object);
		})
		.add(`${name} MSGPK deserialize`, () => {
			unpack(str);
		});
	console.log(
		`${name} serialized size: ${str.byteLength.toLocaleString()} bytes zipped - ${zipped.byteLength.toLocaleString()}`
	);
}

addJSONTest("Simple Object", simpleObject);
addJSONTest("Medium Object", mediumObject);
addJSONTest("Large Numeric Object", largeNumericObject);
addJSONTest("Repetitive String Object", repetitiveStringObject);

suite
	.on("cycle", (event) => {
		const benchmark = event.target;
		console.log(
			`${String(benchmark)}, Mean time: ${(benchmark.stats.mean * 1000).toFixed(3)} ms | σ: ${(
				benchmark.stats.deviation * 1000
			).toFixed(3)} ms\n`
		);
	})
	.run({ async: true });
