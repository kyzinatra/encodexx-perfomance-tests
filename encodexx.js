import Benchmark from "benchmark";
import { simpleObject } from "./data/case1.js";
import { mediumObject } from "./data/case2.js";
import { largeNumericObject } from "./data/case3.js";
import { repetitiveStringObject } from "./data/case4.js";
import { Serializer, t } from "encodexx";

import zlib from "zlib";

const simpleObjectSerializer = new Serializer({
	id: t.int8,
	name: t.str,
	active: t.bool,
	createdAt: t.int32,
});

const mediumObjectSerializer = new Serializer({
	users: [
		{
			userId: t.int16,
			username: t.str,
			registeredAt: t.int32,
		},
	],
});

const largeNumericObjectSerializer = new Serializer({
	metrics: [
		{
			xValue: t.float64,
			yValue: t.float64,
			zValue: t.float64,
		},
	],
});

const repetitiveStringObjectSerializer = new Serializer({
	messages: [t.str],
});

const suite = new Benchmark.Suite();

function addJSONTest(name, object, serializer) {
	const encoded = serializer.encode(object);
	const zipped = zlib.deflateSync(encoded.buffer);

	suite
		.add(`${name} Encodexx serialize`, () => {
			serializer.encode(object);
		})
		.add(`${name} Encodexx deserialize`, () => {
			serializer.decode(encoded);
		});

	console.log(
		`${name} serialized size: ${encoded.length.toLocaleString()} bytes zipped - ${zipped.byteLength.toLocaleString()}`
	);
}

addJSONTest("Simple Object", simpleObject, simpleObjectSerializer);
addJSONTest("Medium Object", mediumObject, mediumObjectSerializer);
addJSONTest("Large Numeric Object", largeNumericObject, largeNumericObjectSerializer);
addJSONTest("Repetitive String Object", repetitiveStringObject, repetitiveStringObjectSerializer);

suite
	.on("cycle", (event) => {
		const benchmark = event.target;
		console.log(
			`${String(benchmark)}, Mean time: ${(benchmark.stats.mean * 1000)
				.toFixed(3)
				.toLocaleString()} ms | σ: ${(benchmark.stats.deviation * 1000).toFixed(3).toLocaleString()} ms\n`
		);
	})
	.run({ async: true });
