import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  modelprinter,
  setscrewDimensions,
  setscrewModelPropsSchema,
  setscrewModelDefinitionSchema,
} from "../src"
import { parseSetScrewModelParams } from "../src/models/setscrew/parse-model-string"
const source = "setscrew_m3_l6mm_hexsocket_cuppoint"
test("setscrew requested contract and public schema roundtrip", () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "setscrew") throw new Error("Wrong model")
  expect(definition).toMatchObject({
    metricSize: "M3",
    length: 6,
    iso4029: true,
    leftHand: false,
    showThreads: true,
    ...setscrewDimensions.M3,
  })
  expect(setscrewModelDefinitionSchema.parse(definition)).toEqual(definition)
  expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  const { fn, ...props } = definition
  expect(setscrewModelPropsSchema.parse(props)).toEqual(props)
  expect(modelprinter.getModelNames()).toContain("setscrew")
  expect(mp.string(source.toUpperCase()).json()).toEqual(definition)
})
test("setscrew supported sizes, units and fixed dimensions", () => {
  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const props = setscrewModelPropsSchema.parse({ metricSize, length: "1in" })
    expect(props.length).toBeCloseTo(25.4)
    expect(props).toMatchObject(setscrewDimensions[metricSize])
    expect(
      mp
        .string(`setscrew_metricsize(${metricSize.toLowerCase()})_length2.54cm`)
        .json(),
    ).toMatchObject(props)
    expect(
      mp
        .string(
          `setscrew_m${metricSize.slice(1)}_l25.4mm_threadpitch${props.threadPitch}mm`,
        )
        .json(),
    ).toMatchObject(props)
  }
  expect(mp.string(source + "_lefthanded_nothreads").json()).toMatchObject({
    leftHand: true,
    showThreads: false,
  })
})
test("setscrew rejects conflicting, duplicate and malformed tokens", () => {
  for (const tail of [
    "_m3",
    "_length10mm",
    "_iso4029_iso4029",
    "_iso4029_ISO4029",
    "_iso4029(false)",
    "_iso4029(true)",
    "_iso40291",
    "_iso4029:2003",
    "_iso4017",
    "_standard(iso4029)",
    "_standard(iso4029:2003)",
    "_headstandard(iso4029)",
    "_righthanded_lefthanded",
    "_threads_nothreads",
    "_threads_threads",
    "_threadpitch0.01mm",
    "_d100mm",
    "_unknown1mm",
    "_threads1",
    "_l1e2mm",
    "_l1mmjunk",
    "_l(10mm)",
    "_l-10mm",
    "_lNaN",
    "_l1.2.3mm",
    "_l",
    "_",
  ])
    expect(() => mp.string(source + tail).json()).toThrow()
  for (const flag of ["hexsocket", "cuppoint"])
    expect(() => mp.string(source + `_${flag}`).json()).toThrow()
  for (const source of [
    "setscrew",
    "setscrew_m1_l10mm",
    "setscrew_m3_l0mm",
    "setscrew(3)_m3_l10mm",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    parseSetScrewModelParams({ fn: "wrong", string: source }),
  ).toThrow()
})
test("setscrew strict public schema and length guards", () => {
  for (const length of [
    0,
    -1,
    NaN,
    Infinity,
    "1e2mm",
    "10mmjunk",
    " 10mm",
    "10mm ",
    "bad",
  ])
    expect(() =>
      setscrewModelPropsSchema.parse({ metricSize: "M3", length }),
    ).toThrow()
  for (const invalid of [
    { mystery: true },
    { metricSize: "M7" },
    { iso4029: false },
    { iso4029: "iso4029" },
    { iso4017: true },
    { standard: "iso4029:2003" },
    { headStandard: "iso4029:2003" },
    { diameter: 99 },
    { threadPitch: 0.01 },
    { hexSocket: false },
    { cupPoint: false },
  ])
    expect(() =>
      setscrewModelPropsSchema.parse({
        metricSize: "M3",
        length: 6,
        ...invalid,
      }),
    ).toThrow()
  const dimensions = setscrewDimensions.M3
  const minimum =
    dimensions.socketDepth + dimensions.cupDepth + dimensions.pointTaperLength
  expect(() =>
    setscrewModelPropsSchema.parse({ metricSize: "M3", length: minimum }),
  ).toThrow()
  expect(
    setscrewModelPropsSchema.parse({ metricSize: "M3", length: minimum + 0.01 })
      .length,
  ).toBeCloseTo(minimum + 0.01)
})

test("setscrew ISO 4029 defaults to its value-free flag", () => {
  const omitted = mp.string(source).json()
  const explicit = mp.string(source + "_iso4029").json()
  if (omitted.fn !== "setscrew" || explicit.fn !== "setscrew")
    throw new Error("Wrong model")
  expect(explicit).toEqual(omitted)
  expect(
    mp.string("setscrew_ISO4029_m3_l6mm_hexsocket_cuppoint").json(),
  ).toEqual(omitted)
  expect(omitted).not.toHaveProperty("standard")
  expect(omitted).not.toHaveProperty("headStandard")
  expect(setscrewModelDefinitionSchema.parse(explicit)).toEqual(explicit)
  const { fn, ...props } = explicit
  expect(setscrewModelPropsSchema.parse(props)).toEqual(props)
})
