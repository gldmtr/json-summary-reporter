import { IComparison, IComparisonMetrics, IComparisonSet } from '../src/comparison';
import { getCommentBodyLines, getComparisonTableLines, getSpoilerSectionLines, getTableRow } from '../src/tables';

describe('Tables', () => {
  test('GIVEN data from a new file, WHEN getTableRow is called, THEN the output is correct', () => {
    const header = 'Summary';
    const data: IComparisonMetrics = {
      branches: { current: 50 },
      functions: { current: 50 },
      lines: { current: 50 },
      statements: { current: 50 },
    };
    const expected = `${header} | 50% | 50% | 50% | 50%`;

    const actual = getTableRow(header, data);
    expect(actual).toEqual(expected);
  });

  test('GIVEN data from a deleted file, WHEN getTableRow is called, THEN the output is correct', () => {
    const header = 'Summary';
    const data: IComparisonMetrics = {
      branches: { base: 50 },
      functions: { base: 50 },
      lines: { base: 50 },
      statements: { base: 50 },
    };
    const expected = `${header} | ~~50%~~ | ~~50%~~ | ~~50%~~ | ~~50%~~`;

    const actual = getTableRow(header, data);
    expect(actual).toEqual(expected);
  });

  test('GIVEN data from a changed file, WHEN getTableRow is called, THEN the output is correct', () => {
    const header = 'Summary';
    const data: IComparisonMetrics = {
      branches: { base: 50, current: 100 },
      functions: { base: 50, current: 100 },
      lines: { base: 50, current: 0 },
      statements: { base: 50, current: 0 },
    };
    const expected = `${header} | ~~50%~~ **100%** ✔️ | ~~50%~~ **100%** ✔️ | ~~50%~~ **0%** ❌ | ~~50%~~ **0%** ❌`;

    const actual = getTableRow(header, data);
    expect(actual).toEqual(expected);
  });

  test('GIVEN data from an unchanged file, WHEN getTableRow is called, THEN the output is correct', () => {
    const header = 'Summary';
    const data: IComparisonMetrics = {
      branches: { base: 50, current: 50 },
      functions: { base: 50, current: 50 },
      lines: { base: 50, current: 50 },
      statements: { base: 50, current: 50 },
    };
    const expected = `${header} | 50% | 50% | 50% | 50%`;

    const actual = getTableRow(header, data);
    expect(actual).toEqual(expected);
  });

  test('GIVEN data from one file, WHEN getComparisonTable is called, THEN the output is correct', () => {
    const data: IComparisonSet = {
      singleFile: {
        branches: { base: 50, current: 0 },
        functions: { base: 50, current: 100 },
        lines: { base: 50, current: 50 },
        statements: { base: 50, current: 50 },
      },
    };

    const expected = [
      'File | Branches | Functions | Lines | Statements',
      '---|---|---|---|---',
      'singleFile | ~~50%~~ **0%** ❌ | ~~50%~~ **100%** ✔️ | 50% | 50%',
    ];

    const actual = getComparisonTableLines(data);
    expect(actual).toEqual(expected);
  });

  test('GIVEN common start points from a file and a snip section is passed in, WHEN getComparisonTable is called, THEN the output is correct', () => {
    const data: IComparisonSet = {
      '/annoying/path/src/file.tsx': {
        branches: { base: 50, current: 0 },
        functions: { base: 50, current: 100 },
        lines: { base: 50, current: 50 },
        statements: { base: 50, current: 50 },
      },
      '/annoying/path/src/other.tsx': {
        branches: { base: 50, current: 0 },
        functions: { base: 50, current: 100 },
        lines: { base: 50, current: 50 },
        statements: { base: 50, current: 50 },
      },
    };

    const expected = [
      'File | Branches | Functions | Lines | Statements',
      '---|---|---|---|---',
      'src/file.tsx | ~~50%~~ **0%** ❌ | ~~50%~~ **100%** ✔️ | 50% | 50%',
      'src/other.tsx | ~~50%~~ **0%** ❌ | ~~50%~~ **100%** ✔️ | 50% | 50%',
    ];

    const actual = getComparisonTableLines(data, '/annoying/path/');
    expect(actual).toEqual(expected);
  });

  test('WHEN getSpoilerSection is called, THEN the output is correct', () => {
    // prettier-ignore
    const expected = [
			"<details>",
			`<summary>My Header</summary>`,
			"",
			`My body content`,
			"</details>"
		];

    const actual = getSpoilerSectionLines('My Header', ['My body content']);
    expect(actual).toEqual(expected);
  });

  test('WHEN getCommentBody is called, THEN the output is correct', () => {
    const data: IComparison = {
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

    // prettier-ignore
    const expected = [
			"# My Lovely Header",
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"Summary | ~~1%~~ **5%** ✔️ | ~~2%~~ **6%** ✔️ | ~~3%~~ **7%** ✔️ | ~~4%~~ **8%** ✔️",
			"",
			"<details>",
			`<summary>New Files</summary>`,
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"newFile | 5% | 6% | 7% | 8%",
			"</details>",
			"",
			"<details>",
			`<summary>Changed Files</summary>`,
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"changedFile | ~~1%~~ **5%** ✔️ | ~~2%~~ **6%** ✔️ | ~~3%~~ **7%** ✔️ | ~~4%~~ **8%** ✔️",
			"</details>",
			"",
			"<details>",
			`<summary>Deleted Files</summary>`,
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"deletedFile | ~~1%~~ | ~~2%~~ | ~~3%~~ | ~~4%~~",
			"</details>",
			"",
			"<details>",
			`<summary>Unchanged Files</summary>`,
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"unchangedFile | 1% | 2% | 3% | 4%",
			"</details>"
		];

    const actual = getCommentBodyLines('My Lovely Header', data);
    expect(actual).toEqual(expected);
  });

  test('WHEN getCommentBody is called, THEN the output is correct', () => {
    const data: IComparison = {
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

    // prettier-ignore
    const expected = [
			"# My Lovely Header",
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"Summary | ~~1%~~ **5%** ✔️ | ~~2%~~ **6%** ✔️ | ~~3%~~ **7%** ✔️ | ~~4%~~ **8%** ✔️",
			"",
			"<details>",
			`<summary>New Files</summary>`,
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"newFile | 5% | 6% | 7% | 8%",
			"</details>",
			"",
			"<details>",
			`<summary>Changed Files</summary>`,
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"changedFile | ~~1%~~ **5%** ✔️ | ~~2%~~ **6%** ✔️ | ~~3%~~ **7%** ✔️ | ~~4%~~ **8%** ✔️",
			"</details>",
			"",
			"<details>",
			`<summary>Deleted Files</summary>`,
			"",
			"File | Branches | Functions | Lines | Statements",
			"---|---|---|---|---",
			"deletedFile | ~~1%~~ | ~~2%~~ | ~~3%~~ | ~~4%~~",
			"</details>",
		];

    const actual = getCommentBodyLines('My Lovely Header', data, undefined, true);

    expect(actual).toEqual(expected);
  });
});
