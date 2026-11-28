import { expect, test } from "bun:test"
import {
  drillPressViseModelPropsSchema,
  getDrillPressViseDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("drillpressvise resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "drillpressvise_jaww75mm_jawh25mm_open80mm_bodyl180mm_bodyw90mm_h45mm_mountslots4_slotw8mm_slotl20mm_pitchx140mm_pitchy75mm",
  )
  expect(parsed).toEqual({
    fn: "drillpressvise",
    jawWidth: 75,
    jawHeight: 25,
    maxOpening: 80,
    bodyLength: 180,
    bodyWidth: 90,
    height: 45,
    mountSlots: 4,
    slotWidth: 8,
    slotLength: 20,
    pitchX: 140,
    pitchY: 75,
  })
  expect(getDrillPressViseDimensions().baseRailHeight).toBeCloseTo(20, 6)
})

test("drillpressvise supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "drillpressvise_jaww100mm_bodyl220mm_bodyw115mm_pitchx175mm_pitchy95mm",
  )
  expect(parsed.fn).toBe("drillpressvise")
  if (parsed.fn !== "drillpressvise") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(drillPressViseModelPropsSchema.parse({})).toBeDefined()
})

test("drillpressvise rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("drillpressvise_spec(legacy)")).toThrow()
  expect(() => parseModelString("drillpressvise_jaww100mm_bodyw90mm")).toThrow()
})
