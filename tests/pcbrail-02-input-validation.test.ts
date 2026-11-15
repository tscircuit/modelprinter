import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pcbRailModelPropsSchema,
  getPcbRailDimensions,
} from "../src"
import { source, props } from "./fixtures/pcbrail-example"

test("pcbrail rejects malformed, missing, repeated and unsupported input", () => {
  expect(() => mp.string("pcbrail").json()).toThrow()
  expect(() => mp.string(source.replace("_l80mm", "")).json()).toThrow()
  for (const suffix of ["", "typo1mm", "constructor1mm", "l1mm", "length1mm"])
    expect(() => mp.string(source + "_" + suffix).json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, "1mmjunk", "(1mm)", "1e2"])
    expect(() =>
      pcbRailModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect(() => pcbRailModelPropsSchema.parse({ ...props, typo: 1 })).toThrow()
})
