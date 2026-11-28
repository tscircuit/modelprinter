import { expect, test } from "bun:test"
import {
  fixtureJackModelPropsSchema,
  getFixtureJackDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fixturejack resolves 50mm-high M8-base machinist screw jack", () => {
  const parsed = parseModelString(
    "fixturejack_based30mm_baseh10mm_h50mm_travel20mm_stem12mm_m8_threadl10mm_padd20mm_padt5mm",
  )
  expect(parsed).toEqual({
    fn: "fixturejack",
    baseDiameter: 30,
    baseHeight: 10,
    height: 50,
    travel: 20,
    stemDiameter: 12,
    threadDiameter: 8,
    threadLength: 10,
    padDiameter: 20,
    padThickness: 5,
  })
  expect(getFixtureJackDimensions().extendedHeight).toBe(70)
})

test("fixturejack supports 75mm tall heavy jack and roundtrips", () => {
  const parsed = parseModelString("fixturejack_based45mm_h75mm_stem16mm_m10")
  expect(parsed.fn).toBe("fixturejack")
  if (parsed.fn !== "fixturejack") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fixtureJackModelPropsSchema.parse({}).travel).toBe(20)
})

test("fixturejack rejects overflowing travel and parenthesized tokens", () => {
  expect(() => parseModelString("fixturejack_top(swivel)")).toThrow()
  expect(() => parseModelString("fixturejack_h50mm_travel40mm")).toThrow()
})
