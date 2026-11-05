import { expect, test } from "bun:test"
import { mp, anglePlateModelPropsSchema } from "../src"
import { source, props } from "./fixtures/angleplate"

test("angleplate rejects incomplete, repeated, unsupported and malformed inputs", () => {
  for (const invalid of [
    "angleplate",
    source + "_width100mm",
    source + "_unknown2",
    source + "_w",
    source.replace("w100mm", "w100junk"),
    source.replace("baseholes4", "baseholes4mm"),
    source.replace("faceholes2", "faceholes3"),
    source.replace("baseholes4", "baseholes2"),
    source.replace("angleplate_", "angleplate3_"),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  for (const width of [0, -1, NaN, Infinity, 1e200, "1e2mm"]) {
    expect(() =>
      anglePlateModelPropsSchema.parse({ ...props, width }),
    ).toThrow()
  }
  expect(() =>
    anglePlateModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})
