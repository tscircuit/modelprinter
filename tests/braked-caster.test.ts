import { expect, test } from "bun:test"
import {
  brakedCasterModelPropsSchema,
  getBrakedCasterDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("brakedcaster resolves 75mm total-lock braked swivel caster envelope", () => {
  const parsed = parseModelString(
    "brakedcaster_wheeld75mm_wheelw25mm_platew60mm_plateh60mm_plate4hole_holegrid(45mm,45mm)_holed6mm_totalbrake",
  )
  expect(parsed).toEqual({
    fn: "brakedcaster",
    wheelDiameter: 75,
    wheelWidth: 25,
    plateWidth: 60,
    plateLength: 60,
    plate4Hole: true,
    holeGridX: 45,
    holeGridY: 45,
    holeDiameter: 6,
    totalBrake: true,
  })

  const dims = getBrakedCasterDimensions()
  expect(dims.brakePedalOverhang).toBeCloseTo(21)
  expect(dims.plateSeatZ).toBe(0)
  expect(dims.floorZ).toBeLessThan(-95)
})

test("brakedcaster supports 100mm heavy-duty variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "brakedcaster_wheeld10cm_platew80mm_plateh80mm_holegridx60mm_holegridy60mm",
  )
  expect(parsed.fn).toBe("brakedcaster")
  if (parsed.fn !== "brakedcaster") return
  expect(parsed.wheelDiameter).toBeCloseTo(100)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(brakedCasterModelPropsSchema.parse({}).totalBrake).toBe(true)
})

test("brakedcaster rejects legacy mount/brake selectors and wide wheels", () => {
  expect(() =>
    parseModelString("brakedcaster_mount(plate4hole)_brake(total)"),
  ).toThrow()
  expect(() => parseModelString("brakedcaster_platew50mm_wheelw50mm")).toThrow()
  expect(() =>
    parseModelString("brakedcaster_platew60mm_holed6mm_holegrid(56mm,45mm)"),
  ).toThrow()
})
