import { expect, test } from "bun:test"
import {
  flangeFullFaceGasketModelPropsSchema,
  getFlangeFullFaceGasketDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flangefullfacegasket resolves 25x95x2mm 4-hole pipe flange gasket", () => {
  const parsed = parseModelString(
    "flangefullfacegasket_id25mm_od95mm_t2mm_holes4_flat_boltcirc65mm_holed9mm",
  )
  expect(parsed).toEqual({
    fn: "flangefullfacegasket",
    innerDiameter: 25,
    outerDiameter: 95,
    thickness: 2,
    holes: 4,
    flat: true,
    boltCircleDiameter: 65,
    holeDiameter: 9,
  })
  expect(getFlangeFullFaceGasketDimensions().innerSealingLandWidth).toBe(15.5)
})

test("flangefullfacegasket supports 8-hole DN50 variant and roundtrips", () => {
  const parsed = parseModelString(
    "flangefullfacegasket_id50mm_od150mm_holes8_boltcirc120mm",
  )
  expect(parsed.fn).toBe("flangefullfacegasket")
  if (parsed.fn !== "flangefullfacegasket") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flangeFullFaceGasketModelPropsSchema.parse({}).flat).toBe(true)
})

test("flangefullfacegasket rejects legacy selectors and colliding bolt circles", () => {
  expect(() => parseModelString("flangefullfacegasket_profile(flat)")).toThrow()
  expect(() =>
    parseModelString("flangefullfacegasket_id50mm_boltcirc55mm_holed9mm"),
  ).toThrow()
})
