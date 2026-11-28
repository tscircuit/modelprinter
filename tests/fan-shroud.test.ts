import { expect, test } from "bun:test"
import {
  fanShroudModelPropsSchema,
  getFanShroudDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fanshroud resolves 60x60mm to 40mm square-to-round shroud", () => {
  const parsed = parseModelString(
    "fanshroud_w60mm_h60mm_d20mm_exitod40mm_wall2mm_hole4mm_hp(50mm,50mm)_squaretoround",
  )
  expect(parsed).toEqual({
    fn: "fanshroud",
    width: 60,
    height: 60,
    depth: 20,
    exitOuterDiameter: 40,
    wallThickness: 2,
    holeDiameter: 4,
    holePitchX: 50,
    holePitchY: 50,
    squareToRound: true,
  })
  expect(getFanShroudDimensions().exitInnerDiameter).toBe(36)
})

test("fanshroud supports 80mm shroud variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "fanshroud_w80mm_h80mm_exitod50mm_hp(71.5mm,71.5mm)",
  )
  expect(parsed.fn).toBe("fanshroud")
  if (parsed.fn !== "fanshroud") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fanShroudModelPropsSchema.parse({}).squareToRound).toBe(true)
})

test("fanshroud rejects legacy selectors and oversized exit nozzles", () => {
  expect(() => parseModelString("fanshroud_shape(squaretoround)")).toThrow()
  expect(() => parseModelString("fanshroud_w60mm_exitod60mm")).toThrow()
})
