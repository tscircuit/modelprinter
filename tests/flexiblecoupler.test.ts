import { expect, test } from "bun:test"
import {
  flexibleCouplerModelDefinitionSchema,
  flexibleCouplerModelPropsSchema,
  getFlexibleCouplerDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
} from "../src"

const source =
  "flexiblecoupler_bore5mm_boreb8mm_od19mm_l25mm_helicalbeam_turns5_cutw1mm_splitclamp"

test("flexible coupler public contract, dimensions and registry integration", () => {
  const model = mp.string(source).json()
  if (model.fn !== "flexiblecoupler") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "flexiblecoupler",
    boreDiameter: 5,
    boreBDiameter: 8,
    outerDiameter: 19,
    length: 25,
    turns: 5,
    cutWidth: 1,
    helicalBeam: true,
    splitClamp: true,
  })
  expect(parseModelString(source)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(flexibleCouplerModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("flexiblecoupler")
  expect(mp.string(source).params()).toMatchObject({
    fn: "flexiblecoupler",
    bore: "5mm",
    od: "19mm",
    string: source,
  })
  expect(
    getFlexibleCouplerDimensions({
      boreDiameter: 5,
      boreBDiameter: 8,
      outerDiameter: 19,
      length: 25,
      turns: 5,
      cutWidth: 1,
    }),
  ).toEqual({
    boreDiameter: 5,
    boreBDiameter: 8,
    outerDiameter: 19,
    length: 25,
    turns: 5,
    cutWidth: 1,
    helicalBeam: true,
    splitClamp: true,
    minimumWallThickness: 5.5,
    flexZoneLength: 5,
    hubLength: 10,
    boreADepth: 12.5,
    boreBDepth: 12.5,
  })
})

test("flexible coupler bare names support renderer dispatch without a complete model", () => {
  for (const bare of ["flexiblecoupler", "FLEXIBLECOUPLER"]) {
    const builder = mp.string(bare)
    expect(builder.params()).toMatchObject({
      fn: "flexiblecoupler",
      string: bare,
    })
    expect(() => builder.json()).toThrow()
  }
})

test("flexible coupler defaults, boreB fallback, unit conversions and value-free flags", () => {
  const symmetric = mp
    .string("flexiblecoupler_bore6mm_od19mm_l25mm_turns5_cutw1mm")
    .json()
  expect(symmetric).toEqual({
    fn: "flexiblecoupler",
    boreDiameter: 6,
    boreBDiameter: 6,
    outerDiameter: 19,
    length: 25,
    turns: 5,
    cutWidth: 1,
    helicalBeam: true,
    splitClamp: true,
  })
  expect(
    mp
      .string(
        "FLEXIBLECOUPLER_borea0.5CM_borebdiameter0.8CM_outerdiameter1.9CM_length2.5CM_HELICALBEAM_turns5_cutwidth0.1CM_SPLITCLAMP",
      )
      .json(),
  ).toEqual(mp.string(source).json())
  expect(
    flexibleCouplerModelPropsSchema.parse({
      boreDiameter: "0.25in",
      outerDiameter: "1in",
      length: "2.5cm",
      turns: 5,
      cutWidth: 1,
    }).boreDiameter,
  ).toBeCloseTo(6.35)
})

test("flexible coupler rejects enum selectors, duplicates and malformed tokens", () => {
  const base = "flexiblecoupler_bore5mm_od19mm_l25mm_turns5_cutw1mm"
  for (const suffix of [
    "style(helicalbeam)",
    "mount(splitclamp)",
    "helicalbeam(true)",
    "splitclamp(true)",
    "helicalbeam_helicalbeam",
    "splitclamp_splitclamp",
    "bore5mm",
    "borea5mm",
    "od19mm",
    "l25mm",
    "turns5",
    "turns0",
    "turns5mm",
    "cutw1mm",
    "cutw5mm",
    "bore19mm",
    "boreb19mm",
    "unknown1",
    "",
  ]) {
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  }
  for (const invalid of [
    "flexiblecoupler",
    "flexiblecoupler_bore5mm",
    "flexiblecoupler(5)_bore5mm_od19mm_l25mm_turns5_cutw1mm",
    "flexiblecoupler5_bore5mm_od19mm_l25mm_turns5_cutw1mm",
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
})

test("flexible coupler direct schemas enforce bore and flex-zone bounds", () => {
  const valid = {
    boreDiameter: 5,
    boreBDiameter: 8,
    outerDiameter: 19,
    length: 25,
    turns: 5,
    cutWidth: 1,
  }
  for (const extra of [
    { boreDiameter: 19 },
    { boreBDiameter: 20 },
    { outerDiameter: 8 },
    { turns: 0 },
    { turns: 2.5 },
    { cutWidth: 0 },
    { cutWidth: 5 },
    { helicalBeam: false },
    { splitClamp: false },
    { style: "helicalbeam" },
    { mount: "splitclamp" },
    { unknown: true },
    { length: "25mmjunk" },
  ]) {
    const props = { ...valid, ...extra }
    expect(() => flexibleCouplerModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "flexiblecoupler", ...props }),
    ).toThrow()
  }
})
