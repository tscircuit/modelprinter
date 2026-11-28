import { expect, test } from "bun:test"
import {
  getShaftDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  shaftModelDefinitionSchema,
  shaftModelPropsSchema,
} from "../src"

const source = "shaft_d8mm_l300mm_roundsolid_endchamfer1mm"

test("shaft public contract, dimensions and registry integration", () => {
  const model = mp.string(source).json()
  if (model.fn !== "shaft") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "shaft",
    roundSolid: true,
    diameter: 8,
    length: 300,
    endChamfer: 1,
  })
  expect(parseModelString(source)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(shaftModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("shaft")
  expect(mp.string(source).params()).toMatchObject({
    fn: "shaft",
    d: "8mm",
    l: "300mm",
    string: source,
  })
  expect(
    getShaftDimensions({ diameter: 8, length: 300, endChamfer: 1 }),
  ).toEqual({
    roundSolid: true,
    diameter: 8,
    length: 300,
    endChamfer: 1,
    endDiameter: 6,
    bearingZ: 0,
    topZ: 300,
  })
})

test("shaft bare names support renderer dispatch without a complete model", () => {
  for (const bare of ["shaft", "SHAFT"]) {
    const builder = mp.string(bare)
    expect(builder.params()).toMatchObject({
      fn: "shaft",
      string: bare,
    })
    expect(() => builder.json()).toThrow()
  }
})

test("shaft defaults, unit conversions and value-free roundsolid flag", () => {
  const concise = mp.string("shaft_d8mm_l300mm").json()
  expect(concise).toEqual({
    fn: "shaft",
    roundSolid: true,
    diameter: 8,
    length: 300,
    endChamfer: 0,
  })
  expect(mp.string("shaft_d8mm_l300mm_roundsolid").json()).toEqual(concise)
  expect(
    mp
      .string("SHAFT_diameter0.8CM_length30CM_ROUNDSOLID_endchamfer0.1CM")
      .json(),
  ).toEqual(mp.string(source).json())
  expect(
    shaftModelPropsSchema.parse({ diameter: "1in", length: "10cm" }).diameter,
  ).toBeCloseTo(25.4)
  expect(
    shaftModelPropsSchema.parse({ diameter: "1in", length: "10cm" }).length,
  ).toBeCloseTo(100)
})

test("shaft rejects enum selectors, duplicates and malformed tokens", () => {
  for (const suffix of [
    "style(roundsolid)",
    "style(hollow)",
    "roundsolid_roundsolid",
    "roundsolid(true)",
    "d8mm",
    "diameter8mm",
    "l300mm",
    "length300mm",
    "endchamfer1mm_chamfer1mm",
    "endchamfer4mm",
    "endchamfer-1mm",
    "d0",
    "l0",
    "d8mmjunk",
    "l1e2",
    "d(8mm)",
    "unknown1",
    "",
  ]) {
    expect(() => mp.string(`shaft_d8mm_l300mm_${suffix}`).json()).toThrow()
  }
  for (const invalid of [
    "shaft",
    "shaft_d8mm",
    "shaft_l300mm",
    "shaft(8)_d8mm_l300mm",
    "shaft8_d8mm_l300mm",
    "shaft_d8mm_l2mm_endchamfer1mm",
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
})

test("shaft direct schemas enforce positive dimensions and chamfer bounds", () => {
  for (const extra of [
    { diameter: 0 },
    { diameter: -5 },
    { diameter: Infinity },
    { diameter: NaN },
    { length: 0 },
    { length: -1 },
    { endChamfer: -0.1 },
    { endChamfer: 4 },
    { diameter: 10, length: 2, endChamfer: 1 },
    { roundSolid: false },
    { style: "roundsolid" },
    { unknown: true },
    { diameter: "8mmjunk" },
  ]) {
    const props = { diameter: 8, length: 300, ...extra }
    expect(() => shaftModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "shaft", ...props }),
    ).toThrow()
  }
})
