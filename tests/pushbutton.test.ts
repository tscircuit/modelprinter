import { expect, test } from "bun:test"
import {
  getPushbuttonDimensions,
  modelDefinitionSchema,
  parseModelString,
  pushbuttonModelPropsSchema,
} from "../src"

test("pushbutton resolves 22.5mm panel pushbutton head overhang and rear depth", () => {
  const parsed = parseModelString(
    "pushbutton_cutout22.5mm_bodyod22mm_l40mm_headod28mm_headh5mm_roundmomentary_threadnut_rearblock",
  )
  expect(parsed).toEqual({
    fn: "pushbutton",
    cutoutDiameter: 22.5,
    bodyOuterDiameter: 22,
    rearLength: 40,
    headOuterDiameter: 28,
    headHeight: 5,
    roundMomentary: true,
    threadNut: true,
    rearBlock: true,
  })

  const dims = getPushbuttonDimensions()
  expect(dims.bezelRadialOverhang).toBeCloseTo(2.75)
  expect(dims.overallLength).toBe(45)
  expect(dims.rearZ).toBe(-40)
  expect(dims.frontZ).toBe(5)
})

test("pushbutton supports 16mm miniature panel variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "pushbutton_cutout16.2mm_bodyod16mm_headod19mm_l3cm",
  )
  expect(parsed.fn).toBe("pushbutton")
  if (parsed.fn !== "pushbutton") return
  expect(parsed.rearLength).toBeCloseTo(30)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pushbuttonModelPropsSchema.parse({}).roundMomentary).toBe(true)
})

test("pushbutton rejects legacy selectors, oversized barrels and undersized heads", () => {
  expect(() =>
    parseModelString(
      "pushbutton_cutout22.5mm_bodyod22mm_l40mm_type(roundmomentary)_mount(threadnut)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("pushbutton_cutout22mm_bodyod23mm_headod28mm"),
  ).toThrow()
  expect(() =>
    parseModelString("pushbutton_cutout22.5mm_bodyod22mm_headod22mm"),
  ).toThrow()
})
