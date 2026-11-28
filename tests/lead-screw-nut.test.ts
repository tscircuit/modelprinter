import { expect, test } from "bun:test"
import {
  getLeadScrewNutDimensions,
  leadScrewNutModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("leadscrewnut resolves Tr8x2 flanged 4-hole nut geometry", () => {
  const parsed = parseModelString(
    "leadscrewnut_bore8mm_od16mm_l15mm_flangeod26mm_tr8_threadpitch2mm_lead2mm_starts1_face4hole_pcd20mm_holed3mm",
  )
  expect(parsed).toEqual({
    fn: "leadscrewnut",
    boreDiameter: 8,
    bodyOuterDiameter: 16,
    length: 15,
    flangeOuterDiameter: 26,
    trapezoidalThread: "tr8",
    threadPitch: 2,
    lead: 2,
    starts: 1,
    face4Hole: true,
    pitchCircleDiameter: 20,
    holeDiameter: 3,
  })

  const dims = getLeadScrewNutDimensions()
  expect(dims.flangeThickness).toBeCloseTo(4)
  expect(dims.mountingHoleCount).toBe(4)
  expect(dims.topZ).toBe(15)
})

test("leadscrewnut supports 4-start Tr8x8 nut and schema roundtrip", () => {
  const parsed = parseModelString(
    "leadscrewnut_bore8mm_TR8_threadpitch2mm_lead8mm_starts4",
  )
  expect(parsed.fn).toBe("leadscrewnut")
  if (parsed.fn !== "leadscrewnut") return
  expect(parsed.lead).toBe(8)
  expect(parsed.trapezoidalThread).toBe("tr8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(leadScrewNutModelPropsSchema.parse({}).face4Hole).toBe(true)
})

test("leadscrewnut rejects legacy mount selectors and colliding flange holes", () => {
  expect(() =>
    parseModelString("leadscrewnut_bore8mm_mount(face4hole)"),
  ).toThrow()
  expect(() =>
    parseModelString("leadscrewnut_od16mm_flangeod26mm_pcd17mm_holed3mm"),
  ).toThrow()
})
