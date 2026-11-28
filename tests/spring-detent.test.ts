import { expect, test } from "bun:test"
import {
  getSpringDetentDimensions,
  modelDefinitionSchema,
  parseModelString,
  springDetentModelPropsSchema,
} from "../src"

test("springdetent resolves M6x15mm 3mm-ball spring detent", () => {
  const parsed = parseModelString(
    "springdetent_custom_m6_l15mm_balld3mm_projection1mm_flatfront_slottedrear_slotw1mm_slotdepth1mm",
  )
  expect(parsed).toEqual({
    fn: "springdetent",
    custom: true,
    thread: "m6",
    length: 15,
    ballDiameter: 3,
    projection: 1,
    flatFront: true,
    slottedRear: true,
    slotWidth: 1,
    slotDepth: 1,
  })

  const dims = getSpringDetentDimensions()
  expect(dims.overallLength).toBe(16)
  expect(dims.majorDiameter).toBe(6)
})

test("springdetent supports M8x20mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "springdetent_M8_l20mm_balld5mm_projection1.5mm",
  )
  expect(parsed.fn).toBe("springdetent")
  if (parsed.fn !== "springdetent") return
  expect(parsed.thread).toBe("m8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(springDetentModelPropsSchema.parse({}).flatFront).toBe(true)
})

test("springdetent rejects legacy selectors and uncaptive ball projections", () => {
  expect(() =>
    parseModelString("springdetent_front(flat)_rear(slotted)"),
  ).toThrow()
  expect(() =>
    parseModelString("springdetent_balld3mm_projection2mm"),
  ).toThrow()
})
