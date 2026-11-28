import { expect, test } from "bun:test"
import {
  getSquareHeadBoltDimensions,
  modelDefinitionSchema,
  parseModelString,
  squareHeadBoltModelPropsSchema,
} from "../src"

test("squareheadbolt resolves M6x30mm square wrench bolt", () => {
  const parsed = parseModelString(
    "squareheadbolt_custom_m6_l30mm_threadl18mm_headw10mm_headh4mm_squarehead_squaredrive_chamfer0.5mm",
  )
  expect(parsed).toEqual({
    fn: "squareheadbolt",
    custom: true,
    thread: "m6",
    length: 30,
    threadLength: 18,
    headWidth: 10,
    headHeight: 4,
    squareHead: true,
    squareDrive: true,
    chamfer: 0.5,
  })
  expect(getSquareHeadBoltDimensions().unthreadedGripLength).toBe(12)
})

test("squareheadbolt supports M8x40mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "squareheadbolt_M8_l40mm_threadl22mm_headw13mm",
  )
  expect(parsed.fn).toBe("squareheadbolt")
  if (parsed.fn !== "squareheadbolt") return
  expect(parsed.thread).toBe("m8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(squareHeadBoltModelPropsSchema.parse({}).squareHead).toBe(true)
})

test("squareheadbolt rejects legacy selectors and threadLength > length", () => {
  expect(() =>
    parseModelString("squareheadbolt_head(square)_drive(square)"),
  ).toThrow()
  expect(() => parseModelString("squareheadbolt_l20mm_threadl25mm")).toThrow()
})
