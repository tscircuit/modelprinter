import { expect, test } from "bun:test"
import {
  getPianoHingeDimensions,
  modelDefinitionSchema,
  parseModelString,
  pianoHingeModelPropsSchema,
} from "../src"

test("pianohinge resolves 30x200mm continuous piano hinge and 10-hole layout", () => {
  const parsed = parseModelString(
    "pianohinge_w30mm_l200mm_t1mm_pin3mm_knucklel10mm_hole3mm_p40mm_rows2_open180deg_holes10_endoffset20mm",
  )
  expect(parsed).toEqual({
    fn: "pianohinge",
    openWidth: 30,
    length: 200,
    leafThickness: 1,
    pinDiameter: 3,
    knuckleLength: 10,
    holeDiameter: 3,
    holePitch: 40,
    rows: 2,
    openAngle: 180,
    holes: 10,
    endOffset: 20,
  })

  const dims = getPianoHingeDimensions()
  expect(dims.knuckleOuterDiameter).toBe(5)
  expect(dims.knuckleCount).toBe(20)
  expect(dims.holesPerRow).toBe(5)
  expect(dims.topZ).toBe(5)
})

test("pianohinge supports 300mm 14-hole variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "pianohinge_l30cm_holes14_p40mm_endoffset30mm",
  )
  expect(parsed.fn).toBe("pianohinge")
  if (parsed.fn !== "pianohinge") return
  expect(parsed.length).toBeCloseTo(300)
  expect(parsed.holes).toBe(14)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pianoHingeModelPropsSchema.parse({}).rows).toBe(2)
})

test("pianohinge rejects odd hole counts, overflowing hole pitches and parenthesized selectors", () => {
  expect(() => parseModelString("pianohinge_leaf(equal)")).toThrow()
  expect(() => parseModelString("pianohinge_holes9")).toThrow()
  expect(() =>
    parseModelString("pianohinge_l150mm_holes10_p40mm_endoffset20mm"),
  ).toThrow()
})
