import Benchmark from "benchmark";
import { simpleObject } from "./data/case1.js";
import { mediumObject } from "./data/case2.js";
import { largeNumericObject } from "./data/case3.js";
import { repetitiveStringObject } from "./data/case4.js";
import { case5Data } from "./data/case5.js";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import zlib from "zlib";

const suite = new Benchmark.Suite();

function addJSONTest(name, object) {
	const parser = new XMLParser();
	const builder = new XMLBuilder();

	const jsonString = builder.build(object);
	const sizeInBytes = Buffer.byteLength(jsonString, "utf8");
	const zipped = zlib.deflateSync(Buffer.from(jsonString));

	suite
		.add(`${name} JSON serialize`, () => {
			builder.build(object);
		})
		.add(`${name} JSON deserialize`, () => {
			parser.parse(jsonString);
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
