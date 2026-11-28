import { expect, test } from "bun:test"
import {
  getSnapBoxDimensions,
  modelDefinitionSchema,
  parseModelString,
  snapBoxModelPropsSchema,
} from "../src"

test("snapbox resolves 80x50x25 snap-fit recessed-lid enclosure", () => {
  const parsed = parseModelString(
    "snapbox_w80mm_d50mm_h25mm_wall2mm_corner2mm_lidt2mm_hooks4_hookw8mm_hookd1mm_lap2mm",
  )
  expect(parsed).toEqual({
    fn: "snapbox",
    width: 80,
    depth: 50,
    height: 25,
    wallThickness: 2,
    cornerRadius: 2,
    lidThickness: 2,
    hooks: 4,
    hookWidth: 8,
    hookDepth: 1,
    recessLap: 2,
    snapLid: true,
  })

  const dims = getSnapBoxDimensions()
  expect(dims.lidSeatZ).toBe(23)
  expect(dims.hookTipZ).toBe(21)
  expect(dims.innerWidth).toBe(76)
  expect(dims.topZ).toBe(25)
})

test("snapbox supports unit conversions, square corners and schema roundtrip", () => {
  const parsed = parseModelString("snapbox_w9cm_corner0mm_snaplid")
  expect(parsed.fn).toBe("snapbox")
  if (parsed.fn !== "snapbox") return
  expect(parsed.width).toBeCloseTo(90)
  expect(parsed.cornerRadius).toBe(0)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(snapBoxModelPropsSchema.parse({}).hooks).toBe(4)
})

test("snapbox rejects legacy selectors, wall-piercing hooks and oversized hook widths", () => {
  expect(() => parseModelString("snapbox_lid(snap)")).toThrow()
  expect(() => parseModelString("snapbox_wall2mm_hookd2.5mm")).toThrow()
  expect(() => parseModelString("snapbox_d20mm_wall2mm_hookw18mm")).toThrow()
})
