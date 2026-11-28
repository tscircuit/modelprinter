import { expect, test } from "bun:test"
import {
  gearRackModelDefinitionSchema,
  gearRackModelPropsSchema,
  getGearRackDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("gearrack resolves 20-degree involute rack bar and base mounting hole defaults", () => {
  const parsed = mp
    .string(
      "gearrack_module2mm_l200mm_w15mm_h15mm_pa20deg_base2hole_holed5mm_holepitch160mm",
    )
    .json()
  if (parsed.fn !== "gearrack") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "gearrack",
    module: 2,
    length: 200,
    width: 15,
    height: 15,
    pressureAngle: 20,
    base2Hole: true,
    holeDiameter: 5,
    holePitch: 160,
  })
  expect(mp.string("gearrack").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(gearRackModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("gearrack")

  const dims = getGearRackDimensions()
  expect(dims.linearPitch).toBeCloseTo(2 * Math.PI, 9)
  expect(dims.addendum).toBe(2)
  expect(dims.dedendum).toBe(2.5)
  expect(dims.toothDepth).toBe(4.5)
  expect(dims.rootWebHeight).toBe(10.5)
  expect(dims.pitchLineZ).toBe(13)
  expect(dims.tipZ).toBe(15)
  expect(dims.holeCenters).toEqual([
    [-80, 0],
    [80, 0],
  ])
})

test("gearrack normalizes units, aliases and schema roundtrips", () => {
  const custom = mp
    .string(
      "GEARRACK_MODULE2.5MM_LENGTH30CM_WIDTH2CM_HEIGHT2CM_PRESSUREANGLE20_BASE2HOLE_HOLEDIAMETER6MM_HP24CM",
    )
    .json()
  if (custom.fn !== "gearrack") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "gearrack",
    module: 2.5,
    length: 300,
    width: 20,
    height: 20,
    pressureAngle: 20,
    base2Hole: true,
    holeDiameter: 6,
    holePitch: 240,
  })
  const { fn, ...props } = custom
  expect(gearRackModelPropsSchema.parse(props)).toEqual(props)
})

test("gearrack rejects legacy mount selectors, shallow roots and invalid hole layouts", () => {
  for (const badStr of [
    "gearrack200",
    "gearrack_mount(base2hole)",
    "gearrack_base2hole(true)",
    "gearrack_base2hole_base2hole",
    "gearrack_pa14.5deg",
    "gearrack_module2mm_h5mm",
    "gearrack_module2mm_l10mm_holed2mm_holepitch4mm",
    "gearrack_w5mm_holed5mm",
    "gearrack_l200mm_holed5mm_holepitch196mm",
    "gearrack_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { module: 2, height: 5 },
    { pressureAngle: 25 },
    { base2Hole: false },
    { mount: "base2hole" },
  ]) {
    expect(gearRackModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
