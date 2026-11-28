import { expect, test } from "bun:test"
import {
  flangeBearingModelPropsSchema,
  getFlangeBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flangebearing resolves UCF204-class 86x86mm four-bolt flange housing", () => {
  const parsed = parseModelString(
    "flangebearing_bore20mm_w86mm_h86mm_depth35mm_face4hole_holegrid(64mm,64mm)_holed10mm",
  )
  expect(parsed).toEqual({
    fn: "flangebearing",
    boreDiameter: 20,
    width: 86,
    height: 86,
    depth: 35,
    face4Hole: true,
    holeGridX: 64,
    holeGridY: 64,
    holeDiameter: 10,
  })

  const dims = getFlangeBearingDimensions()
  expect(dims.boltCircleDiameter).toBeCloseTo(90.5097, 3)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(35)
})

test("flangebearing supports split holegridx/holegridy tokens and schema roundtrip", () => {
  const parsed = parseModelString(
    "flangebearing_bore15mm_holegridx54mm_holegridy54mm",
  )
  expect(parsed.fn).toBe("flangebearing")
  if (parsed.fn !== "flangebearing") return
  expect(parsed.boreDiameter).toBe(15)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flangeBearingModelPropsSchema.parse({}).face4Hole).toBe(true)
})

test("flangebearing rejects legacy mount selectors and out-of-flange bolt grids", () => {
  expect(() =>
    parseModelString("flangebearing_bore20mm_mount(face4hole)"),
  ).toThrow()
  expect(() =>
    parseModelString("flangebearing_w80mm_holed10mm_holegrid(74mm,64mm)"),
  ).toThrow()
  expect(() => parseModelString("flangebearing_bore65mm_w86mm_h86mm")).toThrow()
})
