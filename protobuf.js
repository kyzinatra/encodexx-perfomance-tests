import protobuf from "protobufjs";
import Benchmark from "benchmark";

import { simpleObject } from "./data/case1.js";
import { mediumObject } from "./data/case2.js";
import { largeNumericObject } from "./data/case3.js";
import { repetitiveStringObject } from "./data/case4.js";

import zlib from "zlib";

const suite = new Benchmark.Suite();

// Предварительно загрузи свои схемы Protobuf
const root = protobuf.loadSync("proto.proto");

// Предполагаем, что для каждого объекта определён тип в Protobuf
const types = {
	"Simple Object": root.lookupType("SimpleObject"),
	"Medium Object": root.lookupType("MediumObject"),
	"Large Numeric Object": root.lookupType("LargeNumericObject"),
	"Repetitive String Object": root.lookupType("RepetitiveStringObject"),
};

// Функция для добавления тестов с Protobuf
function addProtobufTest(name, object) {
	const type = types[name];
	const message = type.create(object);
	const buffer = type.encode(message).finish();
	const sizeInBytes = buffer.length;
	const zipped = zlib.deflateSync(buffer);

	suite
		.add(`${name} Protobuf serialize`, () => {
			type.encode(message).finish();
		})
		.add(`${name} Protobuf deserialize`, () => {
			type.decode(buffer);
		});

	console.log(
		`${name} serialized size: ${sizeInBytes.toLocaleString()} bytes zipped - ${zipped.byteLength.toLocaleString()}`
	);
}

addProtobufTest("Simple Object", simpleObject);
addProtobufTest("Medium Object", mediumObject);
addProtobufTest("Large Numeric Object", largeNumericObject);
addProtobufTest("Repetitive String Object", repetitiveStringObject);

suite
	.on("cycle", (event) => {
		const benchmark = event.target;
		console.log(String(benchmark));
		console.log(
			`Mean time: ${(benchmark.stats.mean * 1000).toFixed(3)} ms | σ: ${(
				benchmark.stats.deviation * 1000
			).toFixed(3)} ms\n`
		);
	})
	.on("complete", function () {
		console.log("Fastest is " + this.filter("fastest").map("name"));
	})
	.run({ async: true });
