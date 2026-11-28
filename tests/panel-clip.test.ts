import { expect, test } from "bun:test"
import {
  getPanelClipDimensions,
  modelDefinitionSchema,
  panelClipModelPropsSchema,
  parseModelString,
} from "../src"

test("panelclip resolves 12x20mm 4-barb U-folded trim clip", () => {
  const parsed = parseModelString(
    "panelclip_w12mm_l20mm_strip0.8mm_gap3mm_legs2_barbs4_barbl2mm_barbh1mm_uform",
  )
  expect(parsed).toEqual({
    fn: "panelclip",
    width: 12,
    length: 20,
    stripThickness: 0.8,
    panelGap: 3,
    legs: 2,
    barbs: 4,
    barbLength: 2,
    barbHeight: 1,
    uForm: true,
  })
  expect(getPanelClipDimensions().barbTipSpan).toBeCloseTo(6.6, 6)
})

test("panelclip supports 15x25mm heavy trim clip and roundtrips", () => {
  const parsed = parseModelString("panelclip_w15mm_l25mm_gap4mm")
  expect(parsed.fn).toBe("panelclip")
  if (parsed.fn !== "panelclip") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(panelClipModelPropsSchema.parse({}).barbs).toBe(4)
})

test("panelclip rejects legacy selectors and oversized barbs", () => {
  expect(() => parseModelString("panelclip_form(u)")).toThrow()
  expect(() => parseModelString("panelclip_gap2mm_barbh3mm")).toThrow()
})
