import { expect, test } from "bun:test"
import {
  getHexNutDimensions,
  hexNutDimensions,
  hexNutModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("hex nut example selects pinned ISO dimensions and through-thread defaults", () => {
  const builder = mp.string("hexnut_standard(iso4032)_m6")
  expect(builder.params()).toMatchObject({
    fn: "hexnut",
    standard: "(iso4032)",
    m: "6",
  })
  const model = builder.json()
  expect(model).toEqual({
    fn: "hexnut",
    standard: "iso4032:2023",
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
      .string(
        "HEXNUT_STANDARD(ISO4032:2023)_M6_threadpitch0.1cm_threadclass(6h)_nothreads",
      )
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
    "hexnut_m3",
    "hexnut_m7",
    "hexnut_m6_m8",
    "hexnut_m6_threadpitch0",
    "hexnut_m6_threadpitch0.75mm",
    "hexnut_m6_threadpitch1mmjunk",
    "hexnut_m6_threadpitch1mm_threadpitch1mm",
    "hexnut_m6_standard(din934)",
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
