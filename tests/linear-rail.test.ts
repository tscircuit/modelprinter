import { expect, test } from "bun:test"
import {
  getLinearRailDimensions,
  linearRailModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("linearrail resolves 300mm 5-hole HGR15 profile guideway rail", () => {
  const parsed = parseModelString(
    "linearrail_hgr15_w15mm_h15mm_l300mm_p60mm_firsthole30mm_holes5_hole4.5mm_counterbore7.5mm_counterboredepth5.3mm",
  )
  expect(parsed).toEqual({
    fn: "linearrail",
    hgr15: true,
    width: 15,
    height: 15,
    length: 300,
    pitch: 60,
    firstHole: 30,
    holes: 5,
    holeDiameter: 4.5,
    counterboreDiameter: 7.5,
    counterboreDepth: 5.3,
  })

  const dims = getLinearRailDimensions()
  expect(dims.lastHoleOffset).toBe(270)
  expect(dims.trailingEndMargin).toBe(30)
})

test("linearrail supports 420mm 7-hole HGR15 rail and schema roundtrip", () => {
  const parsed = parseModelString("linearrail_l42cm_holes7")
  expect(parsed.fn).toBe("linearrail")
  if (parsed.fn !== "linearrail") return
  expect(parsed.length).toBeCloseTo(420)
  expect(parsed.holes).toBe(7)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(linearRailModelPropsSchema.parse({}).hgr15).toBe(true)
})

test("linearrail rejects legacy series selectors and contradictory HGR15 widths", () => {
  expect(() => parseModelString("linearrail_series(hgr15)_l300mm")).toThrow()
  expect(() => parseModelString("linearrail_hgr15_w12mm")).toThrow()
  expect(() =>
    parseModelString("linearrail_l200mm_firsthole30mm_holes5"),
  ).toThrow()
})
