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
test("hexshaft value-free flags reject repeated and conflicting selectors", () => {
  expect(
    mp.string("hexshaft_af12mm_l200mm_endchamfer1mm_regularhex").json(),
  ).toEqual({ fn: "hexshaft", ...props })
  expect(() =>
    mp
      .string("hexshaft_af12mm_l200mm_endchamfer1mm_regularhex_regularhex")
      .json(),
  ).toThrow()
  expect(() =>
    mp.string("hexshaft_af12mm_l200mm_endchamfer1mm_regularhex(true)").json(),
  ).toThrow()
  expect(() => mp.string(`${source}_regularhex`).json()).toThrow()
})
