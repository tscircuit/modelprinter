import { expect, test } from "bun:test"
import {
  dinRailModelPropsSchema,
  getDinRailDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("dinrail resolves EN 60715 TH35x7.5 unslotted top-hat mounting rail", () => {
  const parsed = parseModelString(
    "dinrail_en60715th35x7.5_w35mm_h7.5mm_l150mm_t1mm_basew27mm_lip4mm_tophat_unslotted",
  )
  expect(parsed).toEqual({
    fn: "dinrail",
    en60715Th35x75: true,
    width: 35,
    height: 7.5,
    length: 150,
    sheetThickness: 1,
    baseWidth: 27,
    lipWidth: 4,
    topHat: true,
    unslotted: true,
  })

  const dims = getDinRailDimensions()
  expect(dims.innerChannelWidth).toBe(25)
  expect(dims.innerChannelDepth).toBeCloseTo(6.5)
  expect(dims.topZ).toBeCloseTo(7.5)
})

test("dinrail supports slotted flag, TH35x15 deep variant and schema roundtrip", () => {
  const parsed = parseModelString("dinrail_th35x7.5_h15mm_l30cm_t1.5mm_slotted")
  expect(parsed.fn).toBe("dinrail")
  if (parsed.fn !== "dinrail") return
  expect(parsed.length).toBeCloseTo(300)
  expect(parsed.unslotted).toBe(false)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(dinRailModelPropsSchema.parse({}).topHat).toBe(true)
})

test("dinrail rejects legacy spec/profile selectors and inconsistent lip widths", () => {
  expect(() =>
    parseModelString("dinrail_spec(EN60715TH35x7.5)_profile(tophat)"),
  ).toThrow()
  expect(() => parseModelString("dinrail_w35mm_basew27mm_lip5mm")).toThrow()
  expect(() => parseModelString("dinrail_h7.5mm_t4mm")).toThrow()
})
