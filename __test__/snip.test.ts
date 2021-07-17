import { snip } from "../src/snip";

describe("Snip", () => {
	test("GIVEN the string starts with the snip part, WHEN snip is called, THEN the first part is snipped off", () => {
		const str = "commonString";
		const snipPart = "common";
		const expected = "String";

		const actual = snip(str, snipPart);
		expect(actual).toEqual(expected);
	});

	test("GIVEN the string contains the snip part but does not start with it, WHEN snip is called, THEN nothing is snipped", () => {
		const str = "stringCommon";
		const snipPart = "Common";
		const expected = "stringCommon";

		const actual = snip(str, snipPart);
		expect(actual).toEqual(expected);
	});

	test("GIVEN the string starts with the snip part twice, WHEN snip is called, THEN only the first part is snipped", () => {
		const str = "CommonCommonString";
		const snipPart = "Common";
		const expected = "CommonString";

		const actual = snip(str, snipPart);
		expect(actual).toEqual(expected);
	});
});
