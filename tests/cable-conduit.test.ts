import { expect, test } from "bun:test"
import {
  cableConduitModelPropsSchema,
  getCableConduitDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("cableconduit resolves 20x16x100mm corrugated sleeve", () => {
  const parsed = parseModelString(
    "cableconduit_od20mm_id16mm_l100mm_p4mm_ribdepth1mm_roundcorrugated",
  )
  expect(parsed).toEqual({
    fn: "cableconduit",
    outerDiameter: 20,
    innerDiameter: 16,
    length: 100,
    pitch: 4,
    ribDepth: 1,
    roundCorrugated: true,
  })
  expect(getCableConduitDimensions().corrugationCount).toBe(25)
})

test("cableconduit supports 25mm conduit variant and schema roundtrip", () => {
  const parsed = parseModelString("cableconduit_od25mm_id20mm_l150mm")
  expect(parsed.fn).toBe("cableconduit")
  if (parsed.fn !== "cableconduit") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(cableConduitModelPropsSchema.parse({}).roundCorrugated).toBe(true)
})

test("cableconduit rejects legacy selectors and zero-wall rib depths", () => {
  expect(() =>
    parseModelString("cableconduit_profile(roundcorrugated)"),
  ).toThrow()
  expect(() =>
    parseModelString("cableconduit_od20mm_id18mm_ribdepth1.2mm"),
  ).toThrow()
})
