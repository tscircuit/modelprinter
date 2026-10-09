import { expect, test } from "bun:test"
import {
  flangeNutDimensions,
  flangeNutModelPropsSchema,
  getFlangeNutDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("flange nut defaults to ISO 4161:2012 and the plainface contract", () => {
  const model = mp.string("flangenut_m6_plainface").json()
  expect(model).toEqual({
    fn: "flangenut",
    iso4161: true,
    metricSize: "M6",
    plainFace: true,
    threadPitch: 1,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(mp.string("flangenut_iso4161_m6_plainface").json()).toEqual(model)
  expect(mp.string("FLANGENUT_M6_ISO4161_PLAINFACE").json()).toEqual(model)
  expect(flangeNutModelPropsSchema.parse({ metricSize: "M6" })).toEqual(
    flangeNutModelPropsSchema.parse({ metricSize: "M6", iso4161: true }),
  )
  expect(modelprinter.getModelNames()).toContain("flangenut")
  expect(getFlangeNutDimensions({ metricSize: "M6" })).toMatchObject({
    diameter: 6,
    height: 6,
    acrossFlats: 10,
    flangeDiameter: 14.2,
    mouthDiameter: 6.75,
    flangeRimHeight: 1.1,
    minimumBearingDiameter: 12.2,
    minimumWrenchingHeight: 3.1,
    bearingZ: 0,
    topZ: 6,
    threadDepth: 6,
    transitionRadius: 0,
  })
  expect(flangeNutDimensions.M10.acrossFlats).toBe(15)
})

test("flange nut supports every pinned size, complete units and schema roundtrips", () => {
  for (const metricSize of Object.keys(
    flangeNutDimensions,
  ) as (keyof typeof flangeNutDimensions)[]) {
    const model = flangeNutModelPropsSchema.parse({ metricSize })
    expect(model.threadPitch).toBe(flangeNutDimensions[metricSize].threadPitch)
    expect(flangeNutModelPropsSchema.parse(model)).toEqual(model)
    expect(mp.string(`flangenut_m${metricSize.slice(1)}`).json()).toEqual({
      fn: "flangenut",
      ...model,
    })
    const d = getFlangeNutDimensions(model)
    expect(
      d.flangeTopAtFlatZ + d.topChamferDepth + d.minimumWrenchingHeight,
    ).toBeLessThan(d.height)
    expect(d.boreChamferDepth * 2).toBeLessThan(d.height)
    expect(d.flangeDiameter).toBeGreaterThan(d.acrossCorners)
  }
  for (const threadPitch of [
    1,
    "1MM",
    "0.1cm",
    "0.001m",
    "0.03937007874015748in",
    "39.37007874015748mil",
  ])
    expect(
      flangeNutModelPropsSchema.parse({ metricSize: "M6", threadPitch })
        .threadPitch,
    ).toBe(1)
  expect(
    mp
      .string(
        "FLANGENUT_ISO4161_M6_THREADPITCH0.1CM_RIGHTHANDED_PLAINFACE_NOTHREADS",
      )
      .json(),
  ).toMatchObject({ threadPitch: 1, showThreads: false, plainFace: true })
})

test("flange nut rejects contradictory, duplicate and malformed tokens", () => {
  for (const source of [
    "flangenut",
    "flangenut6_m6",
    "flangenut(6)_m6",
    "flangenut_m4",
    "flangenut_m6mm",
    "flangenut_m6_m8",
    "flangenut_m6_m6",
    "flangenut_m6_iso4161_iso4161",
    "flangenut_m6_iso4161_ISO4161",
    "flangenut_m6_iso4161(true)",
    "flangenut_m6_iso4161(false)",
    "flangenut_m6_iso4161= true",
    "flangenut_m6_iso4161:2012",
    "flangenut_m6_iso41611",
    "flangenut_m6_iso4029",
    "flangenut_m6_standard(iso4161)",
    "flangenut_m6_standard(iso4161)_standard(iso4161:2012)",
    "flangenut_m6_standard(iso4161:1999)",
    "flangenut_m6_standard",
    "flangenut_m6_plainface_plainface",
    "flangenut_m6_plainface(true)",
    "flangenut_m6_plainface1",
    "flangenut_m6_righthanded_righthanded",
    "flangenut_m6_lefthanded",
    "flangenut_m6_serrated",
    "flangenut_m6_face(plain)",
    "flangenut_m6_threadhand(right)",
    "flangenut_m6_threads_nothreads",
    "flangenut_m6_threads_threads",
    "flangenut_m6_nothreads(false)",
    "flangenut_m6_threadpitch0.75mm",
    "flangenut_m6_threadpitch1mmjunk",
    "flangenut_m6_threadpitch1e0mm",
    "flangenut_m6_threadpitch1mm_threadpitch0.1cm",
    "flangenut_m6_af10mm",
    "flangenut_m6_l6mm",
    "flangenut_m6_flangeod14.2mm",
  ])
    expect(() => mp.string(source).json(), source).toThrow()
  for (const props of [
    { metricSize: "M6", iso4161: false },
    { metricSize: "M6", iso4161: "true" },
    { metricSize: "M6", iso4029: true },
    { metricSize: "M6", standard: "iso4161" },
    { metricSize: "M6", standard: "iso4161:2012" },
    { metricSize: "M6", plainFace: false },
    { metricSize: "M6", rightHanded: false },
    { metricSize: "M6", rightHanded: "right" },
    { metricSize: "M6", threadHand: "right" },
    { metricSize: "M6", threadClass: "6G" },
    { metricSize: "M6", acrossFlats: 10 },
    { metricSize: "M6", height: 6 },
    { metricSize: "M7" },
  ])
    expect(() => flangeNutModelPropsSchema.parse(props)).toThrow()
  for (const threadPitch of [
    NaN,
    Infinity,
    0,
    -1,
    true,
    "",
    "1mm junk",
    "1e0mm",
    "1 mm",
    "1mm\n",
    "0.75mm",
  ])
    expect(() =>
      flangeNutModelPropsSchema.parse({ metricSize: "M6", threadPitch }),
    ).toThrow()
})
