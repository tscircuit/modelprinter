import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  hexShaftModelPropsSchema,
  getHexShaftDimensions,
} from "../src"
const source = "hexshaft_af12mm_l200mm_profile(regularhex)_endchamfer1mm"
const props = {
  acrossFlats: 12,
  length: 200,
  endChamfer: 1,
  regularHex: true,
} as const
test("hexshaft rejects missing, duplicate, unknown and partially parsed tokens", () => {
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "af1mm",
    "acrossflats1mm",
    "af(1mm)",
    "af1mmjunk",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("hexshaft").json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, 1e308, "1e2", "2mmjunk", "(2mm)"])
    expect(() =>
      hexShaftModelPropsSchema.parse({ ...props, acrossFlats: value }),
    ).toThrow()
  expect(() =>
    hexShaftModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})
