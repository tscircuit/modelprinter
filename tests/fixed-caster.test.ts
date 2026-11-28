import { expect, test } from "bun:test"
import {
  fixedCasterModelDefinitionSchema,
  fixedCasterModelPropsSchema,
  getFixedCasterDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("fixedcaster resolves rigid fork wheel and four-hole top plate defaults", () => {
  const parsed = mp
    .string(
      "fixedcaster_wheeld50mm_wheelw20mm_platew50mm_plateh50mm_plate4hole_holegrid(35mm,35mm)_holed6mm",
    )
    .json()
  if (parsed.fn !== "fixedcaster") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "fixedcaster",
    wheelDiameter: 50,
    wheelWidth: 20,
    plateWidth: 50,
    plateHeight: 50,
    plate4Hole: true,
    holeGrid: [35, 35],
    holeDiameter: 6,
  })
  expect(mp.string("fixedcaster").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fixedCasterModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("fixedcaster")

  const dims = getFixedCasterDimensions()
  expect(dims.plateThickness).toBe(3)
  expect(dims.crownClearance).toBe(6)
  expect(dims.overallHeight).toBe(59)
  expect(dims.axleCenterZ).toBe(25)
  expect(dims.holeCenters).toEqual([
    [-17.5, -17.5],
    [17.5, -17.5],
    [-17.5, 17.5],
    [17.5, 17.5],
  ])
})

test("fixedcaster normalizes units, aliases and schema roundtrips", () => {
  const custom = mp
    .string(
      "FIXEDCASTER_WHEELDIAMETER7.5CM_WHEELWIDTH2.5CM_PLATEWIDTH6CM_PLATEHEIGHT6CM_PLATE4HOLE_HOLEGRID(4.5CM,4.5CM)_HOLEDIAMETER8MM",
    )
    .json()
  if (custom.fn !== "fixedcaster") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "fixedcaster",
    wheelDiameter: 75,
    wheelWidth: 25,
    plateWidth: 60,
    plateHeight: 60,
    plate4Hole: true,
    holeGrid: [45, 45],
    holeDiameter: 8,
  })
  const { fn, ...props } = custom
  expect(fixedCasterModelPropsSchema.parse(props)).toEqual(props)
})

test("fixedcaster rejects legacy mount selectors, wide wheels and edge-breaking hole grids", () => {
  for (const badStr of [
    "fixedcaster50",
    "fixedcaster_mount(plate4hole)",
    "fixedcaster_plate4hole(true)",
    "fixedcaster_plate4hole_plate4hole",
    "fixedcaster_wheelw50mm_plateh50mm",
    "fixedcaster_platew50mm_holegrid(45mm,35mm)_holed6mm",
    "fixedcaster_holegrid(6mm,35mm)_holed6mm",
    "fixedcaster_holegrid(35mm)",
    "fixedcaster_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { wheelWidth: 50, plateHeight: 50 },
    { plateWidth: 50, holeGrid: [45, 35], holeDiameter: 6 },
    { plate4Hole: false },
    { mount: "plate4hole" },
  ]) {
    expect(fixedCasterModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
