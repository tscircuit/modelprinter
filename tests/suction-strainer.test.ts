import { expect, test } from "bun:test"
import {
  getSuctionStrainerDimensions,
  modelDefinitionSchema,
  parseModelString,
  suctionStrainerModelPropsSchema,
} from "../src"

test("suctionstrainer resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "suctionstrainer_npt0.5in_od45mm_l80mm_perfd3mm_perfp5mm_cylindrical_flatcap",
  )
  expect(parsed).toEqual({
    fn: "suctionstrainer",
    portNominal: 12.7,
    outerDiameter: 45,
    length: 80,
    perforationDiameter: 3,
    perforationPitch: 5,
    cylindrical: true,
    flatCap: true,
  })
  expect(getSuctionStrainerDimensions().screenLigament).toBeCloseTo(2, 6)
})

test("suctionstrainer supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "suctionstrainer_od60mm_l110mm_perfd4mm_perfp6.5mm",
  )
  expect(parsed.fn).toBe("suctionstrainer")
  if (parsed.fn !== "suctionstrainer") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(suctionStrainerModelPropsSchema.parse({})).toBeDefined()
})

test("suctionstrainer rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("suctionstrainer_spec(legacy)")).toThrow()
  expect(() => parseModelString("suctionstrainer_perfd6mm_perfp5mm")).toThrow()
})
