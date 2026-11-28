import { expect, test } from "bun:test"
import {
  getHammerDriveAnchorDimensions,
  hammerDriveAnchorModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("hammerdriveanchor resolves 6x40mm mushroom-head hammer pin anchor", () => {
  const parsed = parseModelString(
    "hammerdriveanchor_d6mm_l40mm_headod12mm_headh2mm_pind2mm_pinexposed5mm_slots2_slotl15mm_unset",
  )
  expect(parsed).toEqual({
    fn: "hammerdriveanchor",
    outerDiameter: 6,
    length: 40,
    headOuterDiameter: 12,
    headHeight: 2,
    pinDiameter: 2,
    pinExposed: 5,
    slots: 2,
    slotLength: 15,
    unset: true,
  })
  expect(getHammerDriveAnchorDimensions().overallUnsetLength).toBe(45)
})

test("hammerdriveanchor supports 6x60mm anchor variant and roundtrips", () => {
  const parsed = parseModelString("hammerdriveanchor_l60mm_slotl22mm")
  expect(parsed.fn).toBe("hammerdriveanchor")
  if (parsed.fn !== "hammerdriveanchor") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(hammerDriveAnchorModelPropsSchema.parse({}).pinExposed).toBe(5)
})

test("hammerdriveanchor rejects legacy selectors and oversized pins", () => {
  expect(() => parseModelString("hammerdriveanchor_state(unset)")).toThrow()
  expect(() => parseModelString("hammerdriveanchor_d6mm_pind5mm")).toThrow()
})
