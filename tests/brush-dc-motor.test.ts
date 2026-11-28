import { expect, test } from "bun:test"
import {
  brushDcMotorModelDefinitionSchema,
  brushDcMotorModelPropsSchema,
  getBrushDcMotorDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("brushdcmotor resolves round-can motor envelope, shaft and M3 face holes", () => {
  const parsed = mp
    .string(
      "brushdcmotor_od36mm_l60mm_shaftd5mm_shaftl15mm_face2hole_pcd25mm_m3_roundcan",
    )
    .json()
  if (parsed.fn !== "brushdcmotor") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "brushdcmotor",
    outerDiameter: 36,
    length: 60,
    shaftDiameter: 5,
    shaftLength: 15,
    face2Hole: true,
    pitchCircleDiameter: 25,
    metricSize: "M3",
    roundCan: true,
    threadPitch: 0.5,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(mp.string("brushdcmotor").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(brushDcMotorModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("brushdcmotor")

  const dims = getBrushDcMotorDimensions()
  expect(dims.mountThreadDiameter).toBe(3)
  expect(dims.mountThreadDepth).toBe(4.5)
  expect(dims.overallLength).toBe(75)
  expect(dims.mountHoleCenters).toEqual([
    [-12.5, 0],
    [12.5, 0],
  ])
  expect(dims.rearZ).toBe(-60)
  expect(dims.mountingFaceZ).toBe(0)
  expect(dims.shaftTipZ).toBe(15)
})

test("brushdcmotor normalizes units, aliases and schema roundtrips", () => {
  const m4 = mp
    .string(
      "BRUSHDCMOTOR_OUTERDIAMETER4.2CM_LENGTH7CM_SHAFTDIAMETER6MM_SHAFTLENGTH2CM_FACE2HOLE_PITCHCIRCLEDIAMETER28MM_M4_ROUNDCAN_THREADPITCH0.7MM_RIGHTHANDED_THREADCLASS(6h)_NOTHREADS",
    )
    .json()
  if (m4.fn !== "brushdcmotor") throw new Error("Unexpected model")
  expect(m4).toEqual({
    fn: "brushdcmotor",
    outerDiameter: 42,
    length: 70,
    shaftDiameter: 6,
    shaftLength: 20,
    face2Hole: true,
    pitchCircleDiameter: 28,
    metricSize: "M4",
    roundCan: true,
    threadPitch: 0.7,
    rightHanded: true,
    threadClass: "6H",
    showThreads: false,
  })
  const { fn, ...props } = m4
  expect(brushDcMotorModelPropsSchema.parse(props)).toEqual(props)
})

test("brushdcmotor rejects legacy selectors, shaft/hole collisions and can overhangs", () => {
  for (const badStr of [
    "brushdcmotor36",
    "brushdcmotor_mount(face2hole)",
    "brushdcmotor_style(roundcan)",
    "brushdcmotor_face2hole(true)",
    "brushdcmotor_roundcan(true)",
    "brushdcmotor_face2hole_face2hole",
    "brushdcmotor_shaftd22mm_pcd25mm_m3",
    "brushdcmotor_od28mm_pcd25mm_m3",
    "brushdcmotor_m3_threadpitch0.8mm",
    "brushdcmotor_threads_nothreads",
    "brushdcmotor_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { shaftDiameter: 22, pitchCircleDiameter: 25, metricSize: "M3" },
    { outerDiameter: 28, pitchCircleDiameter: 25, metricSize: "M3" },
    { roundCan: false },
    { style: "roundcan" },
  ]) {
    expect(brushDcMotorModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
