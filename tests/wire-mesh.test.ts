import { expect, test } from "bun:test"
import {
  getWireMeshDimensions,
  modelDefinitionSchema,
  parseModelString,
  wireMeshModelPropsSchema,
} from "../src"

test("wiremesh resolves 200x100mm 10x10mm plain-weave wire screen", () => {
  const parsed = parseModelString(
    "wiremesh_l200mm_w100mm_wire1mm_pitchx10mm_pitchy10mm_plainweave_uncapped",
  )
  expect(parsed).toEqual({
    fn: "wiremesh",
    length: 200,
    width: 100,
    wireDiameter: 1,
    pitchX: 10,
    pitchY: 10,
    weaveStyle: "plainweave",
    edgeStyle: "uncapped",
  })
  expect(getWireMeshDimensions().apertureX).toBe(9)
})

test("wiremesh supports twill framed screen and roundtrips", () => {
  const parsed = parseModelString("wiremesh_twillweave_framededge_wire1.5mm")
  expect(parsed.fn).toBe("wiremesh")
  if (parsed.fn !== "wiremesh") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wireMeshModelPropsSchema.parse({}).pitchX).toBe(10)
})

test("wiremesh rejects closed apertures and legacy selectors", () => {
  expect(() => parseModelString("wiremesh_weave(plain)")).toThrow()
  expect(() => parseModelString("wiremesh_pitchx5mm_wire4mm")).toThrow()
})
