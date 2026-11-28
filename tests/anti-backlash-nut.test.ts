import { expect, test } from "bun:test"
import {
  antiBacklashNutModelPropsSchema,
  getAntiBacklashNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("antibacklashnut resolves Tr8x2 spring-preloaded 2-hole flange nut", () => {
  const parsed = parseModelString(
    "antibacklashnut_bore8mm_od20mm_l30mm_tr8_threadpitch2mm_lead2mm_starts1_face2hole_flangeod32mm_pcd26mm_holed3mm",
  )
  expect(parsed).toEqual({
    fn: "antibacklashnut",
    boreDiameter: 8,
    outerDiameter: 20,
    length: 30,
    trapezoidalThread: "tr8",
    threadPitch: 2,
    lead: 2,
    starts: 1,
    face2Hole: true,
    flangeOuterDiameter: 32,
    pcd: 26,
    holeDiameter: 3,
  })

  const dims = getAntiBacklashNutDimensions()
  expect(dims.nominalThreadDiameter).toBe(8)
  expect(dims.topZ).toBe(30)
})

test("antibacklashnut supports 4-start Tr8x8 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "antibacklashnut_TR8_threadpitch2mm_lead8mm_starts4",
  )
  expect(parsed.fn).toBe("antibacklashnut")
  if (parsed.fn !== "antibacklashnut") return
  expect(parsed.trapezoidalThread).toBe("tr8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(antiBacklashNutModelPropsSchema.parse({}).face2Hole).toBe(true)
})

test("antibacklashnut rejects legacy selectors and inconsistent lead", () => {
  expect(() => parseModelString("antibacklashnut_mount(face2hole)")).toThrow()
  expect(() =>
    parseModelString("antibacklashnut_threadpitch2mm_lead8mm_starts2"),
  ).toThrow()
})
