import { expect, test } from "bun:test"
import {
  getSplinedShaftDimensions,
  modelDefinitionSchema,
  parseModelString,
  splinedShaftModelPropsSchema,
} from "../src"

test("splinedshaft resolves 16x20x200mm 6-tooth straight-sided spline shaft", () => {
  const parsed = parseModelString(
    "splinedshaft_od20mm_rootd16mm_l200mm_teeth6_toothw4mm_endchamfer1mm_straightsided",
  )
  expect(parsed).toEqual({
    fn: "splinedshaft",
    outerDiameter: 20,
    rootDiameter: 16,
    length: 200,
    teeth: 6,
    toothWidth: 4,
    endChamfer: 1,
    straightSided: true,
  })
  expect(getSplinedShaftDimensions().toothRadialHeight).toBe(2)
})

test("splinedshaft supports 8-tooth 28x23mm variant and roundtrips", () => {
  const parsed = parseModelString(
    "splinedshaft_od28mm_rootd23mm_teeth8_toothw6mm",
  )
  expect(parsed.fn).toBe("splinedshaft")
  if (parsed.fn !== "splinedshaft") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(splinedShaftModelPropsSchema.parse({}).teeth).toBe(6)
})

test("splinedshaft rejects legacy selectors and overlapping spline teeth", () => {
  expect(() =>
    parseModelString("splinedshaft_profile(straightsided)"),
  ).toThrow()
  expect(() =>
    parseModelString("splinedshaft_rootd16mm_teeth10_toothw5mm"),
  ).toThrow()
})
