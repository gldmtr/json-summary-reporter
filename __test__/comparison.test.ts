import { getChanged, getComparison, getDeleted, getMetrics, getNew, getUnchanged, IComparison, IComparisonMetrics, IComparisonSet } from "../src/comparison";
import { ICoverageFile } from "../src/ICoverageFile";

const baseCoverage: ICoverageFile = {
	total: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 1 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 2 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 3 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 4 },
	},
	changedFile: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 1 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 2 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 3 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 4 },
	},
	unchangedFile: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 1 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 2 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 3 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 4 },
	},
	deletedFile: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 1 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 2 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 3 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 4 },
	},
};

const currentCoverage: ICoverageFile = {
	total: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 5 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 6 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 7 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 8 },
	},
	changedFile: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 5 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 6 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 7 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 8 },
	},
	unchangedFile: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 1 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 2 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 3 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 4 },
	},
	newFile: {
		branches: { covered: 0, total: 0, skipped: 0, pct: 5 },
		functions: { covered: 0, total: 0, skipped: 0, pct: 6 },
		lines: { covered: 0, total: 0, skipped: 0, pct: 7 },
		statements: { covered: 0, total: 0, skipped: 0, pct: 8 },
	},
};

describe("Comparison", () => {
	describe("getMetrics", () => {
		test("GIVEN there are two coverage specs, WHEN I call getMetrics, THEN the output should be correct", () => {
			const expected: IComparisonMetrics = {
				branches: { base: 1, current: 5 },
				functions: { base: 2, current: 6 },
				lines: { base: 3, current: 7 },
				statements: { base: 4, current: 8 },
			};

			const actual = getMetrics(baseCoverage.total, currentCoverage.total);

			expect(actual).toEqual(expected);
		});

		test("GIVEN there is only a base coverage spec, WHEN I call getMetrics, THEN the output should be correct", () => {
			const expected: IComparisonMetrics = {
				branches: { base: 1 },
				functions: { base: 2 },
				lines: { base: 3 },
				statements: { base: 4 },
			};

			const actual = getMetrics(baseCoverage.total, null);

			expect(actual).toEqual(expected);
		});

		test("GIVEN there is only a current coverage spec, WHEN I call getMetrics, THEN the output should be correct", () => {
			const expected: IComparisonMetrics = {
				branches: { current: 5 },
				functions: { current: 6 },
				lines: { current: 7 },
				statements: { current: 8 },
			};

			const actual = getMetrics(null, currentCoverage.total);

			expect(actual).toEqual(expected);
		});
	});

	describe("getNew", () => {
		test("GIVEN one new file, one changed file, one unchanged file and one deleted file, WHEN I call getNew, THEN the output should be correct", () => {
			const expected: IComparisonSet = {
				newFile: {
					branches: { current: 5 },
					functions: { current: 6 },
					lines: { current: 7 },
					statements: { current: 8 },
				},
			};
			const actual = getNew(baseCoverage, currentCoverage);
			expect(actual).toEqual(expected);
		});
	});

	describe("getDeleted", () => {
		test("GIVEN one new file, one changed file, one unchanged file and one deleted file, WHEN I call getDeleted, THEN the output should be correct", () => {
			const expected: IComparisonSet = {
				deletedFile: {
					branches: { base: 1 },
					functions: { base: 2 },
					lines: { base: 3 },
					statements: { base: 4 },
				},
			};
			const actual = getDeleted(baseCoverage, currentCoverage);
			expect(actual).toEqual(expected);
		});
	});

	describe("getChanged", () => {
		test("GIVEN one new file, one changed file, one unchanged file and one deleted file, WHEN I call getChanged, THEN the output should be correct", () => {
			const expected: IComparisonSet = {
				changedFile: {
					branches: { base: 1, current: 5 },
					functions: { base: 2, current: 6 },
					lines: { base: 3, current: 7 },
					statements: { base: 4, current: 8 },
				},
			};
			const actual = getChanged(baseCoverage, currentCoverage);
			expect(actual).toEqual(expected);
		});
	});

	describe("getUnchanged", () => {
		test("GIVEN one new file, one changed file, one unchanged file and one deleted file, WHEN I call getUnchanged, THEN the output should be correct", () => {
			const expected: IComparisonSet = {
				unchangedFile: {
					branches: { base: 1, current: 1 },
					functions: { base: 2, current: 2 },
					lines: { base: 3, current: 3 },
					statements: { base: 4, current: 4 },
				},
			};
			const actual = getUnchanged(baseCoverage, currentCoverage);
			expect(actual).toEqual(expected);
		});
	});

	describe("getComparison", () => {
		test("GIVEN one new file, one changed file, one unchanged file and one deleted file, WHEN I call getComparison, THEN the output should be correct", () => {
			const expected: IComparison = {
				summary: {
					branches: { base: 1, current: 5 },
					functions: { base: 2, current: 6 },
					lines: { base: 3, current: 7 },
					statements: { base: 4, current: 8 },
				},
				changed: {
					changedFile: {
						branches: { base: 1, current: 5 },
						functions: { base: 2, current: 6 },
						lines: { base: 3, current: 7 },
						statements: { base: 4, current: 8 },
					},
				},
				deleted: {
					deletedFile: {
						branches: { base: 1 },
						functions: { base: 2 },
						lines: { base: 3 },
						statements: { base: 4 },
					},
				},
				new: {
					newFile: {
						branches: { current: 5 },
						functions: { current: 6 },
						lines: { current: 7 },
						statements: { current: 8 },
					},
				},
				unchanged: {
					unchangedFile: {
						branches: { base: 1, current: 1 },
						functions: { base: 2, current: 2 },
						lines: { base: 3, current: 3 },
						statements: { base: 4, current: 4 },
					},
				},
			};
			const actual = getComparison(baseCoverage, currentCoverage);
			expect(actual).toEqual(expected);
		});
	});
});
