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
test("keyedshaft complete roadmap contract and public schema roundtrip", () => {
  const expected = { fn: "keyedshaft" as const, ...props }
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(keyedShaftModelPropsSchema.parse(props)).toEqual(props)
  expect(
    getKeyedShaftDimensions(props).size.every(
      (value) => value > 0 && Number.isFinite(value),
    ),
  ).toBe(true)
})
