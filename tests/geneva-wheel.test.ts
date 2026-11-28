import { expect, test } from "bun:test"
import {
  genevaWheelModelPropsSchema,
  getGenevaWheelDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("genevawheel resolves 60x10mm 6-slot keyed Geneva wheel", () => {
  const parsed = parseModelString(
    "genevawheel_od60mm_w10mm_bore8mm_slots6_keyway_keyw3mm_slotw6mm_lockradius20mm",
  )
  expect(parsed).toEqual({
    fn: "genevawheel",
    outerDiameter: 60,
    width: 10,
    boreDiameter: 8,
    slots: 6,
    keyway: true,
    keyWidth: 3,
    slotWidth: 6,
    lockRadius: 20,
  })
  expect(getGenevaWheelDimensions().indexAngleDeg).toBe(60)
})

test("genevawheel supports 4-slot 80mm variant and schema roundtrip", () => {
  const parsed = parseModelString("genevawheel_od80mm_slots4_lockradius28mm")
  expect(parsed.fn).toBe("genevawheel")
  if (parsed.fn !== "genevawheel") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(genevaWheelModelPropsSchema.parse({}).keyway).toBe(true)
})

test("genevawheel rejects legacy selectors and oversized lock arcs", () => {
  expect(() => parseModelString("genevawheel_mount(keyway)")).toThrow()
  expect(() => parseModelString("genevawheel_od60mm_lockradius35mm")).toThrow()
})
