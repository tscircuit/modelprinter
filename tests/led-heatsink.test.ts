import { expect, test } from "bun:test"
import {
  getLedHeatsinkDimensions,
  ledHeatsinkModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ledheatsink resolves 50x20mm 16-fin radial emitter heatsink", () => {
  const parsed = parseModelString(
    "ledheatsink_od50mm_h20mm_base3mm_seatod20mm_fins16_fint1mm_holes2_hole3mm_hp16mm",
  )
  expect(parsed).toEqual({
    fn: "ledheatsink",
    outerDiameter: 50,
    height: 20,
    baseThickness: 3,
    seatOuterDiameter: 20,
    fins: 16,
    finThickness: 1,
    holes: 2,
    holeDiameter: 3,
    holePitch: 16,
  })
  expect(getLedHeatsinkDimensions().finRadialLength).toBe(15)
})

test("ledheatsink supports 70mm 24-fin variant and schema roundtrip", () => {
  const parsed = parseModelString("ledheatsink_od70mm_seatod28mm_fins24_hp19mm")
  expect(parsed.fn).toBe("ledheatsink")
  if (parsed.fn !== "ledheatsink") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ledHeatsinkModelPropsSchema.parse({}).fins).toBe(16)
})

test("ledheatsink rejects parenthesized tokens and overcrowded fins", () => {
  expect(() => parseModelString("ledheatsink_style(star)")).toThrow()
  expect(() =>
    parseModelString("ledheatsink_seatod20mm_fins60_fint1mm"),
  ).toThrow()
})
