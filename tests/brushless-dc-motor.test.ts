import { expect, test } from "bun:test"
import {
  brushlessDcMotorModelDefinitionSchema,
  brushlessDcMotorModelPropsSchema,
  getBrushlessDcMotorDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("brushlessdcmotor resolves outrunner bell, shaft and four M3 bolt circle holes", () => {
  const parsed = mp
    .string(
      "brushlessdcmotor_od42mm_l40mm_shaftd5mm_boltpcd30mm_face4hole_m3_outrunner",
    )
    .json()
  if (parsed.fn !== "brushlessdcmotor") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "brushlessdcmotor",
    outerDiameter: 42,
    length: 40,
    shaftDiameter: 5,
    shaftLength: 15,
    boltPitchCircleDiameter: 30,
    face4Hole: true,
    metricSize: "M3",
    outrunner: true,
    threadPitch: 0.5,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(mp.string("brushlessdcmotor").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(brushlessDcMotorModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("brushlessdcmotor")

  const dims = getBrushlessDcMotorDimensions()
  expect(dims.mountThreadDiameter).toBe(3)
  expect(dims.mountThreadDepth).toBe(4.5)
  expect(dims.overallLength).toBe(55)
  expect(dims.mountHoleCenters).toEqual([
    [15, 0],
    [0, 15],
    [-15, 0],
    [0, -15],
  ])
  expect(dims.rearZ).toBe(-40)
  expect(dims.shaftTipZ).toBe(15)
})

test("brushlessdcmotor normalizes units, shaftl and schema roundtrips", () => {
  const m4 = mp
    .string(
      "BRUSHLESSDCMOTOR_OUTERDIAMETER5CM_LENGTH4.5CM_SHAFTDIAMETER6MM_SHAFTLENGTH2CM_BOLTPCD36MM_FACE4HOLE_M4_OUTRUNNER_THREADPITCH0.7MM_RIGHTHANDED_THREADCLASS(6h)_NOTHREADS",
    )
    .json()
  if (m4.fn !== "brushlessdcmotor") throw new Error("Unexpected model")
  expect(m4).toEqual({
    fn: "brushlessdcmotor",
    outerDiameter: 50,
    length: 45,
    shaftDiameter: 6,
    shaftLength: 20,
    boltPitchCircleDiameter: 36,
    face4Hole: true,
    metricSize: "M4",
    outrunner: true,
    threadPitch: 0.7,
    rightHanded: true,
    threadClass: "6H",
    showThreads: false,
  })
  const { fn, ...props } = m4
  expect(brushlessDcMotorModelPropsSchema.parse(props)).toEqual(props)
})

test("brushlessdcmotor rejects legacy selectors, shaft collisions and oversized bolt circles", () => {
  for (const badStr of [
    "brushlessdcmotor42",
    "brushlessdcmotor_mount(face4hole)",
    "brushlessdcmotor_style(outrunner)",
    "brushlessdcmotor_face4hole(true)",
    "brushlessdcmotor_outrunner(true)",
    "brushlessdcmotor_outrunner_outrunner",
    "brushlessdcmotor_shaftd28mm_boltpcd30mm_m3",
    "brushlessdcmotor_od33mm_boltpcd30mm_m3",
    "brushlessdcmotor_m3_threadpitch0.8mm",
    "brushlessdcmotor_threads_nothreads",
    "brushlessdcmotor_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { shaftDiameter: 28, boltPitchCircleDiameter: 30, metricSize: "M3" },
    { outerDiameter: 33, boltPitchCircleDiameter: 30, metricSize: "M3" },
    { outrunner: false },
    { style: "outrunner" },
  ]) {
    expect(brushlessDcMotorModelPropsSchema.safeParse(badProps).success).toBe(
      false,
    )
  }
})
