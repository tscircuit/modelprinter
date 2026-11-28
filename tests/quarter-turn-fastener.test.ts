import { expect, test } from "bun:test"
import {
  getQuarterTurnFastenerDimensions,
  modelDefinitionSchema,
  parseModelString,
  quarterTurnFastenerModelPropsSchema,
} from "../src"

test("quarterturnfastener resolves 6x15mm slotted cross-pin Dzus stud", () => {
  const parsed = parseModelString(
    "quarterturnfastener_d6mm_l15mm_headod12mm_headh2mm_slotw1.5mm_slotdepth1mm_crosspind2mm_crosspinl10mm_pinoffset3mm_slotted",
  )
  expect(parsed).toEqual({
    fn: "quarterturnfastener",
    shankDiameter: 6,
    length: 15,
    headOuterDiameter: 12,
    headHeight: 2,
    slotWidth: 1.5,
    slotDepth: 1,
    crossPinDiameter: 2,
    crossPinLength: 10,
    pinOffset: 3,
    slotted: true,
  })
  expect(getQuarterTurnFastenerDimensions().pinWingProjection).toBe(2)
})

test("quarterturnfastener supports 22mm long-grip stud and roundtrips", () => {
  const parsed = parseModelString("quarterturnfastener_l22mm_headod16mm")
  expect(parsed.fn).toBe("quarterturnfastener")
  if (parsed.fn !== "quarterturnfastener") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(quarterTurnFastenerModelPropsSchema.parse({}).pinOffset).toBe(3)
})

test("quarterturnfastener rejects legacy selectors and head-piercing slots", () => {
  expect(() => parseModelString("quarterturnfastener_drive(slotted)")).toThrow()
  expect(() =>
    parseModelString("quarterturnfastener_headh2mm_slotdepth2.5mm"),
  ).toThrow()
})
