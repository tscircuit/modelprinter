import { expect, test } from "bun:test"
import {
  getGuardPanelClampDimensions,
  guardPanelClampModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("guardpanelclamp resolves 45x30x25mm 2-jaw wire-mesh guard clamp", () => {
  const parsed = parseModelString(
    "guardpanelclamp_w45mm_h30mm_parts2_partt12.5mm_groovew5mm_grooved2.5mm_holes2_hole8.5mm_pitch25mm_widthgroove",
  )
  expect(parsed).toEqual({
    fn: "guardpanelclamp",
    width: 45,
    height: 30,
    parts: 2,
    partThickness: 12.5,
    grooveWidth: 5,
    grooveDepth: 2.5,
    holes: 2,
    holeDiameter: 8.5,
    holePitch: 25,
    widthGroove: true,
  })
  expect(getGuardPanelClampDimensions().assembledThickness).toBe(25)
})

test("guardpanelclamp supports 60mm wide clamp and roundtrips", () => {
  const parsed = parseModelString("guardpanelclamp_w60mm_pitch35mm")
  expect(parsed.fn).toBe("guardpanelclamp")
  if (parsed.fn !== "guardpanelclamp") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(guardPanelClampModelPropsSchema.parse({}).parts).toBe(2)
})

test("guardpanelclamp rejects legacy selectors and overflowing bolt pitches", () => {
  expect(() => parseModelString("guardpanelclamp_grooveaxis(width)")).toThrow()
  expect(() => parseModelString("guardpanelclamp_w45mm_pitch40mm")).toThrow()
})
