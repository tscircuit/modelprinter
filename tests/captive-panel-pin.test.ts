import { expect, test } from "bun:test"
import {
  captivePanelPinModelPropsSchema,
  getCaptivePanelPinDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("captivepanelpin resolves 6x25mm 5mm-stroke spring panel pin", () => {
  const parsed = parseModelString(
    "captivepanelpin_d6mm_l25mm_knobod15mm_knobh8mm_collarod10mm_collarh2mm_springod8mm_wire0.8mm_stroke5mm_extended",
  )
  expect(parsed).toEqual({
    fn: "captivepanelpin",
    pinDiameter: 6,
    length: 25,
    knobOuterDiameter: 15,
    knobHeight: 8,
    collarOuterDiameter: 10,
    collarHeight: 2,
    springOuterDiameter: 8,
    wireDiameter: 0.8,
    stroke: 5,
    extended: true,
  })
  expect(getCaptivePanelPinDimensions().overallLength).toBe(33)
})

test("captivepanelpin supports 8x35mm heavy indexing pin and roundtrips", () => {
  const parsed = parseModelString(
    "captivepanelpin_d8mm_l35mm_collarod12mm_knobod20mm",
  )
  expect(parsed.fn).toBe("captivepanelpin")
  if (parsed.fn !== "captivepanelpin") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(captivePanelPinModelPropsSchema.parse({}).stroke).toBe(5)
})

test("captivepanelpin rejects legacy selectors and excessive strokes", () => {
  expect(() => parseModelString("captivepanelpin_state(extended)")).toThrow()
  expect(() => parseModelString("captivepanelpin_l15mm_stroke12mm")).toThrow()
})
