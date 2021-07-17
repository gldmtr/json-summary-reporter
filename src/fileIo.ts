import { promises as fs } from 'fs';
import { exit } from 'process';
import { ICoverageFile } from './ICoverageFile';

export const getCoverageFiles = async (baseFilename: string, comparisonFilename: string) => {
	try {
		const baseString = await fs.readFile(baseFilename, { encoding: "utf8" });
		const comparisonString = await fs.readFile(comparisonFilename, { encoding: "utf8" });
		const base = JSON.parse(baseString) as ICoverageFile;
		const comparison = JSON.parse(comparisonString) as ICoverageFile;
		return { base, comparison };
	} catch (error) {
		console.error(error);
		exit(1);
	}
}

export const writeOutput = async (contents: string, filename: string) => {
	try {
		await fs.writeFile(filename, contents, { encoding: "utf8" });
	} catch (error) {
		console.error(error);
		exit(1);
	}
}