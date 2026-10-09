import { expect, test } from "bun:test"
import {
  getHexNutDimensions,
  hexNutDimensions,
  hexNutModelPropsSchema,
  hexNutModelDefinitionSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("hex nut example selects pinned ISO dimensions and through-thread defaults", () => {
  const builder = mp.string("hexnut_iso4032_m6")
  expect(builder.params()).toMatchObject({
    fn: "hexnut",
    iso: "4032",
    m: "6",
  })
  const model = builder.json()
  expect(model).toEqual({
    fn: "hexnut",
    iso4032: true,
    din934: false,
    asmeb1822: false,
    metricSize: "M6",
    threadPitch: 1,
    threadHand: "right",
    threadClass: "6H",
    showThreads: true,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("hexnut")
  const dimensions = getHexNutDimensions({ metricSize: "M6" })
  expect(dimensions).toMatchObject({
    diameter: 6,
    acrossFlats: 10,
    height: 5.2,
    mouthDiameter: 6.75,
    faceDiameter: 10,
    bearingZ: 0,
    topZ: 5.2,
    threadDepth: 5.2,
  })
  expect(dimensions.acrossCorners).toBeCloseTo(20 / Math.sqrt(3))
  expect(dimensions.boreMinorDiameter).toBeCloseTo(4.917468245)
  expect(dimensions.outerChamferDepth * 2).toBeLessThan(dimensions.height)
  expect(dimensions.boreChamferDepth * 2).toBeLessThan(dimensions.height)
})

test("hex nut supports each pinned size, equivalent units and visibility", () => {
  expect(
    mp
      .string("HEXNUT_ISO4032_M6_threadpitch0.1cm_threadclass(6h)_nothreads")
      .json(),
  ).toMatchObject({ threadPitch: 1, threadClass: "6H", showThreads: false })
  for (const metricSize of ["M5", "M6", "M8", "M10", "M12"] as const) {
    const model = hexNutModelPropsSchema.parse({ metricSize })
    expect(model.threadPitch).toBe(hexNutDimensions[metricSize].threadPitch)
    expect(mp.string(`hexnut_m${metricSize.slice(1)}`).json()).toMatchObject({
      metricSize,
      threadPitch: model.threadPitch,
    })
  }
  expect(hexNutDimensions.M10.acrossFlats).toBe(16)
  expect(hexNutDimensions.M12.acrossFlats).toBe(18)
})

test("hex nut rejects conflicting standards, dimensions and malformed inputs", () => {
  for (const source of [
    "hexnut",
    "hexnut_iso4032_m7",
    "hexnut_m6_m8",
    "hexnut_m6_threadpitch0",
    "hexnut_m6_threadpitch0.75mm",
    "hexnut_m6_threadpitch1mmjunk",
    "hexnut_m6_threadpitch1mm_threadpitch1mm",
    "hexnut_m6_standard(iso4032:2012)",
    "hexnut_m6_standard",
    "hexnut_m6_threadhand(left)",
    "hexnut_m6_threadclass(6g)",
    "hexnut_m6_af12mm",
    "hexnut_m6_washerface",
    "hexnut_m6_nothreads1",
    "hexnut_m6_threads_nothreads",
    "hexnut6_m6",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const threadPitch of [NaN, Infinity, 0, -1, true, "1mm junk"])
    expect(() =>
      hexNutModelPropsSchema.parse({ metricSize: "M6", threadPitch }),
    ).toThrow()
  expect(() =>
    hexNutModelPropsSchema.parse({ metricSize: "M6", acrossFlats: 10 }),
  ).toThrow()
  expect(() =>
    hexNutModelPropsSchema.parse({ metricSize: "M6", threadPitch: 0.75 }),
  ).toThrow()
})

test("hex nut ISO, DIN and ASME flags default by size and normalize to one family", () => {
  for (const [source, flag] of [
    ["hexnut_m6", "iso4032"],
    ["hexnut_m3", "din934"],
    ["hexnut_m24", "din934"],
    ["hexnut_imperial(1/4-20)", "asmeb18.2.2"],
    ["hexnut_imperial(#6-32)", "asmeb18.2.2"],
  ] as const) {
    const implicit = mp.string(source).json()
    if (implicit.fn !== "hexnut") throw new Error("Unexpected model")
    expect(mp.string(`${source}_${flag}`).json()).toEqual(implicit)
    expect(mp.string(`${source}_${flag.toUpperCase()}`).json()).toEqual(
      implicit,
    )
    expect(implicit).not.toHaveProperty("standard")
    expect(
      [implicit.iso4032, implicit.din934, implicit.asmeb1822].filter(Boolean),
    ).toHaveLength(1)
    const { fn, ...props } = implicit
    expect(hexNutModelPropsSchema.parse(props)).toEqual(props)
    expect(
      hexNutModelPropsSchema.parse({
        metricSize: props.metricSize,
        imperialSize: props.imperialSize,
      }),
    ).toEqual(props)
    expect(hexNutModelDefinitionSchema.parse(implicit)).toEqual(implicit)
  }
  expect(mp.string("hexnut_imperial(1/4)_asmeb1822").json()).toEqual(
    mp.string("hexnut_imperial(1/4)_asmeb18.2.2").json(),
  )
  expect(
    hexNutModelPropsSchema.parse({
      metricSize: "M6",
      din934: false,
      asmeb1822: false,
    }).iso4032,
  ).toBe(true)
  expect(
    hexNutModelPropsSchema.parse({
      metricSize: "M6",
      iso4032: false,
      din934: true,
    }).din934,
  ).toBe(true)
})

test("hex nut rejects duplicate, valued, legacy and contradictory family selectors", () => {
  for (const source of [
    "hexnut_m6_iso4032_iso4032",
    "hexnut_m6_iso4032_ISO4032",
    "hexnut_m6_iso4032_din934",
    "hexnut_m6_din934_iso4032",
    "hexnut_imperial(1/4)_asmeb18.2.2_asmeb1822",
    "hexnut_m6_iso4032(true)",
    "hexnut_m6_iso4032false",
    "hexnut_m6_din934(true)",
    "hexnut_imperial(1/4)_asmeb18.2.2(true)",
    "hexnut_m6_iso4032:2023",
    "hexnut_m6_iso4033",
    "hexnut_m6_standard(iso4032)",
    "hexnut_m6_standard(iso4032:2023)",
    "hexnut_m6_standard(din934)",
    "hexnut_imperial(1/4)_standard(asmeb18.2.2)",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const props of [
    { metricSize: "M6", iso4032: false },
    { metricSize: "M3", din934: false },
    { imperialSize: "1/4", asmeb1822: false },
    { metricSize: "M6", iso4032: true, din934: true },
    { metricSize: "M6", iso4032: true, asmeb1822: true },
    { imperialSize: "1/4", din934: true, asmeb1822: true },
    { metricSize: "M6", iso4032: false, din934: false, asmeb1822: false },
    { metricSize: "M6", iso4032: "true" },
    { metricSize: "M6", standard: "iso4032" },
    { metricSize: "M6", standard: "din934" },
    { imperialSize: "1/4", standard: "asmeb18.2.2" },
    { metricSize: "M3", iso4032: true },
    { metricSize: "M6", asmeb1822: true },
    { imperialSize: "1/4", iso4032: true },
    { imperialSize: "1/4", din934: true },
  ]) {
    expect(() => hexNutModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      hexNutModelDefinitionSchema.parse({ fn: "hexnut", ...props }),
    ).toThrow()
  }
})
