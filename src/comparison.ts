import { ICoverageFile, ICoverageSpec } from "./ICoverageFile";

export interface IComparison {
	summary: IComparisonMetrics;
	new: IComparisonSet;
	deleted: IComparisonSet;
	changed: IComparisonSet;
	unchanged: IComparisonSet;
}

export interface IComparisonSet {
	[key: string]: IComparisonMetrics;
}

export interface IComparisonMetrics {
	lines: IComparisonMetric;
	statements: IComparisonMetric;
	functions: IComparisonMetric;
	branches: IComparisonMetric;
}

export interface IComparisonMetric {
	base?: number;
	current?: number;
}

export const getMetrics = (base: ICoverageSpec | null, current: ICoverageSpec | null): IComparisonMetrics => {
	const keys: (keyof ICoverageSpec)[] = ["branches", "functions", "lines", "statements"];
	const metrics: IComparisonMetrics = { lines: {}, branches: {}, functions: {}, statements: {} };

	for (const key of keys) {
		metrics[key] = {
			base: base ? base[key].pct : undefined,
			current: current ? current[key].pct : undefined,
		};
	}

	return metrics;
};

export const getSummary = (base: ICoverageFile, current: ICoverageFile): IComparisonMetrics => {
	return getMetrics(base.total, current.total);
};

export const getNew = (base: ICoverageFile, current: ICoverageFile): IComparisonSet => {
	const currentFiles = Object.keys(current).filter((x) => x !== "total");
	const baseFiles = Object.keys(base).filter((x) => x !== "total");
	const newFiles = currentFiles.filter((x) => !baseFiles.includes(x));

	const comparisonSet: IComparisonSet = {};
	for (const file of newFiles) {
		comparisonSet[file] = getMetrics(null, current[file]);
	}
	return comparisonSet;
};

export const getDeleted = (base: ICoverageFile, current: ICoverageFile): IComparisonSet => {
	const currentFiles = Object.keys(current).filter((x) => x !== "total");
	const baseFiles = Object.keys(base).filter((x) => x !== "total");
	const deletedFiles = baseFiles.filter((x) => !currentFiles.includes(x));

	const comparisonSet: IComparisonSet = {};
	for (const file of deletedFiles) {
		comparisonSet[file] = getMetrics(base[file], null);
	}
	return comparisonSet;
};

const hasChanged = (metrics: IComparisonMetrics): boolean => {
	const keys: (keyof IComparisonMetrics)[] = ["branches", "functions", "lines", "statements"];

	for (const key of keys) {
		if (metrics[key].base !== metrics[key].current) {
			return true;
		}
	}
	return false;
};

export const getChanged = (base: ICoverageFile, current: ICoverageFile): IComparisonSet => {
	const currentFiles = Object.keys(current).filter((x) => x !== "total");
	const baseFiles = Object.keys(base).filter((x) => x !== "total");
	const commonFiles = baseFiles.filter((x) => currentFiles.includes(x));

	const comparisonSet: IComparisonSet = {};
	for (const file of commonFiles) {
		const metric = getMetrics(base[file], current[file]);
		if (hasChanged(metric)) {
			comparisonSet[file] = getMetrics(base[file], current[file]);
		}
	}
	return comparisonSet;
};

export const getUnchanged = (base: ICoverageFile, current: ICoverageFile): IComparisonSet => {
	const currentFiles = Object.keys(current).filter((x) => x !== "total");
	const baseFiles = Object.keys(base).filter((x) => x !== "total");
	const commonFiles = baseFiles.filter((x) => currentFiles.includes(x));

	const comparisonSet: IComparisonSet = {};
	for (const file of commonFiles) {
		const metric = getMetrics(base[file], current[file]);
		if (!hasChanged(metric)) {
			comparisonSet[file] = getMetrics(base[file], current[file]);
		}
	}
	return comparisonSet;
};

export const getComparison = (base: ICoverageFile, current: ICoverageFile): IComparison => {
	const comparison: IComparison = {
		summary: getSummary(base, current),
		new: getNew(base, current),
		deleted: getDeleted(base, current),
		changed: getChanged(base, current),
		unchanged: getUnchanged(base, current),
	};

	return comparison;
};
