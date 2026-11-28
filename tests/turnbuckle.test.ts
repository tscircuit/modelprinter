import { expect, test } from "bun:test"
import {
  getTurnbuckleDimensions,
  modelDefinitionSchema,
  parseModelString,
  turnbuckleModelPropsSchema,
} from "../src"

test("turnbuckle resolves DIN 1480 M6 eye-eye rigging turnbuckle", () => {
  const parsed = parseModelString(
    "turnbuckle_m6_bodyl100mm_bodyw20mm_bodyh12mm_openl70mm_openw10mm_eyesid10mm_eyewire4mm_endl40mm_opposedthread_centered",
  )
  expect(parsed).toEqual({
    fn: "turnbuckle",
    threadDiameter: 6,
    bodyLength: 100,
    bodyWidth: 20,
    bodyHeight: 12,
    openLength: 70,
    openWidth: 10,
    eyeInnerDiameter: 10,
    eyeWireDiameter: 4,
    endLength: 40,
    opposedThread: true,
    centered: true,
  })
  expect(getTurnbuckleDimensions().bossLengthEachEnd).toBe(15)
})

test("turnbuckle supports M10 125mm-body turnbuckle and roundtrips", () => {
  const parsed = parseModelString(
    "turnbuckle_m10_bodyl125mm_bodyh16mm_openl85mm",
  )
  expect(parsed.fn).toBe("turnbuckle")
  if (parsed.fn !== "turnbuckle") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(turnbuckleModelPropsSchema.parse({}).eyeInnerDiameter).toBe(10)
})

test("turnbuckle rejects legacy selectors and overflowing windows", () => {
  expect(() => parseModelString("turnbuckle_pose(centered)")).toThrow()
  expect(() => parseModelString("turnbuckle_bodyl100mm_openl96mm")).toThrow()
})
