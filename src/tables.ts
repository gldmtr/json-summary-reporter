import { ICoverageFile } from "./ICoverageFile";

interface IOutputRow {
	0: string;
	1: string;
	2: string;
	3: string;
	4: string;
}

const getTableRow = (header: string, baseValues: number[] | null[], comparisonValues: number[] | null[]): IOutputRow => {
	const row = [header];
	for (let i = 0; i < baseValues.length; i++) {
		const baseValue = baseValues[i];
		const compValue = comparisonValues[i];
		if (compValue == null) {
			row.push(`~~${baseValue}%~~`);
		} else if (baseValue === null) {
			row.push(`${compValue}%`);
		} else if (compValue < baseValue) {
			row.push(`~~${baseValue}%~~ 📉 **${compValue}%** `);
		} else if (compValue > baseValue) {
			row.push(`~~${baseValue}%~~ 📈 **${compValue}%** `);
		} else {
			row.push(`${baseValue}%`);
		}
	}
	return row.join(' | ');
}

export const getDetailTable = (base: ICoverageFile, comparison: ICoverageFile, appRoot?: string) => {
	const files = Object.keys(base)
		.concat(Object.keys(comparison))
		.filter((value, index, array) => array.indexOf(value) == index);

	for (const file of files) {
		let row;
		let header = file;
		if (appRoot) {
			header = header.replace(appRoot, '');
		}
		if (base[file] && comparison[file]) {
			row = getTableRow(
				header,
				[base[file].branches.pct, base[file].functions.pct, base[file].lines.pct, base[file].statements.pct],
				[comparison[file].branches.pct, comparison[file].functions.pct, comparison[file].lines.pct, comparison[file].statements.pct]
			);
		} else if (base[file]) {
			row = getTableRow(
				header,
				[base[file].branches.pct, base[file].functions.pct, base[file].lines.pct, base[file].statements.pct],
				[null, null, null, null]
			);
		} else if (comparison[file]) {
			row = getTableRow(
				header,
				[null, null, null, null],
				[comparison[file].branches.pct, comparison[file].functions.pct, comparison[file].lines.pct, comparison[file].statements.pct]
			);
		}
		output.push(row);
	}

	output.push('</details >');

	return output;
}

export const getSummaryTable = (base: ICoverageFile, comparison: ICoverageFile) => {
	const output = [];
	output.push('File | Branches | Functions | Lines | Statements');
	output.push('---|---|---|---|---');

	let row;
	const header = "Total";
	if (base.total && comparison.total) {
		row = getTableRow(
			header,
			[base.total.branches.pct, base.total.functions.pct, base.total.lines.pct, base.total.statements.pct],
			[comparison.total.branches.pct, comparison.total.functions.pct, comparison.total.lines.pct, comparison.total.statements.pct]
		);
	} else if (base.total) {
		row = getTableRow(
			header,
			[base.total.branches.pct, base.total.functions.pct, base.total.lines.pct, base.total.statements.pct],
			[null, null, null, null]
		);
	} else if (comparison.total) {
		row = getTableRow(
			header,
			[null, null, null, null],
			[comparison.total.branches.pct, comparison.total.functions.pct, comparison.total.lines.pct, comparison.total.statements.pct]
		);
	}
	output.push(row);

	return output;
}