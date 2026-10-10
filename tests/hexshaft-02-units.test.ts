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
test("hexshaft accepts full decimal units and case-insensitive strings", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "hexshaft",
    ...props,
  })
  expect(
    hexShaftModelPropsSchema.parse({ ...props, acrossFlats: "1.2cm" }),
  ).toEqual(props)
  expect(
    hexShaftModelPropsSchema.parse({ ...props, acrossFlats: "+12mm" }),
  ).toEqual(props)
})
