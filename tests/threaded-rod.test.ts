import { expect, test } from "bun:test"
import {
  getThreadedRodDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  threadedRodCoarsePitches,
  threadedRodModelDefinitionSchema,
  threadedRodModelPropsSchema,
} from "../src"

test("threaded rod concise string and public model integration", () => {
  const source = "threadedrod_m6_l100mm_chamfer0.5mm"
  const builder = mp.string(source)
  expect(builder.params()).toMatchObject({
    m: "6",
    l: "100mm",
    string: source,
  })
  const expected = {
    fn: "threadedrod",
    metricSize: "M6",
    length: 100,
    chamfer: 0.5,
    threadPitch: 1,
    leftHand: false,
  } as const
  expect(builder.json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(threadedRodModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("threadedrod")
  expect(
    getThreadedRodDimensions({ metricSize: "M6", length: 100, chamfer: 0.5 }),
  ).toEqual({
    diameter: 6,
    length: 100,
    threadPitch: 1,
    pitchDiameter: 5.350481,
    minorDiameter: 4.773131,
    endDiameter: 5,
  })
})

test("threaded rod bare names support renderer dispatch without a complete model", () => {
  for (const source of ["threadedrod", "THREADEDROD"]) {
    const builder = mp.string(source)
    expect(builder.params()).toMatchObject({
      fn: "threadedrod",
      string: "threadedrod",
    })
    expect(() => builder.json()).toThrow()
  }
})

test("threaded rod coarse pitch defaults and explicit fine left-hand threads", () => {
  for (const [metricSize, threadPitch] of Object.entries(
    threadedRodCoarsePitches,
  )) {
    const props = threadedRodModelPropsSchema.parse({ metricSize, length: 100 })
    expect(props).toEqual({
      metricSize: props.metricSize,
      length: 100,
      chamfer: 0,
      threadPitch,
      leftHand: false,
    })
  }
  expect(
    mp
      .string(
        "THREADEDROD_M2.5_length1CM_threadpitch0.025cm_LEFTHANDED_chamfer0.001IN",
      )
      .json(),
  ).toMatchObject({
    metricSize: "M2.5",
    length: 10,
    threadPitch: 0.25,
    leftHand: true,
    chamfer: 0.0254,
  })
  expect(
    threadedRodModelPropsSchema.parse({
      metricSize: "M6",
      length: "1in",
      threadPitch: "0.5mm",
    }).length,
  ).toBeCloseTo(25.4)
  for (const leftHand of [true, false]) {
    const props = threadedRodModelPropsSchema.parse({
      metricSize: "M6",
      length: 100,
      leftHand,
    })
    expect(props.leftHand).toBe(leftHand)
    expect(threadedRodModelPropsSchema.parse(props)).toEqual(props)
  }
})

test("threaded rod handedness flags normalize idempotently to boolean JSON", () => {
  const cases = [
    [
      "threadedrod_m6_l100mm_threadpitch0.5mm_lefthanded",
      "threadedrod_m6_l100mm_threadpitch0.5mm_lefthanded",
      true,
    ],
    ["threadedrod_m6_l100mm_righthanded", "threadedrod_m6_l100mm", false],
    [
      "THREADEDROD_M6_length1CM_LEFTHANDED",
      "threadedrod_M6_length1CM_lefthanded",
      true,
    ],
  ] as const
  for (const [source, canonical, leftHand] of cases) {
    const builder = mp.string(source)
    const expected = mp.string(canonical).json()
    expect(expected).toMatchObject({ leftHand })
    expect(builder.json()).toEqual(expected)
    expect(parseModelString(source)).toEqual(expected)
    expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
    expect(builder.params().string).toBe(canonical)
    expect(mp.string(builder.params().string).params()).toEqual(
      builder.params(),
    )
    expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
    for (const property of ["spec", "thread", "ends", "threadhand"])
      expect(builder.params()).not.toHaveProperty(property)
    for (const property of ["spec", "thread", "ends", "threadHand"])
      expect(expected).not.toHaveProperty(property)
  }
})

test("threaded rod rejects enum selectors and fixed construction flags", () => {
  for (const token of [
    "spec(custom)",
    "thread(full)",
    "ends(flat)",
    "threadhand(left)",
    "threadhand(right)",
    "custom",
    "fullthread",
    "flatends",
  ])
    for (const spelling of [token, token.toUpperCase()])
      expect(() =>
        mp.string(`threadedrod_m6_l100mm_${spelling}`).json(),
      ).toThrow()
})

test("threaded rod rejects duplicate aliases, malformed tokens and unsupported contracts", () => {
  for (const suffix of [
    "m6",
    "l0",
    "l-1mm",
    "l",
    "length20mm",
    "l10mm",
    "threadpitch0",
    "threadpitch5mm",
    "threadpitch1mm_threadpitch0.5mm",
    "lefthanded_lefthanded",
    "righthanded_righthanded",
    "lefthanded_righthanded",
    "righthanded_lefthanded",
    "lefthanded(true)",
    "righthanded1",
    "m7",
    "m6mm",
    "m6junk",
    "chamfer3mm",
    "chamfer-1mm",
    "chamfer0.5mm_chamfer0.5mm",
    "threadpitch1mmjunk",
    "l1e2",
    "l10mmjunk",
    "l(10mm)",
    "constructor1",
    "unknown1",
    "",
  ]) {
    expect(() => mp.string(`threadedrod_m6_l100mm_${suffix}`).json()).toThrow()
  }
  for (const source of [
    "threadedrod",
    "threadedrod_m6",
    "threadedrod_l10mm",
    "threadedrod(6)_m6_l10mm",
    "threadedrod6_m6_l10mm",
    "threadedrod_m6_l1mm_chamfer0.5mm",
    "threadedrod_m6_l10mm_thread(full",
    "threadedrod_m6_l10mm__ends(flat)",
  ]) {
    expect(() => mp.string(source).json()).toThrow()
  }
})

test("threaded rod direct schemas enforce finite complete lengths and compatible dimensions", () => {
  for (const length of [
    NaN,
    Infinity,
    0,
    -1,
    "10mmjunk",
    "nonsense",
    "1e2",
    " 10mm",
    true,
  ]) {
    expect(() =>
      threadedRodModelPropsSchema.parse({ metricSize: "M6", length }),
    ).toThrow()
  }
  for (const extra of [
    { unknown: true },
    { threadPitch: 0 },
    { threadPitch: Infinity },
    { threadPitch: 5 },
    { chamfer: 3 },
    { chamfer: -1 },
    { spec: "custom" },
    { spec: "standard" },
    { thread: "partial" },
    { thread: "full" },
    { ends: "round" },
    { ends: "flat" },
    { threadHand: "right" },
    { threadHand: "left" },
    { threadHand: "both" },
    { leftHand: "left" },
    { leftHand: 1 },
    { rightHand: true },
  ]) {
    const props = { metricSize: "M6", length: 100, ...extra }
    expect(() => threadedRodModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      threadedRodModelDefinitionSchema.parse({ fn: "threadedrod", ...props }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "threadedrod", ...props }),
    ).toThrow()
  }
  expect(() =>
    getThreadedRodDimensions({ metricSize: "M6", length: 1, chamfer: 0.5 }),
  ).toThrow()
})
