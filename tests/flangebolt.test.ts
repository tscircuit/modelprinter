import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  modelprinter,
  flangeboltDimensions,
  flangeboltModelPropsSchema,
  flangeboltModelDefinitionSchema,
} from "../src"
import { parseFlangeBoltModelParams } from "../src/models/flangebolt/parse-model-string"
const source = "flangebolt_m6_l25mm_fullthread_plainface"
test("flangebolt requested contract and public schema roundtrip", () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "flangebolt") throw new Error("Wrong model")
  expect(definition).toMatchObject({
    metricSize: "M6",
    length: 25,
    iso4162: true,
    leftHand: false,
    showThreads: true,
    ...flangeboltDimensions.M6,
  })
  expect(flangeboltModelDefinitionSchema.parse(definition)).toEqual(definition)
  expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  const { fn, ...props } = definition
  expect(flangeboltModelPropsSchema.parse(props)).toEqual(props)
  expect(modelprinter.getModelNames()).toContain("flangebolt")
  expect(mp.string(source.toUpperCase()).json()).toEqual(definition)
  expect(mp.string(source + "_iso4162").json()).toEqual(definition)
  expect(mp.string((source + "_iso4162").toUpperCase()).json()).toEqual(
    definition,
  )
  expect(definition).not.toHaveProperty("standard")
  expect(definition).not.toHaveProperty("headStandard")
})
test("flangebolt supported sizes, units and fixed dimensions", () => {
  for (const metricSize of ["M5", "M6", "M8", "M10"] as const) {
    const props = flangeboltModelPropsSchema.parse({
      metricSize,
      length: "1in",
    })
    expect(props.length).toBeCloseTo(25.4)
    expect(props).toMatchObject(flangeboltDimensions[metricSize])
    expect(
      mp
        .string(
          `flangebolt_metricsize(${metricSize.toLowerCase()})_length2.54cm`,
        )
        .json(),
    ).toMatchObject(props)
    expect(
      mp
        .string(
          `flangebolt_m${metricSize.slice(1)}_l25.4mm_threadpitch${props.threadPitch}mm`,
        )
        .json(),
    ).toMatchObject(props)
  }
  expect(mp.string(source + "_lefthanded_nothreads").json()).toMatchObject({
    leftHand: true,
    showThreads: false,
  })
})
test("flangebolt rejects conflicting, duplicate and malformed tokens", () => {
  for (const tail of [
    "_m3",
    "_length10mm",
    "_iso4162_iso4162",
    "_iso4162(true)",
    "_iso4162false",
    "_iso4162:2012",
    "_iso4029",
    "_standard(iso4162)",
    "_headstandard(iso4162)",
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
  for (const flag of ["fullthread", "plainface"])
    expect(() => mp.string(source + `_${flag}`).json()).toThrow()
  for (const source of [
    "flangebolt",
    "flangebolt_m1_l10mm",
    "flangebolt_m6_l0mm",
    "flangebolt(3)_m6_l10mm",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    parseFlangeBoltModelParams({ fn: "wrong", string: source }),
  ).toThrow()
})
test("flangebolt strict public schema and length guards", () => {
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
      flangeboltModelPropsSchema.parse({ metricSize: "M6", length }),
    ).toThrow()
  for (const invalid of [
    { mystery: true },
    { metricSize: "M7" },
    { standard: "iso4162" },
    { headStandard: "iso4162:2012" },
    { iso4162: false },
    { iso4162: "true" },
    { iso4029: true },
    { diameter: 99 },
    { threadPitch: 0.01 },
    { fullThread: false },
    { plainFace: false },
  ])
    expect(() =>
      flangeboltModelPropsSchema.parse({
        metricSize: "M6",
        length: 25,
        ...invalid,
      }),
    ).toThrow()
  const dimensions = flangeboltDimensions.M6
  const minimum = dimensions.underHeadRadius + dimensions.tipChamfer
  expect(() =>
    flangeboltModelPropsSchema.parse({ metricSize: "M6", length: minimum }),
  ).toThrow()
  expect(
    flangeboltModelPropsSchema.parse({
      metricSize: "M6",
      length: minimum + 0.01,
    }).length,
  ).toBeCloseTo(minimum + 0.01)
})

test("ISO small-series wrench dimensions match the primary standard table", () => {
  expect([
    flangeboltDimensions.M5.headAcrossFlats,
    flangeboltDimensions.M6.headAcrossFlats,
    flangeboltDimensions.M8.headAcrossFlats,
    flangeboltDimensions.M10.headAcrossFlats,
  ]).toEqual([7, 8, 10, 13])
})

test("flangebolt angles require unitless numeric degrees", () => {
  for (const key of ["headChamferAngle", "flangeSlopeAngle"] as const)
    expect(() =>
      flangeboltModelPropsSchema.parse({
        metricSize: "M6",
        length: 25,
        [key]: "30mm",
      }),
    ).toThrow()
  expect(() =>
    mp.string("flangebolt_m6_l25mm_headchamferangle30mm").json(),
  ).toThrow()
})
