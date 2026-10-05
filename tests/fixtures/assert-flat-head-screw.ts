import { expect } from "bun:test"
import {
  flatHeadScrewDimensions,
  flatHeadScrewModelPropsSchema,
  flatHeadScrewModelDefinitionSchema,
  modelDefinitionSchema,
  mp,
  modelprinter,
} from "../../src"
import { parseFlatHeadScrewModelParams } from "../../src/models/flatheadscrew/parse-model-string"

export const assertFlatHeadScrew = () => {
  const builder = mp.string(
    "flatheadscrew_standard(iso10642)_m3_l10mm_drive(hexsocket)",
  )
  const model = builder.json()
  if (model.fn !== "flatheadscrew") throw new Error("Unexpected model family")
  expect(model).toMatchObject({
    diameter: 3,
    threadPitch: 0.5,
    headDiameter: 6.72,
    headHeight: 1.86,
    socketAcrossFlats: 2,
    socketDepth: 1.1,
  })
  expect(builder.params()).toMatchObject({
    fn: "flatheadscrew",
    m: "3",
    l: "10mm",
  })
  expect(model).toEqual({
    fn: "flatheadscrew",
    standard: "iso10642:2019",
    metricSize: "M3",
    length: 10,
    thread: "full",
    drive: "hexsocket",
    threadHand: "right",
    threadClass: "6g",
    threadGender: "male",
    showThreads: true,

    ...flatHeadScrewDimensions.M3,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(flatHeadScrewModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("flatheadscrew")
  expect(
    mp
      .string(
        "FLATHEADSCREW_M3_length1.0cm_STANDARD(ISO10642:2019)_DRIVE(HEXSOCKET)",
      )
      .json(),
  ).toEqual(model)
  expect(
    mp
      .string(
        "flatheadscrew_metricsize(m3)_l10mm_threadpitch0.5mm_threadhand(left)_nothreads",
      )
      .json(),
  ).toMatchObject({ threadHand: "left", showThreads: false })

  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const parsed = flatHeadScrewModelPropsSchema.parse({
      metricSize,
      length: "0.5in",
    })
    expect(parsed.length).toBeCloseTo(12.7)
    expect(parsed).toMatchObject(flatHeadScrewDimensions[metricSize])
    expect(
      mp.string(`flatheadscrew_m${metricSize.slice(1)}_l0.5in`).json(),
    ).toMatchObject(parsed)
  }
  for (const length of [
    NaN,
    Infinity,
    -1,
    0,
    "nonsense",
    "10mmjunk",
    "1e2",
    "1e2mm",
    "10mm garbage",
    " 10mm",
  ]) {
    expect(() =>
      flatHeadScrewModelPropsSchema.parse({ metricSize: "M3", length }),
    ).toThrow()
  }
  for (const invalid of [
    { mystery: true },
    { standard: "din7991" },
    { metricSize: "M7" },
    { drive: "torx" },
    { thread: "partial" },
    { threadPitch: "0.75mm" },
    { diameter: "12mm" },
    { headHeight: 999 },
    { threadGender: "female" },
    { threadClass: "6h" },
  ]) {
    expect(() =>
      flatHeadScrewModelPropsSchema.parse({
        metricSize: "M3",
        length: 10,
        ...invalid,
      }),
    ).toThrow()
  }
  for (const tail of [
    "_m3",
    "_l12mm",
    "_length12mm",
    "_standard(iso10642)_standard(iso10642)",
    "_drive(torx)",
    "_thread(partial)",
    "_threadhand(center)",
    "_threadclass(6h)",
    "_threadpitch0.75mm",
    "_unknown1mm",
    "_threads1",
    "_threads_nothreads",
    "_lengthjunk",
    "_length10mmjunk",
    "_length(10mm)",
    "_length-10mm",
    "_lengthInfinity",
    "_length1e2mm",
    "_length1.2.3mm",
  ]) {
    expect(() => mp.string(`flatheadscrew_m3_l10mm${tail}`).json()).toThrow()
  }
  for (const source of [
    "flatheadscrew",
    "flatheadscrew_m3",
    "flatheadscrew_l10mm",
    "flatheadscrew(3)_m3_l10mm",
    "flatheadscrew_m7_l10mm",
    "flatheadscrew_m3_l0mm",
    "flatheadscrew_m3_l",
    "flatheadscrew_m3_l10mm_",
  ]) {
    expect(() => mp.string(source).json()).toThrow()
  }
  expect(() => mp.string("flatheadscrew_m3_l1mm").json()).toThrow()
  expect(() => mp.string("flatheadscrew_m3_l30mm").json()).toThrow()
  expect(() =>
    parseFlatHeadScrewModelParams({ fn: "wrong", string: "wrong_m3_l10mm" }),
  ).toThrow()
  expect(
    flatHeadScrewModelPropsSchema.parse({ metricSize: "M3", length: "1CM" })
      .length,
  ).toBe(10)
  for (const length of [2.16, 2.21]) {
    expect(() =>
      flatHeadScrewModelPropsSchema.parse({ metricSize: "M3", length }),
    ).toThrow()
    expect(() => mp.string(`flatheadscrew_m3_l${length}mm`).json()).toThrow()
  }
  expect(
    flatHeadScrewModelPropsSchema.parse({ metricSize: "M3", length: 2.3 })
      .length,
  ).toBe(2.3)
}
