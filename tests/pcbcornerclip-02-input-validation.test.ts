import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pcbCornerClipModelPropsSchema,
  getPcbCornerClipDimensions,
} from "../src"
import { source, props } from "./fixtures/pcbcornerclip-example"

test("pcbcornerclip rejects malformed, missing, repeated and unsupported input", () => {
  expect(() => mp.string("pcbcornerclip").json()).toThrow()
  expect(() => mp.string(source.replace("_w16mm", "")).json()).toThrow()
  for (const suffix of ["", "typo1mm", "constructor1mm", "w1mm", "width1mm"])
    expect(() => mp.string(source + "_" + suffix).json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, "1mmjunk", "(1mm)", "1e2"])
    expect(() =>
      pcbCornerClipModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    pcbCornerClipModelPropsSchema.parse({ ...props, typo: 1 }),
  ).toThrow()
})
