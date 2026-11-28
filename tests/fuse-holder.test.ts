import { expect, test } from "bun:test"
import {
  fuseHolderModelPropsSchema,
  getFuseHolderDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fuseholder resolves 5x20mm panel bayonet holder barrel and cap overhang", () => {
  const parsed = parseModelString(
    "fuseholder_fuse(5mm,20mm)_panelhole12mm_m12_threadpitch1mm_bodyl35mm_capod16mm_panelbayonet",
  )
  expect(parsed).toEqual({
    fn: "fuseholder",
    fuseDiameter: 5,
    fuseLength: 20,
    panelHoleDiameter: 12,
    thread: "m12",
    threadPitch: 1,
    bodyLength: 35,
    capOuterDiameter: 16,
    panelBayonet: true,
  })

  const dims = getFuseHolderDimensions()
  expect(dims.threadNominalDiameter).toBe(12)
  expect(dims.capFlangeRadialOverhang).toBeCloseTo(2)
  expect(dims.rearZ).toBe(-35)
  expect(dims.panelSeatZ).toBe(0)
  expect(dims.frontZ).toBeGreaterThan(4)
})

test("fuseholder supports split fused/fusel tokens and schema roundtrips", () => {
  const parsed = parseModelString(
    "fuseholder_fused6.35mm_fusel31.75mm_panelhole15mm_M15_bodyl45mm_capod19mm",
  )
  expect(parsed.fn).toBe("fuseholder")
  if (parsed.fn !== "fuseholder") return
  expect(parsed.thread).toBe("m15")
  expect(parsed.fuseDiameter).toBeCloseTo(6.35)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fuseHolderModelPropsSchema.parse({}).panelBayonet).toBe(true)
})

test("fuseholder rejects legacy type selectors, oversized fuses and short barrels", () => {
  expect(() =>
    parseModelString(
      "fuseholder_fuse(5mm,20mm)_panelhole12mm_m12_threadpitch1mm_bodyl35mm_capod16mm_type(panelbayonet)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("fuseholder_fuse(11mm,20mm)_panelhole12mm_m12"),
  ).toThrow()
  expect(() =>
    parseModelString("fuseholder_fuse(5mm,20mm)_bodyl18mm"),
  ).toThrow()
})
