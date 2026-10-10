import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  cableClampModelPropsSchema,
  getCableClampDimensions,
} from "../src"
import { source, props } from "./fixtures/cableclamp-example"

test("cableclamp rejects malformed, missing, repeated and unsupported input", () => {
  expect(() => mp.string("cableclamp").json()).toThrow()
  expect(() => mp.string(source.replace("_id10mm", "")).json()).toThrow()
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1mm",
    "id1mm",
    "innerdiameter1mm",
  ])
    expect(() => mp.string(source + "_" + suffix).json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, "1mmjunk", "(1mm)", "1e2"])
    expect(() =>
      cableClampModelPropsSchema.parse({ ...props, innerDiameter: value }),
    ).toThrow()
  expect(() =>
    cableClampModelPropsSchema.parse({ ...props, typo: 1 }),
  ).toThrow()
})
