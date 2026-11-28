import { expect, test } from "bun:test"
import {
  getViseRiserDimensions,
  modelDefinitionSchema,
  parseModelString,
  viseRiserModelPropsSchema,
} from "../src"

test("viseriser resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "viseriser_l200mm_w120mm_h100mm_wall12mm_corel176mm_corew96mm_coreh76mm_topseatw80mm_topseatd5mm_mounts4_hole12.5mm_pitchx170mm_pitchy90mm",
  )
  expect(parsed).toEqual({
    fn: "viseriser",
    length: 200,
    width: 120,
    height: 100,
    wallThickness: 12,
    coreLength: 176,
    coreWidth: 96,
    coreHeight: 76,
    topSeatWidth: 80,
    topSeatDepth: 5,
    mounts: 4,
    holeDiameter: 12.5,
    pitchX: 170,
    pitchY: 90,
  })
  expect(getViseRiserDimensions().topDeckThickness).toBeCloseTo(19, 6)
})

test("viseriser supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "viseriser_l240mm_w140mm_pitchx200mm_pitchy110mm",
  )
  expect(parsed.fn).toBe("viseriser")
  if (parsed.fn !== "viseriser") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(viseRiserModelPropsSchema.parse({})).toBeDefined()
})

test("viseriser rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("viseriser_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("viseriser_w120mm_corew116mm_wall12mm"),
  ).toThrow()
})
