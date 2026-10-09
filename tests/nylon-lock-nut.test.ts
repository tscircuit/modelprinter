import { expect, test } from "bun:test"
import {
  getNylonLockNutDimensions,
  modelDefinitionSchema,
  mp,
  nylonLockNutDimensions,
  nylonLockNutModelPropsSchema,
  modelprinter,
} from "../src"

test("nylonlocknut example selects pinned ISO envelope and locking feature", () => {
  const model = mp.string("nylonlocknut_standard(iso7040)_m6").json()
  expect(model).toEqual({
    fn: "nylonlocknut",
    standard: "iso7040:2012",
    metricSize: "M6",
    threadPitch: 1,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("nylonlocknut")
  expect(getNylonLockNutDimensions({ metricSize: "M6" })).toMatchObject({
    height: 8,
    bodyHeight: 4.9,
    acrossFlats: 10,
    pocketDiameter: 8,
    insertBoreDiameter: 5.75,
    insertBottomZ: 4.9,
    insertTopZ: 7.75,
    bearingZ: 0,
    topZ: 8,
  })
})

test("nylonlocknut supports five table sizes and complete pitch units", () => {
  for (const metricSize of ["M5", "M6", "M8", "M10", "M12"] as const) {
    const expected = nylonLockNutDimensions[metricSize]
    const props = nylonLockNutModelPropsSchema.parse({ metricSize })
    expect(props.threadPitch).toBe(expected.threadPitch)
    expect(
      mp.string(`nylonlocknut_m${metricSize.slice(1)}`).json(),
    ).toMatchObject(props)
    const dimensions = getNylonLockNutDimensions(props)
    expect(dimensions.pocketDiameter).toBeGreaterThan(dimensions.diameter)
    expect(dimensions.insertTopZ).toBeGreaterThan(dimensions.insertBottomZ)
    expect(dimensions.boreMinorDiameter).toBeLessThan(
      dimensions.insertBoreDiameter,
    )
  }
  for (const pitch of [
    1,
    "1mm",
    "0.1cm",
    "0.001m",
    "0.03937007874015748in",
    "39.37007874015748mil",
  ])
    expect(
      nylonLockNutModelPropsSchema.parse({
        metricSize: "M6",
        threadPitch: pitch,
      }).threadPitch,
    ).toBe(1)
  expect(
    mp
      .string(
        "NYLONLOCKNUT_STANDARD(ISO7040:2012)_M6_THREADPITCH0.1CM_THREADCLASS(6h)_RIGHTHANDED_NOTHREADS",
      )
      .json(),
  ).toMatchObject({ showThreads: false, rightHanded: true, threadClass: "6H" })
})

test("nylonlocknut rejects malformed, duplicate, unknown and conflicting inputs", () => {
  for (const source of [
    "nylonlocknut",
    "nylonlocknut(6)_m6",
    "nylonlocknut_m3",
    "nylonlocknut_m6_m8",
    "nylonlocknut_m6_m6",
    "nylonlocknut_m6_standard(iso7040:2025)",
    "nylonlocknut_m6_standard(iso7040)_standard(iso7040)",
    "nylonlocknut_m6_threadpitch0.75mm",
    "nylonlocknut_m6_threadpitch1mmjunk",
    "nylonlocknut_m6_threadpitch1mm_threadpitch1mm",
    "nylonlocknut_m6_af10mm",
    "nylonlocknut_m6_h8mm",
    "nylonlocknut_m6_lefthanded",
    "nylonlocknut_m6_righthanded_righthanded",
    "nylonlocknut_m6_threads_nothreads",
    "nylonlocknut_m6_nothreads1",
    "nylonlocknut_m6_threadclass(6G)",
    "nylonlocknut_m6_threadclass(6H)_threadclass(6H)",
    "nylonlocknut_m6_standard",
    "nylonlocknut_m6_washerface",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const threadPitch of [NaN, Infinity, -1, 0, true, "1mm junk"])
    expect(() =>
      nylonLockNutModelPropsSchema.parse({ metricSize: "M6", threadPitch }),
    ).toThrow()
  for (const extra of [
    { height: 8 },
    { acrossFlats: 10 },
    { pocketDiameter: 8 },
    { rightHanded: false },
    { showThreads: "false" },
    { threadClass: "6G" },
  ])
    expect(() =>
      nylonLockNutModelPropsSchema.parse({ metricSize: "M6", ...extra }),
    ).toThrow()
})
