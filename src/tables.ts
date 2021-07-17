import { IComparison, IComparisonMetrics, IComparisonSet } from "./comparison";
import { ICoverageSpec } from "./ICoverageFile";
import { snip } from "./snip";

export const getTableRow = (header: string, data: IComparisonMetrics): string => {
	const outputRow = [header];
	const keys: (keyof ICoverageSpec)[] = ["branches", "functions", "lines", "statements"];

	for (const key of keys) {
		const column = data[key];
		if (column.current === undefined) {
			// deleted file
			outputRow.push(`~~${column.base}%~~`);
		} else if (column.base === undefined) {
			// new file
			outputRow.push(`${column.current}%`);
		} else if (column.current < column.base) {
			// coverage went down
			outputRow.push(`~~${column.base}%~~ **${column.current}%** ❌`);
		} else if (column.current > column.base) {
			// coverage went up
			outputRow.push(`~~${column.base}%~~ **${column.current}%** ✔️`);
		} else {
			// coverage did not change
			outputRow.push(`${column.base}%`);
		}
	}
	return outputRow.join(" | ");
};

export const getComparisonTableLines = (data: IComparisonSet, appRootToSnip?: string): string[] => {
	const outputLines: string[] = [];
	outputLines.push("File | Branches | Functions | Lines | Statements");
	outputLines.push("---|---|---|---|---");
	const lineKeys = Object.keys(data);
	for (const lineKey of lineKeys) {
		const header = appRootToSnip ? snip(lineKey, appRootToSnip) : lineKey;
		outputLines.push(getTableRow(header, data[lineKey]));
	}
	return outputLines;
};

export const getSpoilerSectionLines = (header: string, contentLines: string[]): string[] => {
	const outputLines: string[] = [];
	outputLines.push("<details>");
	outputLines.push(`<summary>${header}</summary>`);
	outputLines.push("");
	outputLines.push(...contentLines);
	outputLines.push("</details>");
	return outputLines;
};

export const getCommentBodyLines = (title: string, data: IComparison, appRootToSnip?: string): string[] => {
	const outputLines: string[] = [];
	outputLines.push(`# ${title}`);
	outputLines.push("");
	outputLines.push(...getComparisonTableLines({ Summary: data.summary }));
	if (Object.keys(data.new).length > 0) {
		outputLines.push("");
		outputLines.push(...getSpoilerSectionLines("New Files", getComparisonTableLines(data.new, appRootToSnip)));
	}
	if (Object.keys(data.changed).length > 0) {
		outputLines.push("");
		outputLines.push(...getSpoilerSectionLines("Changed Files", getComparisonTableLines(data.changed, appRootToSnip)));
	}
	if (Object.keys(data.deleted).length > 0) {
		outputLines.push("");
		outputLines.push(...getSpoilerSectionLines("Deleted Files", getComparisonTableLines(data.deleted, appRootToSnip)));
	}
	if (Object.keys(data.unchanged).length > 0) {
		outputLines.push("");
		outputLines.push(...getSpoilerSectionLines("Unchanged Files", getComparisonTableLines(data.unchanged, appRootToSnip)));
	}

	return outputLines;
};
