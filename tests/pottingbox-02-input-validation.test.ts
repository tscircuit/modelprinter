import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pottingBoxModelPropsSchema,
  getPottingBoxDimensions,
} from "../src"
import { source, props } from "./fixtures/pottingbox-example"

test("pottingbox rejects malformed, missing, repeated and unsupported input", () => {
  expect(() => mp.string("pottingbox").json()).toThrow()
  expect(() => mp.string(source.replace("_w60mm", "")).json()).toThrow()
  for (const suffix of ["", "typo1mm", "constructor1mm", "w1mm", "width1mm"])
    expect(() => mp.string(source + "_" + suffix).json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, "1mmjunk", "(1mm)", "1e2"])
    expect(() =>
      pottingBoxModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    pottingBoxModelPropsSchema.parse({ ...props, typo: 1 }),
  ).toThrow()
})
