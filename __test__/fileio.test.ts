import { getCoverageFiles, writeOutput } from '../src/fileIo';
import { ICoverageFile } from '../src/ICoverageFile';
import { promises } from 'fs';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

describe('File IO', () => {
  test('GIVEN the files exist, WHEN getCoverageFiles is called, THEN the files are parsed properly', async () => {
    const baseCoverage: ICoverageFile = {
      total: {
        branches: {
          covered: 0,
          pct: 1,
          skipped: 0,
          total: 0,
        },
        functions: {
          covered: 0,
          pct: 2,
          skipped: 0,
          total: 0,
        },
        lines: {
          covered: 0,
          pct: 3,
          skipped: 0,
          total: 0,
        },
        statements: {
          covered: 0,
          pct: 4,
          skipped: 0,
          total: 0,
        },
      },
    };

    const currentCoverage: ICoverageFile = {
      total: {
        branches: {
          covered: 0,
          pct: 5,
          skipped: 0,
          total: 0,
        },
        functions: {
          covered: 0,
          pct: 6,
          skipped: 0,
          total: 0,
        },
        lines: {
          covered: 0,
          pct: 7,
          skipped: 0,
          total: 0,
        },
        statements: {
          covered: 0,
          pct: 8,
          skipped: 0,
          total: 0,
        },
      },
    };

    const baseContents = JSON.stringify(baseCoverage);
    const currentContents = JSON.stringify(currentCoverage);

    (promises.readFile as jest.Mock).mockResolvedValueOnce(baseContents).mockResolvedValueOnce(currentContents);

    const { base, current } = await getCoverageFiles('baseFilename', 'currentFilename');

    expect(base).toEqual(baseCoverage);
    expect(current).toEqual(currentCoverage);
  });

  test('WHEN writeOutput is called, THEN the files written', async () => {
    const writeMock = promises.writeFile as jest.Mock;
    writeMock.mockResolvedValueOnce(null);

    const expectedContent = 'content';
    const expectedFilename = 'filename';

    await writeOutput(expectedContent, expectedFilename);

    expect(writeMock).toHaveBeenCalledWith(expectedFilename, expectedContent, expect.anything());
  });
});
