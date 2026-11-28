import { expect, test } from "bun:test"
import {
  getProngedTNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  prongedTNutModelPropsSchema,
} from "../src"

test("prongedtnut resolves M6 4-prong 19mm flanged tee nut", () => {
  const parsed = parseModelString(
    "prongedtnut_m6_barrelod8mm_l9mm_flangeod19mm_flangeh1mm_prongs4_prongl4mm_prongw2mm_pointedtip",
  )
  expect(parsed).toEqual({
    fn: "prongedtnut",
    threadDiameter: 6,
    barrelOuterDiameter: 8,
    length: 9,
    flangeOuterDiameter: 19,
    flangeHeight: 1,
    prongs: 4,
    prongLength: 4,
    prongWidth: 2,
    pointedTip: true,
  })
  expect(getProngedTNutDimensions().barrelProjection).toBe(8)
})

test("prongedtnut supports M8 11mm variant and roundtrips", () => {
  const parsed = parseModelString(
    "prongedtnut_m8_barrelod10mm_flangeod22mm_l11mm",
  )
  expect(parsed.fn).toBe("prongedtnut")
  if (parsed.fn !== "prongedtnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(prongedTNutModelPropsSchema.parse({}).prongs).toBe(4)
})

test("prongedtnut rejects overflowing prongs and legacy selectors", () => {
  expect(() => parseModelString("prongedtnut_tip(pointed)")).toThrow()
  expect(() => parseModelString("prongedtnut_l9mm_prongl9mm")).toThrow()
})
