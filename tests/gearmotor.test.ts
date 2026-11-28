import { expect, test } from "bun:test"
import {
  gearMotorModelPropsSchema,
  getGearMotorDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("gearmotor resolves 37mm offset-spur gearmotor envelope and shaft tip", () => {
  const parsed = parseModelString(
    "gearmotor_bodyod37mm_bodyl70mm_shaftd6mm_shaftl18mm_offset8mm_face4hole_pcd28mm_m3_offsetspur",
  )
  expect(parsed).toEqual({
    fn: "gearmotor",
    bodyOuterDiameter: 37,
    bodyLength: 70,
    shaftDiameter: 6,
    shaftLength: 18,
    shaftOffset: 8,
    face4Hole: true,
    pitchCircleDiameter: 28,
    thread: "m3",
    offsetSpur: true,
  })

  const dims = getGearMotorDimensions()
  expect(dims.overallLength).toBe(88)
  expect(dims.rearZ).toBe(-70)
  expect(dims.shaftTipZ).toBe(18)
})

test("gearmotor supports concentric offset0mm variant and schema roundtrip", () => {
  const parsed = parseModelString("gearmotor_bodyod25mm_pcd17mm_offset0mm_M3")
  expect(parsed.fn).toBe("gearmotor")
  if (parsed.fn !== "gearmotor") return
  expect(parsed.shaftOffset).toBe(0)
  expect(parsed.thread).toBe("m3")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(gearMotorModelPropsSchema.parse({}).face4Hole).toBe(true)
})

test("gearmotor rejects legacy selectors, protruding offset shafts and oversized bolt circles", () => {
  expect(() =>
    parseModelString("gearmotor_mount(face4hole)_style(offsetspur)"),
  ).toThrow()
  expect(() =>
    parseModelString("gearmotor_bodyod37mm_shaftd6mm_offset17mm"),
  ).toThrow()
  expect(() => parseModelString("gearmotor_bodyod37mm_pcd35mm_m3")).toThrow()
})
