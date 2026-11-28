import { expect, test } from "bun:test"
import {
  getReedCapsuleDimensions,
  modelDefinitionSchema,
  parseModelString,
  reedCapsuleModelPropsSchema,
} from "../src"

test("reedcapsule resolves 3x15mm axial glass reed switch", () => {
  const parsed = parseModelString(
    "reedcapsule_od3mm_l15mm_leadod0.5mm_leadl10mm_axialglass_contacts2_throughhole",
  )
  expect(parsed).toEqual({
    fn: "reedcapsule",
    outerDiameter: 3,
    bodyLength: 15,
    leadOuterDiameter: 0.5,
    leadLength: 10,
    axialGlass: true,
    contacts: 2,
    throughHole: true,
  })
  expect(getReedCapsuleDimensions().overallSpan).toBe(35)
})

test("reedcapsule supports 2x10mm subminiature variant and roundtrips", () => {
  const parsed = parseModelString("reedcapsule_od2mm_l10mm_leadod0.4mm")
  expect(parsed.fn).toBe("reedcapsule")
  if (parsed.fn !== "reedcapsule") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(reedCapsuleModelPropsSchema.parse({}).axialGlass).toBe(true)
})

test("reedcapsule rejects legacy selectors and oversized wire leads", () => {
  expect(() =>
    parseModelString("reedcapsule_type(axialglass)_mount(throughhole)"),
  ).toThrow()
  expect(() => parseModelString("reedcapsule_od3mm_leadod2mm")).toThrow()
})
