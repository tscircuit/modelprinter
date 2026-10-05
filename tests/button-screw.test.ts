import { expect, test } from "bun:test"
import {
  buttonScrewDimensions,
  buttonScrewModelPropsSchema,
  getButtonScrewDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("button screw example selects pinned dimensions, defaults and public registry", () => {
  const builder = mp.string(
    "buttonscrew_standard(iso7380-1)_m3_l10mm_drive(hexsocket)",
  )
  expect(builder.params()).toMatchObject({
    m: "3",
    standard: "(iso7380-1)",
    l: "10mm",
  })
  const model = builder.json()
  expect(model).toEqual({
    fn: "buttonscrew",
    standard: "iso7380-1:2022",
    metricSize: "M3",
    length: 10,
    drive: "hexsocket",
    thread: "full",
    threadPitch: 0.5,
    threadHand: "right",
    threadClass: "6g",
    showThreads: true,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("buttonscrew")
  const dimensions = getButtonScrewDimensions({ metricSize: "M3", length: 10 })
  expect(dimensions).toMatchObject({
    headDiameter: 5.7,
    headHeight: 1.65,
    socketWidth: 2,
    socketDepth: 1.04,
    overallLength: 11.65,
    bearingZ: 0,
    tipZ: -10,
    topZ: 1.65,
  })
  for (const point of [
    [dimensions.headDiameter / 2, 0],
    [dimensions.crownFlatDiameter / 2, dimensions.headHeight],
  ])
    expect(
      Math.hypot(
        point[0]! - dimensions.crownArcCenterR,
        point[1]! - dimensions.crownArcCenterZ,
      ),
    ).toBeCloseTo(dimensions.crownRadius)
})

test("button screw unit normalization, each table size and thread visibility", () => {
  expect(
    mp.string("BUTTONSCREW_M6_length1cm_threadpitch0.1cm_nothreads").json(),
  ).toMatchObject({ length: 10, threadPitch: 1, showThreads: false })
  expect(
    buttonScrewModelPropsSchema.parse({ metricSize: "M3", length: "0.25in" })
      .length,
  ).toBeCloseTo(6.35)
  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    expect(
      buttonScrewModelPropsSchema.parse({ metricSize, length: 10 }).threadPitch,
    ).toBe(buttonScrewDimensions[metricSize].threadPitch)
    expect(
      mp
        .string(
          `buttonscrew_m${metricSize.slice(1)}_l${buttonScrewDimensions[metricSize].referenceThreadLength}mm`,
        )
        .json(),
    ).toMatchObject({ metricSize })
  }
})

test("button screw rejects contradictory standards, tokens, pitches and lengths", () => {
  for (const source of [
    "buttonscrew",
    "buttonscrew_m3",
    "buttonscrew_m2_l10mm",
    "buttonscrew_m3_l0",
    "buttonscrew_m3_l0.9mm",
    "buttonscrew_m3_l19mm",
    "buttonscrew_m3_l10mmfoo",
    "buttonscrew_m3_l10mm_l12mm",
    "buttonscrew_m3_l10mm_length12mm",
    "buttonscrew_m3_m4_l10mm",
    "buttonscrew_m3_l10mm_standard(iso7380-2)",
    "buttonscrew_m3_l10mm_standard(iso7380-1:2011)",
    "buttonscrew_m3_l10mm_standard",
    "buttonscrew_m3_l10mm_drive(torx)",
    "buttonscrew_m3_l10mm_thread(partial)",
    "buttonscrew_m3_l10mm_threadpitch0.35mm",
    "buttonscrew_m3_l10mm_threadhand(left)",
    "buttonscrew_m3_l10mm_threadclass(4g)",
    "buttonscrew_m3_l10mm_threads_nothreads",
    "buttonscrew_m3_l10mm_threads1",
    "buttonscrew_m3_l10mm_unknown",
    "buttonscrew3_m3_l10mm",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const length of [NaN, Infinity, 0, -1, "10mm junk"])
    expect(() =>
      buttonScrewModelPropsSchema.parse({ metricSize: "M3", length }),
    ).toThrow()
  expect(() =>
    buttonScrewModelPropsSchema.parse({
      metricSize: "M3",
      length: 10,
      headDiameter: 9,
    }),
  ).toThrow()
  expect(() =>
    buttonScrewModelPropsSchema.parse({
      metricSize: "M3",
      length: 10,
      threadPitch: 0.35,
    }),
  ).toThrow()
})
