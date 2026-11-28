import { expect, test } from "bun:test"
import {
  getTSlotGantryPlateDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  tSlotGantryPlateModelDefinitionSchema,
  tSlotGantryPlateModelPropsSchema,
} from "../src"

test("tslotgantryplate resolves four-wheel V-groove axle and eccentric bore defaults", () => {
  const parsed = mp
    .string(
      "tslotgantryplate_w100mm_h80mm_thickness6mm_wheelspacing60mm_vgroovewheels_axleholes4_holed5mm_eccentricd7mm",
    )
    .json()
  if (parsed.fn !== "tslotgantryplate") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "tslotgantryplate",
    width: 100,
    height: 80,
    thickness: 6,
    wheelSpacing: 60,
    vGrooveWheels: true,
    axleHoleCount: 4,
    holeDiameter: 5,
    eccentricDiameter: 7,
  })
  expect(mp.string("tslotgantryplate").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tSlotGantryPlateModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("tslotgantryplate")

  const dims = getTSlotGantryPlateDimensions()
  expect(dims.minSideMargin).toBe(16.5)
  expect(dims.minEdgeMargin).toBe(6.5)
  expect(dims.fixedAxleCenters).toEqual([
    [-30, 30],
    [30, 30],
  ])
  expect(dims.eccentricAxleCenters).toEqual([
    [-30, -30],
    [30, -30],
  ])
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(6)
})

test("tslotgantryplate normalizes units, aliases and schema roundtrips", () => {
  const custom = mp
    .string(
      "TSLOTGANTRYPLATE_WIDTH12CM_HEIGHT9CM_T0.8CM_WHEELSPACING70MM_VGROOVEWHEELS_AXLEHOLECOUNT4_HOLEDIAMETER5MM_ECCENTRICDIAMETER7.2MM",
    )
    .json()
  if (custom.fn !== "tslotgantryplate") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "tslotgantryplate",
    width: 120,
    height: 90,
    thickness: 8,
    wheelSpacing: 70,
    vGrooveWheels: true,
    axleHoleCount: 4,
    holeDiameter: 5,
    eccentricDiameter: 7.2,
  })
  const { fn, ...props } = custom
  expect(tSlotGantryPlateModelPropsSchema.parse(props)).toEqual(props)
})

test("tslotgantryplate rejects legacy mount selectors, duplicates and invalid bore clearances", () => {
  for (const badStr of [
    "tslotgantryplate100",
    "tslotgantryplate_mount(vgroovewheels)",
    "tslotgantryplate_vgroovewheels(true)",
    "tslotgantryplate_vgroovewheels_vgroovewheels",
    "tslotgantryplate_w100mm_width100mm",
    "tslotgantryplate_axleholes6",
    "tslotgantryplate_holed7mm_eccentricd7mm",
    "tslotgantryplate_holed8mm_eccentricd7mm",
    "tslotgantryplate_w65mm_wheelspacing60mm_eccentricd7mm",
    "tslotgantryplate_h65mm_wheelspacing60mm_eccentricd7mm",
    "tslotgantryplate_wheelspacing7mm_eccentricd7mm",
    "tslotgantryplate_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { holeDiameter: 7, eccentricDiameter: 7 },
    { height: 66, wheelSpacing: 60, eccentricDiameter: 7 },
    { vGrooveWheels: false },
    { mount: "vgroovewheels" },
  ]) {
    expect(tSlotGantryPlateModelPropsSchema.safeParse(badProps).success).toBe(
      false,
    )
  }
})
