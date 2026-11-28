import { expect, test } from "bun:test"
import {
  getLeadScrewDimensions,
  leadScrewModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("leadscrew resolves single-start Tr8x2 lead screw geometry", () => {
  const parsed = parseModelString(
    "leadscrew_d8mm_l300mm_tr8_threadpitch2mm_lead2mm_starts1",
  )
  expect(parsed).toEqual({
    fn: "leadscrew",
    diameter: 8,
    length: 300,
    trapezoidalThread: "tr8",
    threadPitch: 2,
    lead: 2,
    starts: 1,
    rightHanded: true,
  })

  const dims = getLeadScrewDimensions()
  expect(dims.pitchDiameter).toBeCloseTo(7)
  expect(dims.rootDiameter).toBeCloseTo(6)
  expect(dims.flankAngleDeg).toBe(30)
})

test("leadscrew supports 4-start T8x8 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "leadscrew_d8mm_l40cm_TR8_threadpitch2mm_lead8mm_starts4",
  )
  expect(parsed.fn).toBe("leadscrew")
  if (parsed.fn !== "leadscrew") return
  expect(parsed.length).toBeCloseTo(400)
  expect(parsed.lead).toBe(8)
  expect(parsed.trapezoidalThread).toBe("tr8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(leadScrewModelPropsSchema.parse({}).rightHanded).toBe(true)
})

test("leadscrew rejects mismatched lead or mismatched Tr diameter", () => {
  expect(() =>
    parseModelString("leadscrew_d8mm_tr8_threadpitch2mm_lead6mm_starts2"),
  ).toThrow()
  expect(() => parseModelString("leadscrew_d10mm_tr8")).toThrow()
})
