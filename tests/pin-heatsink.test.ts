import { expect, test } from "bun:test"
import {
  getPinHeatsinkDimensions,
  modelDefinitionSchema,
  parseModelString,
  pinHeatsinkModelPropsSchema,
} from "../src"

test("pinheatsink resolves 30x30x20mm 4x4 pin-fin heatsink", () => {
  const parsed = parseModelString(
    "pinheatsink_w30mm_l30mm_base3mm_h20mm_pinod3mm_grid(4,4)_p6mm_holes4_hole3mm_hp(24mm,24mm)",
  )
  expect(parsed).toEqual({
    fn: "pinheatsink",
    width: 30,
    length: 30,
    baseThickness: 3,
    height: 20,
    pinOuterDiameter: 3,
    gridX: 4,
    gridY: 4,
    pitch: 6,
    holes: 4,
    holeDiameter: 3,
    holePitchX: 24,
    holePitchY: 24,
  })
  expect(getPinHeatsinkDimensions().pinCount).toBe(16)
})

test("pinheatsink supports 40x40mm 5x5 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "pinheatsink_w40mm_l40mm_grid(5,5)_hp(32mm,32mm)",
  )
  expect(parsed.fn).toBe("pinheatsink")
  if (parsed.fn !== "pinheatsink") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pinHeatsinkModelPropsSchema.parse({}).holes).toBe(4)
})

test("pinheatsink rejects overflowing pin arrays and unsupported selectors", () => {
  expect(() => parseModelString("pinheatsink_pin(square)")).toThrow()
  expect(() => parseModelString("pinheatsink_w30mm_grid(8,8)_p6mm")).toThrow()
})
