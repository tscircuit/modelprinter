import { expect, test } from "bun:test"
import {
  getSquareWasherDimensions,
  modelDefinitionSchema,
  parseModelString,
  squareWasherModelPropsSchema,
} from "../src"

test("squarewasher resolves 25x25x3mm M8 square plate washer", () => {
  const parsed = parseModelString(
    "squarewasher_custom_id8.4mm_w25mm_l25mm_h3mm_centeredhole_squarecorners",
  )
  expect(parsed).toEqual({
    fn: "squarewasher",
    custom: true,
    innerDiameter: 8.4,
    width: 25,
    length: 25,
    height: 3,
    centeredHole: true,
    squareCorners: true,
  })

  const dims = getSquareWasherDimensions()
  expect(dims.minEdgeMargin).toBeCloseTo(8.3)
})

test("squarewasher supports M12 40x40x5mm washer and schema roundtrip", () => {
  const parsed = parseModelString("squarewasher_id13.5mm_w40mm_l40mm_h5mm")
  expect(parsed.fn).toBe("squarewasher")
  if (parsed.fn !== "squarewasher") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(squareWasherModelPropsSchema.parse({}).centeredHole).toBe(true)
})

test("squarewasher rejects parenthesized selectors and oversized bores", () => {
  expect(() =>
    parseModelString(
      "squarewasher_spec(custom)_hole(centered)_corners(square)",
    ),
  ).toThrow()
  expect(() => parseModelString("squarewasher_id24mm_w25mm_l25mm")).toThrow()
})
