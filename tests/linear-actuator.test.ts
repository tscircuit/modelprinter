import { expect, test } from "bun:test"
import {
  getLinearActuatorDimensions,
  linearActuatorModelDefinitionSchema,
  linearActuatorModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("linearactuator resolves electric-screw retracted pose and eye-eye defaults", () => {
  const parsed = mp
    .string(
      "linearactuator_bodyod40mm_l250mm_stroke100mm_rodod20mm_eyeeye_eyebore8mm_electricscrew",
    )
    .json()
  if (parsed.fn !== "linearactuator") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "linearactuator",
    bodyOuterDiameter: 40,
    retractedLength: 250,
    stroke: 100,
    rodOuterDiameter: 20,
    eyeEye: true,
    eyeBoreDiameter: 8,
    electricScrew: true,
  })
  expect(mp.string("linearactuator").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(linearActuatorModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("linearactuator")

  const dims = getLinearActuatorDimensions()
  expect(dims.eyeOuterDiameter).toBe(16)
  expect(dims.extendedLength).toBe(350)
  expect(dims.overallRetractedLength).toBe(266)
  expect(dims.rearEyeCenterZ).toBe(0)
  expect(dims.frontEyeCenterZ).toBe(250)
  expect(dims.frontEyeExtendedCenterZ).toBe(350)
  expect(dims.size).toEqual([40, 40, 266])
})

test("linearactuator normalizes units, aliases and schema roundtrips", () => {
  const custom = mp
    .string(
      "LINEARACTUATOR_BODYOUTERDIAMETER5CM_RETRACTEDLENGTH30CM_STROKE15CM_RODOUTERDIAMETER2.4CM_EYEEYE_EYEBOREDIAMETER10MM_ELECTRICSCREW",
    )
    .json()
  if (custom.fn !== "linearactuator") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "linearactuator",
    bodyOuterDiameter: 50,
    retractedLength: 300,
    stroke: 150,
    rodOuterDiameter: 24,
    eyeEye: true,
    eyeBoreDiameter: 10,
    electricScrew: true,
  })
  const { fn, ...props } = custom
  expect(linearActuatorModelPropsSchema.parse(props)).toEqual(props)
})

test("linearactuator rejects legacy selectors, oversized rods and impossible strokes", () => {
  for (const badStr of [
    "linearactuator250",
    "linearactuator_mount(eyeeye)",
    "linearactuator_style(electricscrew)",
    "linearactuator_eyeeye(true)",
    "linearactuator_electricscrew(true)",
    "linearactuator_eyeeye_eyeeye",
    "linearactuator_bodyod40mm_rodod40mm",
    "linearactuator_rodod20mm_eyebore20mm",
    "linearactuator_l110mm_stroke100mm_eyebore8mm",
    "linearactuator_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { bodyOuterDiameter: 40, rodOuterDiameter: 40 },
    { retractedLength: 110, stroke: 100, eyeBoreDiameter: 8 },
    { electricScrew: false },
    { mount: "eyeeye" },
  ]) {
    expect(linearActuatorModelPropsSchema.safeParse(badProps).success).toBe(
      false,
    )
  }
})
