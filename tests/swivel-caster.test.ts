import { expect, test } from "bun:test"
import {
  getSwivelCasterDimensions,
  modelDefinitionSchema,
  parseModelString,
  swivelCasterModelPropsSchema,
} from "../src"

test("swivelcaster resolves 50mm swivel caster swept radius and overall height", () => {
  const parsed = parseModelString(
    "swivelcaster_wheeld50mm_wheelw20mm_platew50mm_plateh50mm_plate4hole_holegrid(35mm,35mm)_holed6mm_swiveloffset20mm",
  )
  expect(parsed).toEqual({
    fn: "swivelcaster",
    wheelDiameter: 50,
    wheelWidth: 20,
    plateWidth: 50,
    plateLength: 50,
    plate4Hole: true,
    holeGridX: 35,
    holeGridY: 35,
    holeDiameter: 6,
    swivelOffset: 20,
  })

  const dims = getSwivelCasterDimensions()
  expect(dims.sweptSwivelRadius).toBe(45)
  expect(dims.plateSeatZ).toBe(0)
  expect(dims.floorZ).toBeLessThan(-60)
})

test("swivelcaster supports 75mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "swivelcaster_wheeld75mm_platew60mm_plateh60mm_holegridx45mm_holegridy45mm",
  )
  expect(parsed.fn).toBe("swivelcaster")
  if (parsed.fn !== "swivelcaster") return
  expect(parsed.wheelDiameter).toBe(75)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(swivelCasterModelPropsSchema.parse({}).plate4Hole).toBe(true)
})

test("swivelcaster rejects legacy mount selectors and overflowing hole grids", () => {
  expect(() =>
    parseModelString("swivelcaster_wheeld50mm_mount(plate4hole)"),
  ).toThrow()
  expect(() =>
    parseModelString("swivelcaster_platew50mm_holed6mm_holegrid(46mm,35mm)"),
  ).toThrow()
  expect(() =>
    parseModelString("swivelcaster_wheeld50mm_swiveloffset55mm"),
  ).toThrow()
})
