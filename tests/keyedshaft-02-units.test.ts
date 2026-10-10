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
test("keyedshaft accepts full decimal units and case-insensitive strings", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "keyedshaft",
    ...props,
  })
  expect(
    keyedShaftModelPropsSchema.parse({ ...props, diameter: "2.0cm" }),
  ).toEqual(props)
  expect(
    keyedShaftModelPropsSchema.parse({ ...props, diameter: "+20mm" }),
  ).toEqual(props)
})
