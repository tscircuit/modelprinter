import { expect, test } from "bun:test"
import {
  getPlowBoltDimensions,
  modelDefinitionSchema,
  parseModelString,
  plowBoltModelPropsSchema,
} from "../src"

test("plowbolt resolves M8x35mm 90-deg countersunk plow bolt", () => {
  const parsed = parseModelString(
    "plowbolt_custom_m8_l35mm_threadl22mm_headod18mm_headangle90deg_squareneck_neckw8mm_neckl5mm",
  )
  expect(parsed).toEqual({
    fn: "plowbolt",
    custom: true,
    thread: "m8",
    length: 35,
    threadLength: 22,
    headOuterDiameter: 18,
    headAngleDeg: 90,
    squareNeck: true,
    neckWidth: 8,
    neckLength: 5,
  })
  expect(getPlowBoltDimensions().headConeHeight).toBeCloseTo(5)
})

test("plowbolt supports 80-deg head angle and schema roundtrip", () => {
  const parsed = parseModelString(
    "plowbolt_M10_l45mm_headod22mm_headangle80deg_neckw10mm",
  )
  expect(parsed.fn).toBe("plowbolt")
  if (parsed.fn !== "plowbolt") return
  expect(parsed.thread).toBe("m10")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(plowBoltModelPropsSchema.parse({}).squareNeck).toBe(true)
})

test("plowbolt rejects legacy selectors and undersized head OD", () => {
  expect(() =>
    parseModelString("plowbolt_headangle(90deg)_neck(square)"),
  ).toThrow()
  expect(() => parseModelString("plowbolt_headod10mm_neckw8mm")).toThrow()
})
