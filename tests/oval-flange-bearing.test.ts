import { expect, test } from "bun:test"
import {
  getOvalFlangeBearingDimensions,
  modelDefinitionSchema,
  ovalFlangeBearingModelPropsSchema,
  parseModelString,
} from "../src"

test("ovalflangebearing resolves 20mm bore 2-bolt UCFL oval housing", () => {
  const parsed = parseModelString(
    "ovalflangebearing_bore20mm_l100mm_w45mm_depth35mm_face2hole_holepitch80mm_holed10mm",
  )
  expect(parsed).toEqual({
    fn: "ovalflangebearing",
    boreDiameter: 20,
    length: 100,
    width: 45,
    depth: 35,
    face2Hole: true,
    holePitch: 80,
    holeDiameter: 10,
  })

  const dims = getOvalFlangeBearingDimensions()
  expect(dims.mountingHoleCount).toBe(2)
  expect(dims.topZ).toBe(35)
})

test("ovalflangebearing supports 25mm bore variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "ovalflangebearing_bore25mm_l13cm_w68mm_holepitch99mm_holed12mm",
  )
  expect(parsed.fn).toBe("ovalflangebearing")
  if (parsed.fn !== "ovalflangebearing") return
  expect(parsed.length).toBeCloseTo(130)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ovalFlangeBearingModelPropsSchema.parse({}).face2Hole).toBe(true)
})

test("ovalflangebearing rejects legacy mount selectors and overflowing hole pitches", () => {
  expect(() => parseModelString("ovalflangebearing_mount(face2hole)")).toThrow()
  expect(() =>
    parseModelString("ovalflangebearing_l100mm_holepitch95mm_holed10mm"),
  ).toThrow()
})
