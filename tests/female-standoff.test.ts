import { expect, test } from "bun:test"
import {
  femaleStandoffModelDefinitionSchema,
  femaleStandoffModelPropsSchema,
  getFemaleStandoffDimensions,
  modelDefinitionSchema,
  mp,
  parseModelString,
} from "../src"

const source = "femalestandoff_m3_af5.5mm_l10mm_hex_threadedthrough"
test("female standoff example, schemas and registry agree", () => {
  const expected = {
    fn: "femalestandoff",
    metricSize: "M3",
    acrossFlats: 5.5,
    length: 10,
    threadPitch: 0.5,
    hex: true,
    threadedThrough: true,
    leftHand: false,
    showThreads: true,
    endChamfer: 0.2,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(mp.string("femalestandoff").json()).toEqual(expected)
  expect(femaleStandoffModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(mp.getModelNames()).toContain("femalestandoff")
  const dimensions = getFemaleStandoffDimensions({})
  expect(dimensions).toMatchObject({
    diameter: 3,
    mouthDiameter: 3.24,
    acrossFlats: 5.5,
    endAcrossFlats: 5.1,
    length: 10,
    bearingZ: 0,
    topZ: 10,
    threadDepth: 10,
  })
  expect(dimensions.boreMinorDiameter).toBeCloseTo(
    3 - (5 * Math.sqrt(3) * 0.5) / 8,
  )
  expect(dimensions.boreChamferDepth).toBeCloseTo(
    (3.24 - dimensions.boreMinorDiameter) / 2,
  )
})
test("female standoff units, metric defaults and flag selectors", () => {
  expect(
    mp
      .string(
        "FEMALESTANDOFF_M4_AF0.7CM_LENGTH0.5IN_P0.05cm_LEFTHAND_NOTHREADS_ENDCHAMFER0",
      )
      .json(),
  ).toMatchObject({
    metricSize: "M4",
    acrossFlats: 7,
    length: 12.7,
    threadPitch: 0.5,
    leftHand: true,
    showThreads: false,
    endChamfer: 0,
  })
  expect(
    femaleStandoffModelPropsSchema.parse({ metricSize: "M6", length: "1in" }),
  ).toMatchObject({ acrossFlats: 10, length: 25.4, threadPitch: 1 })
  expect(femaleStandoffModelPropsSchema.parse({ length: 1 }).endChamfer).toBe(
    0.2,
  )
  expect(mp.string(`${source}_righthand_threads`).json()).toMatchObject({
    leftHand: false,
    showThreads: true,
  })
})
test("female standoff rejects unknown, duplicate and contradictory tokens", () => {
  for (const suffix of [
    "m3",
    "acrossflats5.5mm",
    "length10mm",
    "hex",
    "threadedthrough",
    "lefthand_righthand",
    "threads_nothreads",
    "hex(true)",
    "threadedthrough1",
    "p0.5mm_threadpitch0.5mm",
    "endchamfer0.2mm_endchamfer0.2mm",
    "round",
    "blind",
    "foo1",
    "",
    "af5mmjunk",
    "l1e2",
    "p(0.5mm)",
    "m3.0",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  for (const bad of [
    "femalestandoff3",
    "femalestandoff(3)",
    "femalestandoff_m7",
    "femalestandoff_m3_af3mm",
    "femalestandoff_m3_l0.1mm",
    "femalestandoff_m3_p2mm",
    "femalestandoff__m3",
  ])
    expect(() => mp.string(bad).json()).toThrow()
})
test("female standoff direct schemas preserve walls, chamfers and strict dimensions", () => {
  for (const props of [
    { acrossFlats: 3 },
    { acrossFlats: 0 },
    { length: 0 },
    { length: 0.1 },
    { length: Infinity },
    { length: NaN },
    { length: "1e2" },
    { length: "10mmjunk" },
    { threadPitch: 2 },
    { threadPitch: 0 },
    { endChamfer: -1 },
    { endChamfer: 5 },
    { acrossFlats: 4, endChamfer: 0.5 },
    { hex: false },
    { threadedThrough: false },
    { unexpected: true },
  ]) {
    expect(() => femaleStandoffModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      femaleStandoffModelDefinitionSchema.parse({
        fn: "femalestandoff",
        ...props,
      }),
    ).toThrow()
  }
})
