import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  modelprinter,
  heatSetInsertModelPropsSchema,
  heatSetInsertModelDefinitionSchema,
  heatSetInsertCoarsePitches,
} from "../src"
import { parseHeatSetInsertModelParams } from "../src/models/heatsetinsert/parse-model-string"
const source =
  "heatsetinsert_m3_od4.6mm_l5mm_knurldepth0.2mm_knurlp0.6mm_knurlteeth24_diamondknurl"
const input = {
  metricSize: "M3" as const,
  outerDiameter: 4.6,
  length: 5,
  knurlDepth: 0.2,
  knurlPitch: 0.6,
  knurlTeeth: 24,
}
test("heatsetinsert exact requested contract and public roundtrip", () => {
  const p = mp.string(source).json()
  if (p.fn !== "heatsetinsert") throw new Error("Wrong family")
  expect(p).toMatchObject({
    ...input,
    diameter: 3,
    threadPitch: 0.5,
    diamondKnurl: true,
    leftHand: false,
    showThreads: true,
  })
  expect(p.rootOuterDiameter).toBeCloseTo(4.2)
  expect(p.threadMinorDiameter).toBeCloseTo(2.4587341226)
  expect(heatSetInsertModelDefinitionSchema.parse(p)).toEqual(p)
  expect(modelDefinitionSchema.parse(p)).toEqual(p)
  const { fn, ...props } = p
  expect(heatSetInsertModelPropsSchema.parse(props)).toEqual(props)
  expect(mp.string(source.toUpperCase()).json()).toEqual(p)
  expect(modelprinter.getModelNames()).toContain("heatsetinsert")
})
test("heatsetinsert units, sizes and independent thread handedness", () => {
  const converted = mp
    .string(
      "heatsetinsert_metricsize(m3)_outerdiameter.46cm_length.5cm_knurldepth.02cm_knurlpitch.06cm_knurlteeth24",
    )
    .json()
  if (converted.fn !== "heatsetinsert") throw new Error("Wrong family")
  expect(converted.outerDiameter).toBeCloseTo(input.outerDiameter, 12)
  expect(converted.rootOuterDiameter).toBeCloseTo(4.2, 12)
  expect(converted).toMatchObject({
    metricSize: "M3",
    length: 5,
    knurlDepth: 0.2,
    knurlPitch: 0.6,
    knurlTeeth: 24,
  })
  expect(mp.string(source + "_lefthanded_nothreads").json()).toMatchObject({
    leftHand: true,
    showThreads: false,
  })
  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const p = heatSetInsertModelPropsSchema.parse({
      ...input,
      metricSize,
      outerDiameter: 10,
      length: "1in",
    })
    expect(p.length).toBeCloseTo(25.4)
    expect(p.threadPitch).toBe(heatSetInsertCoarsePitches[metricSize])
  }
})
test("heatsetinsert rejects duplicate flags, aliases and malformed strings", () => {
  for (const tail of [
    "_m3",
    "_outerdiameter4.6mm",
    "_length5mm",
    "_knurlpitch.6mm",
    "_knurlteeth24",
    "_diamondknurl",
    "_diamondknurl1",
    "_righthanded_lefthanded",
    "_threads_nothreads",
    "_threads_threads",
    "_unknown1mm",
    "_threadpitch.4mm",
    "_l1e2mm",
    "_l5mmjunk",
    "_l-5mm",
    "_knurlteeth24mm",
    "_knurlteeth2.5",
    "_knurlteethNaN",
    "_",
  ])
    expect(() => mp.string(source + tail).json()).toThrow()
  for (const source of [
    "heatsetinsert",
    "heatsetinsert(3)_m3_l5mm",
    "heatsetinsert_m7_od10mm_l5mm_knurldepth.2mm_knurlp.6mm_knurlteeth24",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    parseHeatSetInsertModelParams({ fn: "wrong", string: source }),
  ).toThrow()
})
test("heatsetinsert strict schema protects wall thickness and repeat limits", () => {
  for (const invalid of [
    { mystery: true },
    { metricSize: "M7" },
    { diamondKnurl: false },
    { outerDiameter: 3.4 },
    { knurlDepth: 0.8 },
    { diameter: 99 },
    { threadPitch: 0.4 },
    { threadMinorDiameter: 3 },
    { rootOuterDiameter: 99 },
    { knurlTeeth: 2 },
    { knurlTeeth: 97 },
    { knurlTeeth: 24.5 },
    { length: 601 },
    { knurlPitch: 0.0001 },
  ])
    expect(() =>
      heatSetInsertModelPropsSchema.parse({ ...input, ...invalid }),
    ).toThrow()
  for (const key of [
    "length",
    "outerDiameter",
    "knurlDepth",
    "knurlPitch",
  ] as const)
    for (const value of [
      0,
      -1,
      NaN,
      Infinity,
      "1e2mm",
      "10mmjunk",
      " 10mm",
      "10mm ",
    ])
      expect(() =>
        heatSetInsertModelPropsSchema.parse({ ...input, [key]: value }),
      ).toThrow()
  expect(
    heatSetInsertModelPropsSchema.parse({ ...input, length: 500 }).length,
  ).toBe(500)
})
