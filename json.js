import Benchmark from "benchmark";
import { simpleObject } from "./data/case1.js";
import { mediumObject } from "./data/case2.js";
import { largeNumericObject } from "./data/case3.js";
import { repetitiveStringObject } from "./data/case4.js";
import zlib from "zlib";

const suite = new Benchmark.Suite();

function addJSONTest(name, object) {
	const jsonString = JSON.stringify(object);
	const sizeInBytes = Buffer.byteLength(jsonString, "utf8");
	const zipped = zlib.deflateSync(Buffer.from(jsonString));

	suite
		.add(`${name} JSON serialize`, () => {
			JSON.stringify(object);
		})
		.add(`${name} JSON deserialize`, () => {
			JSON.parse(jsonString);
		});
	console.log(
		`${name} serialized size: ${sizeInBytes.toLocaleString()} bytes zipped - ${zipped.byteLength.toLocaleString()}`
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
