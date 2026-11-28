import { expect, test } from "bun:test"
import {
  edgeClipModelPropsSchema,
  getEdgeClipDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("edgeclip resolves 12x18mm 2mm-gap barbed flange edge clip", () => {
  const parsed = parseModelString(
    "edgeclip_w12mm_l18mm_strip0.8mm_gap2mm_barbs4_barbl3mm_barbh0.8mm_uform",
  )
  expect(parsed).toEqual({
    fn: "edgeclip",
    width: 12,
    length: 18,
    stripThickness: 0.8,
    panelGap: 2,
    barbs: 4,
    barbLength: 3,
    barbHeight: 0.8,
    uForm: true,
  })
  expect(getEdgeClipDimensions().throatClearanceAtBarbs).toBeCloseTo(0.4, 6)
})

test("edgeclip supports 3.5mm thick-flange clip and roundtrips", () => {
  const parsed = parseModelString("edgeclip_gap3.5mm_barbh1mm")
  expect(parsed.fn).toBe("edgeclip")
  if (parsed.fn !== "edgeclip") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(edgeClipModelPropsSchema.parse({}).barbs).toBe(4)
})

test("edgeclip rejects colliding inward barbs and legacy selectors", () => {
  expect(() => parseModelString("edgeclip_form(u)")).toThrow()
  expect(() => parseModelString("edgeclip_gap2mm_barbh1.2mm")).toThrow()
})
