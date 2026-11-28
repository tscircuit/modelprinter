import { expect, test } from "bun:test"
import {
  dShaftModelPropsSchema,
  getDShaftDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("dshaft resolves 8x100mm shaft with 1mm centerline flat distance", () => {
  const parsed = parseModelString(
    "dshaft_d8mm_l100mm_flatdistance1mm_flatlength90mm_endchamfer0.5mm",
  )
  expect(parsed).toEqual({
    fn: "dshaft",
    diameter: 8,
    length: 100,
    flatDistance: 1,
    flatLength: 90,
    endChamfer: 0.5,
  })

  const dims = getDShaftDimensions()
  expect(dims.thicknessAcrossFlat).toBe(5)
  expect(dims.flatDepth).toBe(3)
})

test("dshaft supports 6x50mm full-flat shaft and schema roundtrip", () => {
  const parsed = parseModelString(
    "dshaft_d6mm_l50mm_flatdistance2mm_flatlength50mm",
  )
  expect(parsed.fn).toBe("dshaft")
  if (parsed.fn !== "dshaft") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(dShaftModelPropsSchema.parse({}).diameter).toBe(8)
})

test("dshaft rejects flatDistance >= radius and flatLength > length", () => {
  expect(() => parseModelString("dshaft_d8mm_flatdistance4mm")).toThrow()
  expect(() => parseModelString("dshaft_d8mm_l80mm_flatlength90mm")).toThrow()
})
