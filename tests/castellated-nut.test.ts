import { expect, test } from "bun:test"
import {
  castellatedNutModelPropsSchema,
  getCastellatedNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("castellatednut resolves M6 6-slot DIN 935 castle nut", () => {
  const parsed = parseModelString(
    "castellatednut_m6_af10mm_h8mm_castleod9mm_castleh3mm_slots6_slotw1.5mm_slotdepth3mm",
  )
  expect(parsed).toEqual({
    fn: "castellatednut",
    threadDiameter: 6,
    acrossFlats: 10,
    height: 8,
    castleOuterDiameter: 9,
    castleHeight: 3,
    slots: 6,
    slotWidth: 1.5,
    slotDepth: 3,
  })
  expect(getCastellatedNutDimensions().hexBaseHeight).toBe(5)
})

test("castellatednut supports M10 16mm AF variant and roundtrips", () => {
  const parsed = parseModelString(
    "castellatednut_m10_af16mm_h12mm_castleod14mm_castleh4mm_slotdepth4mm",
  )
  expect(parsed.fn).toBe("castellatednut")
  if (parsed.fn !== "castellatednut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(castellatedNutModelPropsSchema.parse({}).slots).toBe(6)
})

test("castellatednut rejects odd slot counts and legacy selectors", () => {
  expect(() => parseModelString("castellatednut_spec(custom)")).toThrow()
  expect(() => parseModelString("castellatednut_slots5")).toThrow()
})
