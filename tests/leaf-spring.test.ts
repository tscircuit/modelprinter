import { expect, test } from "bun:test"
import {
  getLeafSpringDimensions,
  leafSpringModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("leafspring resolves 15x80x1mm R100mm circular-arc leaf spring", () => {
  const parsed = parseModelString(
    "leafspring_custom_w15mm_arcl80mm_h1mm_radius100mm_circulararc_squareends_free",
  )
  expect(parsed).toEqual({
    fn: "leafspring",
    custom: true,
    width: 15,
    arcLength: 80,
    thickness: 1,
    radius: 100,
    circularArc: true,
    squareEnds: true,
    freeState: true,
  })

  const dims = getLeafSpringDimensions()
  expect(dims.includedAngleRad).toBeCloseTo(0.8, 5)
  expect(dims.chordSpan).toBeGreaterThan(75)
})

test("leafspring supports wider 25mm strip variant and schema roundtrip", () => {
  const parsed = parseModelString("leafspring_w25mm_arcl120mm_radius150mm")
  expect(parsed.fn).toBe("leafspring")
  if (parsed.fn !== "leafspring") return
  expect(parsed.width).toBe(25)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(leafSpringModelPropsSchema.parse({}).circularArc).toBe(true)
})

test("leafspring rejects legacy selectors and wrap-around arc lengths", () => {
  expect(() =>
    parseModelString("leafspring_form(circulararc)_ends(square)"),
  ).toThrow()
  expect(() => parseModelString("leafspring_arcl350mm_radius100mm")).toThrow()
})
