import { expect, test } from "bun:test"
import {
  extensionSpringModelDefinitionSchema,
  extensionSpringModelPropsSchema,
  getExtensionSpringDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
} from "../src"

const source =
  "extensionspring_custom_od8mm_wire1mm_bodyl15mm_turns15_fullcircle_hookid6mm_aligned_righthanded_free"

test("extension spring public contract, dimensions and registry integration", () => {
  const model = mp.string(source).json()
  if (model.fn !== "extensionspring") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "extensionspring",
    custom: true,
    outerDiameter: 8,
    wireDiameter: 1,
    bodyLength: 15,
    turns: 15,
    hookInnerDiameter: 6,
    fullCircleHook: true,
    hooksAligned: true,
    leftHanded: false,
    free: true,
  })
  expect(parseModelString(source)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(extensionSpringModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("extensionspring")
  expect(mp.string(source).params()).toMatchObject({
    fn: "extensionspring",
    od: "8mm",
    wire: "1mm",
    string: source,
  })
  expect(
    getExtensionSpringDimensions({
      outerDiameter: 8,
      wireDiameter: 1,
      bodyLength: 15,
      turns: 15,
      hookInnerDiameter: 6,
    }),
  ).toEqual({
    custom: true,
    outerDiameter: 8,
    wireDiameter: 1,
    bodyLength: 15,
    turns: 15,
    hookInnerDiameter: 6,
    fullCircleHook: true,
    hooksAligned: true,
    leftHanded: false,
    free: true,
    insideDiameter: 6,
    meanDiameter: 7,
    overallFreeLength: 29,
  })
})

test("extension spring bare names support renderer dispatch without a complete model", () => {
  for (const bare of ["extensionspring", "EXTENSIONSPRING"]) {
    const builder = mp.string(bare)
    expect(builder.params()).toMatchObject({
      fn: "extensionspring",
      string: bare,
    })
    expect(() => builder.json()).toThrow()
  }
})

test("extension spring defaults, unit conversions, perpendicular hooks and left-hand winding", () => {
  const concise = mp
    .string("extensionspring_od8mm_wire1mm_bodyl15mm_turns15_hookid6mm")
    .json()
  expect(concise).toEqual(mp.string(source).json())
  expect(
    mp
      .string(
        "EXTENSIONSPRING_CUSTOM_outerdiameter0.8CM_wirediameter0.1CM_bodylength1.5CM_turns15_FULLCIRCLEHOOK_hookinnerdiameter0.6CM_PERPENDICULAR_LEFTHANDED_FREE",
      )
      .json(),
  ).toEqual({
    fn: "extensionspring",
    custom: true,
    outerDiameter: 8,
    wireDiameter: 1,
    bodyLength: 15,
    turns: 15,
    hookInnerDiameter: 6,
    fullCircleHook: true,
    hooksAligned: false,
    leftHanded: true,
    free: true,
  })
  expect(
    extensionSpringModelPropsSchema.parse({
      outerDiameter: "1in",
      wireDiameter: "0.1in",
      bodyLength: 50,
      turns: 10,
      hookInnerDiameter: 15,
    }).outerDiameter,
  ).toBeCloseTo(25.4)
})

test("extension spring rejects enum selectors, duplicates and malformed tokens", () => {
  const base = "extensionspring_od8mm_wire1mm_bodyl15mm_turns15_hookid6mm"
  for (const suffix of [
    "spec(custom)",
    "hook(fullcircle)",
    "hookplanes(aligned)",
    "hand(right)",
    "state(free)",
    "custom_custom",
    "free_free",
    "fullcircle_fullcirclehook",
    "aligned_perpendicular",
    "aligned_aligned",
    "lefthanded_righthanded",
    "lefthanded_lefthanded",
    "od8mm",
    "wire1mm",
    "bodyl15mm",
    "turns15",
    "turns0",
    "turns15mm",
    "hookid6mm",
    "hookid8mm",
    "bodyl10mm",
    "od2mm",
    "unknown1",
    "",
  ]) {
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  }
  for (const invalid of [
    "extensionspring",
    "extensionspring_od8mm",
    "extensionspring(8)_od8mm_wire1mm_bodyl15mm_turns15_hookid6mm",
    "extensionspring8_od8mm_wire1mm_bodyl15mm_turns15_hookid6mm",
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
})

test("extension spring direct schemas enforce coil and hook bounds", () => {
  const valid = {
    outerDiameter: 8,
    wireDiameter: 1,
    bodyLength: 15,
    turns: 15,
    hookInnerDiameter: 6,
  }
  for (const extra of [
    { outerDiameter: 2 },
    { wireDiameter: 4 },
    { bodyLength: 14 },
    { turns: 0 },
    { turns: 16 },
    { hookInnerDiameter: 8 },
    { custom: false },
    { fullCircleHook: false },
    { free: false },
    { hooksAligned: "aligned" },
    { leftHanded: "left" },
    { spec: "custom" },
    { unknown: true },
    { bodyLength: "15mmjunk" },
  ]) {
    const props = { ...valid, ...extra }
    expect(() => extensionSpringModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "extensionspring", ...props }),
    ).toThrow()
  }
})
