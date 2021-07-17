import { promises } from "fs";
import { ICoverageFile } from "./ICoverageFile";

export const getCoverageFiles = async (baseFilename: string, currentFilename: string): Promise<{ base: ICoverageFile; current: ICoverageFile }> => {
	const baseString = await promises.readFile(baseFilename, { encoding: "utf8" });
	const currentString = await promises.readFile(currentFilename, { encoding: "utf8" });
	const base = JSON.parse(baseString) as ICoverageFile;
	const current = JSON.parse(currentString) as ICoverageFile;
	return { base, current };
};

export const writeOutput = async (contents: string, filename: string): Promise<void> => {
	await promises.writeFile(filename, contents, { encoding: "utf8" });
};
