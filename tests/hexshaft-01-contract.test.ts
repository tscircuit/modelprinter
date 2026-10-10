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
test("hexshaft complete roadmap contract and public schema roundtrip", () => {
  const expected = { fn: "hexshaft" as const, ...props }
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(hexShaftModelPropsSchema.parse(props)).toEqual(props)
  expect(
    getHexShaftDimensions(props).size.every(
      (value) => value > 0 && Number.isFinite(value),
    ),
  ).toBe(true)
})
