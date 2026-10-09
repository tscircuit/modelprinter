import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  hexNutModelPropsSchema,
  hexNutDinDimensions,
  hexNutImperialDimensions,
  getHexNutDimensions,
} from "../src"

test("DIN metric nuts cover small, fractional and larger M sizes", () => {
  expect(mp.string("hexnut_m3").json()).toMatchObject({
    metricSize: "M3",
    standard: "din934",
  })
  expect(mp.string("hexnut_m24").json()).toMatchObject({
    metricSize: "M24",
    standard: "din934",
  })
  for (const metricSize of Object.keys(
    hexNutDinDimensions,
  ) as (keyof typeof hexNutDinDimensions)[]) {
    const model = mp.string(`hexnut_standard(din934)_${metricSize}`).json()
    expect(model).toMatchObject({
      fn: "hexnut",
      standard: "din934",
      metricSize,
      threadClass: "6H",
      threadPitch: hexNutDinDimensions[metricSize].threadPitch,
    })
    expect(modelDefinitionSchema.parse(model)).toEqual(model)
    expect(
      getHexNutDimensions({ standard: "din934", metricSize }),
    ).toMatchObject(hexNutDinDimensions[metricSize])
  }
  expect(
    getHexNutDimensions({ standard: "din934", metricSize: "M3" }),
  ).toMatchObject({ diameter: 3, acrossFlats: 5.5, height: 2.4 })
  expect(
    getHexNutDimensions({ standard: "din934", metricSize: "M10" }).acrossFlats,
  ).toBe(17)
  expect(getHexNutDimensions({ metricSize: "M10" }).acrossFlats).toBe(16)
})

test("imperial UNC nuts normalize inch envelopes and pitches to millimeters", () => {
  for (const imperialSize of Object.keys(
    hexNutImperialDimensions,
  ) as (keyof typeof hexNutImperialDimensions)[]) {
    const dims = hexNutImperialDimensions[imperialSize]
    const model = mp
      .string(`hexnut_imperial(${imperialSize}-${dims.threadsPerInch})`)
      .json()
    expect(model).toMatchObject({
      fn: "hexnut",
      standard: "asmeb18.2.2",
      imperialSize,
      threadPitch: 25.4 / dims.threadsPerInch,
      threadClass: "2B",
    })
    expect(modelDefinitionSchema.parse(model)).toEqual(model)
    expect(hexNutModelPropsSchema.parse({ imperialSize })).toMatchObject({
      threadPitch: dims.threadPitch,
    })
    expect(getHexNutDimensions({ imperialSize })).toMatchObject(dims)
  }
  expect(
    mp.string("HEXNUT_UNC(1/4-20)_THREADCLASS(2b)_NOTHREADS").json(),
  ).toMatchObject({ imperialSize: "1/4", showThreads: false })
  expect(
    mp.string("hexnut_imperial(1/4)_threadpitch0.05in").json(),
  ).toMatchObject({ threadPitch: 1.27 })
  const quarter = getHexNutDimensions({ imperialSize: "1/4" })
  expect(quarter.diameter).toBeCloseTo(6.35, 8)
  expect(quarter.acrossFlats).toBeCloseTo(11.1125, 8)
  expect(quarter.height).toBeCloseTo(5.55625, 8)
})

test("nut size systems, standards, classes and coarse pitches cannot conflict", () => {
  for (const string of [
    "hexnut_standard(iso4032)_m3",
    "hexnut_standard(din934)_m9",
    "hexnut_m6_imperial(1/4)",
    "hexnut_standard(din934)_imperial(1/4)",
    "hexnut_standard(asmeb18.2.2)_m6",
    "hexnut_imperial(1/4-28)",
    "hexnut_imperial(#6-40)",
    "hexnut_imperial(1/4-0)",
    "hexnut_imperial(1/4-20-20)",
    "hexnut_imperial(1/4)_imperial(3/8)",
    "hexnut_imperial(1/4-20)_threadpitch1.27",
    "hexnut_threadpitch1.27_imperial(1/4-20)",
    "hexnut_imperial(1/4)_threadclass(6h)",
    "hexnut_standard(din934)_m3_threadclass(2b)",
    "hexnut_imperial(2)",
  ])
    expect(() => mp.string(string).json()).toThrow()
  expect(() =>
    hexNutModelPropsSchema.parse({ imperialSize: "1/4", metricSize: "M6" }),
  ).toThrow()
  expect(() => hexNutModelPropsSchema.parse({ standard: "din934" })).toThrow()
})
