import { expect, test } from "bun:test"
import {
  getRoundBeltDimensions,
  modelDefinitionSchema,
  parseModelString,
  roundBeltModelPropsSchema,
} from "../src"

test("roundbelt resolves 6x500mm endless circular drive belt", () => {
  const parsed = parseModelString("roundbelt_d6mm_l500mm_endless_circular")
  expect(parsed).toEqual({
    fn: "roundbelt",
    crossSectionDiameter: 6,
    pitchLength: 500,
    endless: true,
    circular: true,
  })
  expect(getRoundBeltDimensions().loopCenterDiameter).toBeCloseTo(
    500 / Math.PI,
    4,
  )
})

test("roundbelt supports 8x800mm variant and schema roundtrip", () => {
  const parsed = parseModelString("roundbelt_d8mm_l800mm")
  expect(parsed.fn).toBe("roundbelt")
  if (parsed.fn !== "roundbelt") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(roundBeltModelPropsSchema.parse({}).endless).toBe(true)
})

test("roundbelt rejects legacy selectors and self-intersecting loops", () => {
  expect(() =>
    parseModelString("roundbelt_style(endless)_section(circular)"),
  ).toThrow()
  expect(() => parseModelString("roundbelt_d10mm_l50mm")).toThrow()
})
