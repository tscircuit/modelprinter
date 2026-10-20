import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  keyedShaftModelPropsSchema,
  getKeyedShaftDimensions,
} from "../src"
const source =
  "keyedshaft_d20mm_l250mm_keyw6mm_keydepth3mm_keyl200mm_endchamfer1mm"
const props = {
  diameter: 20,
  length: 250,
  keyWidth: 6,
  keyDepth: 3,
  keyLength: 200,
  endChamfer: 1,
} as const
test("keyedshaft rejects missing, duplicate, unknown and partially parsed tokens", () => {
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "d1mm",
    "diameter1mm",
    "d(1mm)",
    "d1mmjunk",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("keyedshaft").json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, 1e308, "1e2", "2mmjunk", "(2mm)"])
    expect(() =>
      keyedShaftModelPropsSchema.parse({ ...props, diameter: value }),
    ).toThrow()
  expect(() =>
    keyedShaftModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})
