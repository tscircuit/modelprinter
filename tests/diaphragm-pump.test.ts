import { expect, test } from "bun:test"
import {
  diaphragmPumpModelPropsSchema,
  getDiaphragmPumpDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("diaphragmpump resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "diaphragmpump_portod10mm_l100mm_w70mm_h60mm_holep60mm_holes4_holed5mm_twindiaphragm_airdrive",
  )
  expect(parsed).toEqual({
    fn: "diaphragmpump",
    portOuterDiameter: 10,
    length: 100,
    width: 70,
    height: 60,
    holePitch: 60,
    holes: 4,
    holeDiameter: 5,
    twinDiaphragm: true,
    airDrive: true,
  })
  expect(getDiaphragmPumpDimensions().chamberHalfSpan).toBeCloseTo(35, 6)
})

test("diaphragmpump supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "diaphragmpump_portod12mm_l120mm_w85mm_holep70mm",
  )
  expect(parsed.fn).toBe("diaphragmpump")
  if (parsed.fn !== "diaphragmpump") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(diaphragmPumpModelPropsSchema.parse({})).toBeDefined()
})

test("diaphragmpump rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("diaphragmpump_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("diaphragmpump_l60mm_w70mm_holep68mm_holed5mm"),
  ).toThrow()
})
