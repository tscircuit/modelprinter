import { expect, test } from "bun:test"
import {
  getVentPanelDimensions,
  modelDefinitionSchema,
  parseModelString,
  ventPanelModelPropsSchema,
} from "../src"

test("ventpanel resolves 100x60mm 6-louver ventilation cover", () => {
  const parsed = parseModelString(
    "ventpanel_w100mm_h60mm_t1mm_louvers6_p8mm_slitw80mm_louverdepth3mm_holes4_hole3mm_hp(90mm,50mm)",
  )
  expect(parsed).toEqual({
    fn: "ventpanel",
    width: 100,
    height: 60,
    thickness: 1,
    louvers: 6,
    louverPitch: 8,
    slitWidth: 80,
    louverDepth: 3,
    holes: 4,
    holeDiameter: 3,
    holePitchX: 90,
    holePitchY: 50,
  })

  const dims = getVentPanelDimensions()
  expect(dims.louverArraySpanY).toBe(40)
  expect(dims.overallProjection).toBe(4)
})

test("ventpanel supports 140x80mm 8-louver panel and roundtrips", () => {
  const parsed = parseModelString(
    "ventpanel_w14cm_h8cm_louvers8_slitw100mm_hp(125mm,65mm)",
  )
  expect(parsed.fn).toBe("ventpanel")
  if (parsed.fn !== "ventpanel") return
  expect(parsed.width).toBeCloseTo(140)
  expect(parsed.louvers).toBe(8)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ventPanelModelPropsSchema.parse({}).holes).toBe(4)
})

test("ventpanel rejects slits colliding with corner mounting holes", () => {
  expect(() =>
    parseModelString("ventpanel_slitw88mm_hole3mm_hp(90mm,50mm)"),
  ).toThrow()
})
