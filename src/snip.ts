export const snip = (str: string, partToSnip: string): string => {
	if (str.startsWith(partToSnip)) {
		return str.substr(partToSnip.length);
	}
	return str;
};
