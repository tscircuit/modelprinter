import { expect, test } from "bun:test"
import {
  dinBoxModelPropsSchema,
  getDinBoxDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("dinbox resolves 45x90x75mm TH35x7.5 modular housing", () => {
  const parsed = parseModelString(
    "dinbox_w45mm_d90mm_h75mm_wall2mm_th35x7.5_rearlowerclip_topbottomterminals_screwonlid",
  )
  expect(parsed).toEqual({
    fn: "dinbox",
    width: 45,
    depth: 90,
    height: 75,
    wallThickness: 2,
    th35x75: true,
    rearLowerClip: true,
    topBottomTerminals: true,
    screwOnLid: true,
  })

  const dims = getDinBoxDimensions()
  expect(dims.innerWidth).toBe(41)
  expect(dims.railSlotWidth).toBeCloseTo(35.4)
  expect(dims.topZ).toBe(90)
})

test("dinbox supports 3-module 54mm housing and schema roundtrip", () => {
  const parsed = parseModelString("dinbox_w54mm_h9cm")
  expect(parsed.fn).toBe("dinbox")
  if (parsed.fn !== "dinbox") return
  expect(parsed.height).toBeCloseTo(90)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(dinBoxModelPropsSchema.parse({}).th35x75).toBe(true)
})

test("dinbox rejects legacy selectors and heights shorter than DIN rail", () => {
  expect(() =>
    parseModelString("dinbox_rail(TH35x7.5)_clip(rearlower)_lid(screwon)"),
  ).toThrow()
  expect(() => parseModelString("dinbox_h35mm")).toThrow()
})
