import commandLineArgs from 'command-line-args';
import { ICommandLineArguments, optionDefinitions } from './arguments';
import { getCoverageFiles, writeOutput } from './fileIo';
import { getDetailTable, getSummaryTable } from './tables';

const options = commandLineArgs(optionDefinitions) as ICommandLineArguments;

const main = async () => {
	const { base, comparison } = await getCoverageFiles(options.base, options.output)

	const output = [];
	if (options.appName) {
		output.push(`# Code Coverage Comparison - ${options.appName}`);
	} else {
		output.push(`# Code Coverage Comparison`);
	}

	output.push('<details>');
	output.push('<summary>Full Details</summary>');

	output.push(...getSummaryTable(base, comparison));
	output.push('', '')
	output.push('File | Branches | Functions | Lines | Statements');
	output.push('---|---|---|---|---');
	output.push(...getDetailTable(base, comparison, options.appRoot));
	output.push('', '');
	await writeOutput(output.join('\r\n'), options.output);
}

main();