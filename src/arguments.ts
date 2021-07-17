export const optionDefinitions = [
	{ name: 'base', type: String, multiple: false },
	{ name: 'coverage', type: String, multiple: false, defaultOption: true },
	{ name: 'output', type: String, multiple: false },
	{ name: 'appName', type: String, multiple: false },
	{ name: 'appRoot', type: String, multiple: false }
]

export interface ICommandLineArguments {
	base: string;
	coverage: string;
	output: string;
	appName?: string;
	appRoot?: string;
}