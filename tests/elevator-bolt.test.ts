import { expect, test } from "bun:test"
import {
  elevatorBoltModelPropsSchema,
  getElevatorBoltDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("elevatorbolt resolves M6x30mm 22mm disk-head bolt", () => {
  const parsed = parseModelString(
    "elevatorbolt_custom_m6_l30mm_threadl20mm_headod22mm_headh2mm_flathead_squareneck_neckw6mm_neckl4mm",
  )
  expect(parsed).toEqual({
    fn: "elevatorbolt",
    custom: true,
    thread: "m6",
    length: 30,
    threadLength: 20,
    headOuterDiameter: 22,
    headHeight: 2,
    flatHead: true,
    squareNeck: true,
    neckWidth: 6,
    neckLength: 4,
  })
  expect(getElevatorBoltDimensions().overallLength).toBe(32)
})

test("elevatorbolt supports M8x40mm variant and schema roundtrip", () => {
  const parsed = parseModelString("elevatorbolt_M8_l40mm_headod28mm_neckw8mm")
  expect(parsed.fn).toBe("elevatorbolt")
  if (parsed.fn !== "elevatorbolt") return
  expect(parsed.thread).toBe("m8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(elevatorBoltModelPropsSchema.parse({}).flatHead).toBe(true)
})

test("elevatorbolt rejects legacy selectors and undersized disk heads", () => {
  expect(() =>
    parseModelString("elevatorbolt_head(flat)_neck(square)"),
  ).toThrow()
  expect(() => parseModelString("elevatorbolt_m6_headod10mm")).toThrow()
})
