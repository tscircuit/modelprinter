import { expect, test } from "bun:test"
import {
  getSolidInsertDimensions,
  modelDefinitionSchema,
  parseModelString,
  solidInsertModelPropsSchema,
} from "../src"

test("solidinsert resolves M6-in-M10x1.5x12mm slotted repair sleeve", () => {
  const parsed = parseModelString(
    "solidinsert_custom_m6_externald10mm_externalthreadpitch1.5mm_l12mm_slotted_slotw1mm_slotdepth1.5mm_through",
  )
  expect(parsed).toEqual({
    fn: "solidinsert",
    custom: true,
    internalThread: "m6",
    externalDiameter: 10,
    externalThreadPitch: 1.5,
    length: 12,
    slotted: true,
    slotWidth: 1,
    slotDepth: 1.5,
    through: true,
  })
  expect(getSolidInsertDimensions().nominalWallThickness).toBe(2)
})

test("solidinsert supports M8-in-M12 variant and schema roundtrip", () => {
  const parsed = parseModelString("solidinsert_M8_externald12mm_l16mm")
  expect(parsed.fn).toBe("solidinsert")
  if (parsed.fn !== "solidinsert") return
  expect(parsed.internalThread).toBe("m8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(solidInsertModelPropsSchema.parse({}).through).toBe(true)
})

test("solidinsert rejects legacy selectors and thin walls", () => {
  expect(() =>
    parseModelString("solidinsert_drive(slotted)_thread(through)"),
  ).toThrow()
  expect(() => parseModelString("solidinsert_m6_externald7mm")).toThrow()
})
