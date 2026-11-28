import { expect, test } from "bun:test"
import {
  getSleeveAnchorDimensions,
  modelDefinitionSchema,
  parseModelString,
  sleeveAnchorModelPropsSchema,
} from "../src"

test("sleeveanchor resolves M8x65mm 10mm-sleeve hex masonry anchor", () => {
  const parsed = parseModelString(
    "sleeveanchor_m8_l65mm_sleeveod10mm_wall1mm_sleevel45mm_slots4_slotl20mm_coneod10mm_af13mm_hexhead_unset",
  )
  expect(parsed).toEqual({
    fn: "sleeveanchor",
    threadDiameter: 8,
    length: 65,
    sleeveOuterDiameter: 10,
    wallThickness: 1,
    sleeveLength: 45,
    slots: 4,
    slotLength: 20,
    coneOuterDiameter: 10,
    acrossFlats: 13,
    hexHead: true,
    unset: true,
  })
  expect(getSleeveAnchorDimensions().unslottedSleeveLength).toBe(25)
})

test("sleeveanchor supports M10x85mm sleeve anchor and roundtrips", () => {
  const parsed = parseModelString(
    "sleeveanchor_m10_l85mm_sleeveod12mm_sleevel60mm_af17mm",
  )
  expect(parsed.fn).toBe("sleeveanchor")
  if (parsed.fn !== "sleeveanchor") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(sleeveAnchorModelPropsSchema.parse({}).slots).toBe(4)
})

test("sleeveanchor rejects legacy selectors and overflowing sleeves", () => {
  expect(() => parseModelString("sleeveanchor_head(hex)")).toThrow()
  expect(() => parseModelString("sleeveanchor_l65mm_sleevel62mm")).toThrow()
})
