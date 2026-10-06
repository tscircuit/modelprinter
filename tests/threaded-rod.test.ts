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

test("threaded rod roadmap example and public model integration", () => {
  const source =
    "threadedrod_spec(custom)_m6_l100mm_thread(full)_ends(flat)_chamfer0.5mm"
  const builder = mp.string(source)
  expect(builder.params()).toMatchObject({
    m: "6",
    l: "100mm",
    spec: "(custom)",
  })
  const expected = {
    fn: "threadedrod",
    spec: "custom",
    metricSize: "M6",
    length: 100,
    thread: "full",
    ends: "flat",
    chamfer: 0.5,
    threadPitch: 1,
    threadHand: "right",
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

test("threaded rod coarse pitch defaults and explicit fine left-hand threads", () => {
  for (const [metricSize, threadPitch] of Object.entries(
    threadedRodCoarsePitches,
  )) {
    const props = threadedRodModelPropsSchema.parse({ metricSize, length: 100 })
    expect(props).toEqual({
      metricSize: props.metricSize,
      length: 100,
      spec: "custom",
      thread: "full",
      ends: "flat",
      chamfer: 0,
      threadPitch,
      threadHand: "right",
    })
  }
  expect(
    mp
      .string(
        "THREADEDROD_M2.5_length1CM_threadpitch0.025cm_threadhand(LEFT)_chamfer0.001IN",
      )
      .json(),
  ).toMatchObject({
    metricSize: "M2.5",
    length: 10,
    threadPitch: 0.25,
    threadHand: "left",
    chamfer: 0.0254,
  })
  expect(
    threadedRodModelPropsSchema.parse({
      metricSize: "M6",
      length: "1in",
      threadPitch: "0.5mm",
    }).length,
  ).toBeCloseTo(25.4)
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
    "threadhand(left)_threadhand(right)",
    "m7",
    "m6mm",
    "m6junk",
    "chamfer3mm",
    "chamfer-1mm",
    "spec(iso976)",
    "spec",
    "spec(custom)junk",
    "spec(custom)(custom)",
    "spec(custom)_spec(custom)",
    "thread(partial)",
    "thread(full)_thread(full)",
    "ends(round)",
    "threadhand(other)",
    "ends(flat)_ends(flat)",
    "chamfer0.5mm_chamfer0.5mm",
    "threadpitch1mmjunk",
    "l1e2",
    "l10mmjunk",
    "l(10mm)",
    "specCUSTOM",
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
    { spec: "standard" },
    { thread: "partial" },
    { ends: "round" },
    { threadHand: "both" },
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
