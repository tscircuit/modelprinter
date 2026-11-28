import { expect, test } from "bun:test"
import {
  getHoneycombPanelDimensions,
  honeycombPanelModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("honeycombpanel resolves 200x100x10mm 6mm-cell sandwich panel", () => {
  const parsed = parseModelString(
    "honeycombpanel_l200mm_w100mm_t10mm_skint0.5mm_hexaf6mm_corewall0.1mm",
  )
  expect(parsed).toEqual({
    fn: "honeycombpanel",
    length: 200,
    width: 100,
    thickness: 10,
    skinThickness: 0.5,
    hexAcrossFlats: 6,
    coreWallThickness: 0.1,
  })

  const dims = getHoneycombPanelDimensions()
  expect(dims.coreHeight).toBe(9)
})

test("honeycombpanel supports thicker 20mm panel and schema roundtrip", () => {
  const parsed = parseModelString("honeycombpanel_l300mm_w150mm_t20mm_skint1mm")
  expect(parsed.fn).toBe("honeycombpanel")
  if (parsed.fn !== "honeycombpanel") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(honeycombPanelModelPropsSchema.parse({}).thickness).toBe(10)
})

test("honeycombpanel rejects skins consuming core thickness", () => {
  expect(() => parseModelString("honeycombpanel_t10mm_skint5mm")).toThrow()
})
