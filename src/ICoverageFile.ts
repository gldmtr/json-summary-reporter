export interface ICoverageCounts {
	total: number;
	covered: number;
	skipped: number;
	pct: number;
}

export interface ICoverageSpec {
	lines: ICoverageCounts;
	statements: ICoverageCounts;
	functions: ICoverageCounts;
	branches: ICoverageCounts;
}

export interface ICoverageFile {
	total: ICoverageSpec;
	[key: string]: ICoverageSpec;
}