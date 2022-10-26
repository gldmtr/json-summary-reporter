import { IComparison } from '../src/comparison';
import { hasComparisonChanged } from '../src/main';

describe('Main', () => {
  test('GIVEN comparisons are the same, WHEN hasComparisonChanged is called, THEN it should return false', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 0 },
        functions: { base: 0, current: 0 },
        lines: { base: 0, current: 0 },
        statements: { base: 0, current: 0 },
      },
      changed: {},
      deleted: {},
      new: {},
      unchanged: {},
    };

    const expected = false;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });

  test('GIVEN summary branches are different, WHEN hasComparisonChanged is called, THEN it should return true', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 1 },
        functions: { base: 0, current: 0 },
        lines: { base: 0, current: 0 },
        statements: { base: 0, current: 0 },
      },
      changed: {},
      deleted: {},
      new: {},
      unchanged: {},
    };

    const expected = true;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });

  test('GIVEN summary functions are different, WHEN hasComparisonChanged is called, THEN it should return true', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 0 },
        functions: { base: 0, current: 1 },
        lines: { base: 0, current: 0 },
        statements: { base: 0, current: 0 },
      },
      changed: {},
      deleted: {},
      new: {},
      unchanged: {},
    };

    const expected = true;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });

  test('GIVEN summary lines are different, WHEN hasComparisonChanged is called, THEN it should return true', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 0 },
        functions: { base: 0, current: 0 },
        lines: { base: 0, current: 1 },
        statements: { base: 0, current: 0 },
      },
      changed: {},
      deleted: {},
      new: {},
      unchanged: {},
    };

    const expected = true;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });

  test('GIVEN summary statements are different, WHEN hasComparisonChanged is called, THEN it should return true', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 0 },
        functions: { base: 0, current: 0 },
        lines: { base: 0, current: 0 },
        statements: { base: 0, current: 1 },
      },
      changed: {},
      deleted: {},
      new: {},
      unchanged: {},
    };

    const expected = true;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });

  test('GIVEN changed files contains something, WHEN hasComparisonChanged is called, THEN it should return true', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 0 },
        functions: { base: 0, current: 0 },
        lines: { base: 0, current: 0 },
        statements: { base: 0, current: 0 },
      },
      changed: {
        someFile: {
          branches: { base: 0, current: 0 },
          functions: { base: 0, current: 0 },
          lines: { base: 0, current: 0 },
          statements: { base: 0, current: 0 },
        },
      },
      deleted: {},
      new: {},
      unchanged: {},
    };

    const expected = true;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });

  test('GIVEN deleted files contains something, WHEN hasComparisonChanged is called, THEN it should return true', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 0 },
        functions: { base: 0, current: 0 },
        lines: { base: 0, current: 0 },
        statements: { base: 0, current: 0 },
      },
      changed: {},
      deleted: {
        someFile: {
          branches: { base: 0, current: 0 },
          functions: { base: 0, current: 0 },
          lines: { base: 0, current: 0 },
          statements: { base: 0, current: 0 },
        },
      },
      new: {},
      unchanged: {},
    };

    const expected = true;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });

  test('GIVEN new files contains something, WHEN hasComparisonChanged is called, THEN it should return true', () => {
    const comparison: IComparison = {
      summary: {
        branches: { base: 0, current: 0 },
        functions: { base: 0, current: 0 },
        lines: { base: 0, current: 0 },
        statements: { base: 0, current: 0 },
      },
      changed: {},
      deleted: {},
      new: {
        someFile: {
          branches: { base: 0, current: 0 },
          functions: { base: 0, current: 0 },
          lines: { base: 0, current: 0 },
          statements: { base: 0, current: 0 },
        },
      },
      unchanged: {},
    };

    const expected = true;
    const actual = hasComparisonChanged(comparison);

    expect(actual).toEqual(expected);
  });
});
