import { formatCurrency } from "./generalUtils";

describe("ManageListingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should convert number to cost string", () => {
    const input = 1;
    const expected = "$1";
    const output = formatCurrency(input);
    expect(output).toEqual(expected);
  });

  test("if passed undefined value, return empty string", () => {
    const input = undefined;
    const expected = "--";
    const output = formatCurrency(input);
    expect(output).toEqual(expected);
  });

  test("if passed null value, return empty string", () => {
    const input = null;
    const expected = "--";
    const output = formatCurrency(input);
    expect(output).toEqual(expected);
  });

  test("if passed string, return empty string", () => {
    const input = "1";
    const expected = "--";
    const output = formatCurrency(input);
    expect(output).toEqual(expected);
  });
});
