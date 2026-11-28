import { expect, test } from "bun:test"
import {
  getHitchPinDimensions,
  hitchPinModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("hitchpin resolves bent handle reach, cross-hole datum and overall height", () => {
  const parsed = parseModelString(
    "hitchpin_custom_d6mm_l40mm_benthead_handlel20mm_bendr6mm_hole2mm_holeoffset5mm_chamfertip_chamfer0.5mm",
  )
  expect(parsed).toEqual({
    fn: "hitchpin",
    custom: true,
    diameter: 6,
    workingLength: 40,
    bentHead: true,
    handleLength: 20,
    bendRadius: 6,
    crossHoleDiameter: 2,
    crossHoleOffset: 5,
    chamferTip: true,
    tipChamfer: 0.5,
  })

  const dims = getHitchPinDimensions({
    diameter: 6,
    workingLength: 40,
    handleLength: 20,
    bendRadius: 6,
    crossHoleDiameter: 2,
    crossHoleOffset: 5,
    tipChamfer: 0.5,
  })
  expect(dims.crossHoleCenterFromBendDatum).toBeCloseTo(35)
  expect(dims.overallAxialHeight).toBeCloseTo(49)
  expect(dims.handleLateralReach).toBeCloseTo(26)
  expect(dims.tipZ).toBe(-40)
  expect(dims.topZ).toBeCloseTo(9)
})

test("hitchpin normalizes units, defaults flags and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "hitchpin_d6mm_l4cm_bent_handlel20mm_bendr6mm_holed2mm_holeoffset5mm",
  )
  expect(parsed.fn).toBe("hitchpin")
  if (parsed.fn !== "hitchpin") return
  expect(parsed.workingLength).toBeCloseTo(40)
  expect(parsed.tipChamfer).toBeCloseTo(0.5)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    hitchPinModelPropsSchema.parse({
      diameter: "6mm",
      workingLength: "40mm",
      handleLength: "20mm",
      bendRadius: "6mm",
      crossHoleDiameter: "2mm",
      crossHoleOffset: "5mm",
    }).bentHead,
  ).toBe(true)
})

test("hitchpin rejects legacy selectors, oversized cross-holes and invalid offsets", () => {
  expect(() =>
    parseModelString(
      "hitchpin_spec(custom)_d6mm_l40mm_head(bent)_handlel20mm_bendr6mm_hole2mm_holeoffset5mm_tip(chamfer)_chamfer0.5mm",
    ),
  ).toThrow()
  expect(() =>
    parseModelString(
      "hitchpin_d6mm_l40mm_handlel20mm_bendr6mm_hole5mm_holeoffset5mm",
    ),
  ).toThrow()
  expect(() =>
    parseModelString(
      "hitchpin_d6mm_l40mm_handlel20mm_bendr6mm_hole2mm_holeoffset1mm_chamfer0.5mm",
    ),
  ).toThrow()
  expect(() =>
    parseModelString(
      "hitchpin_d6mm_l40mm_handlel20mm_bendr2mm_hole2mm_holeoffset5mm",
    ),
  ).toThrow()
})
