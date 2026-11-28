import { expect, test } from "bun:test"
import {
  clevisForkModelPropsSchema,
  getClevisForkDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("clevisfork resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "clevisfork_threadd6mm_l35mm_gap8mm_armw6mm_armh12mm_arml18mm_pind6mm_holeoffset6mm_shankod10mm_threaddepth12mm",
  )
  expect(parsed).toEqual({
    fn: "clevisfork",
    threadDiameter: 6,
    length: 35,
    slotGap: 8,
    armThickness: 6,
    armHeight: 12,
    armLength: 18,
    pinDiameter: 6,
    holeOffset: 6,
    shankOuterDiameter: 10,
    threadDepth: 12,
  })
  expect(getClevisForkDimensions().overallForkWidth).toBeCloseTo(20, 6)
})

test("clevisfork supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "clevisfork_threadd8mm_l42mm_gap10mm_arml22mm_shankod14mm_threaddepth16mm",
  )
  expect(parsed.fn).toBe("clevisfork")
  if (parsed.fn !== "clevisfork") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(clevisForkModelPropsSchema.parse({})).toBeDefined()
})

test("clevisfork rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("clevisfork_spec(legacy)")).toThrow()
  expect(() => parseModelString("clevisfork_threadd10mm_shankod10mm")).toThrow()
})
