import { expect } from "bun:test"
import {
  hexBoltDimensions,
  hexBoltModelPropsSchema,
  hexBoltModelDefinitionSchema,
  modelDefinitionSchema,
  mp,
  modelprinter,
} from "../../src"
import { parseHexBoltModelParams } from "../../src/models/hexbolt/parse-model-string"

export const assertHexBolt = () => {
  const builder = mp.string("hexbolt_m6_l25mm_thread(full)_drive(hex)")
  const model = builder.json()
  if (model.fn !== "hexbolt") throw new Error("Unexpected model family")
  expect(model).toMatchObject({
    diameter: 6,
    threadPitch: 1,
    headAcrossFlats: 10,
    headHeight: 4,
    underHeadRadius: 0.25,
  })
  expect(builder.params()).toMatchObject({ fn: "hexbolt", m: "6", l: "25mm" })
  expect(model).toEqual({
    fn: "hexbolt",
    iso4017: true,
    metricSize: "M6",
    length: 25,
    thread: "full",
    drive: "hex",
    threadHand: "right",
    threadClass: "6g",
    threadGender: "male",
    showThreads: true,

    ...hexBoltDimensions.M6,
  })
  expect(mp.string(builder.params().string + "_iso4017").json()).toEqual(model)
  expect(mp.string(builder.params().string + "_ISO4017").json()).toEqual(model)
  expect(model).not.toHaveProperty("standard")
  const { fn, ...props } = model
  expect(hexBoltModelPropsSchema.parse(props)).toEqual(props)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(hexBoltModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("hexbolt")
  expect(mp.string("HEXBOLT_M6_length2.5cm_DRIVE(HEX)").json()).toEqual(model)
  expect(
    mp
      .string(
        "hexbolt_metricsize(m6)_l25mm_threadpitch1mm_threadhand(left)_nothreads",
      )
      .json(),
  ).toMatchObject({ threadHand: "left", showThreads: false })

  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const parsed = hexBoltModelPropsSchema.parse({
      metricSize,
      length: "0.5in",
    })
    expect(parsed.length).toBeCloseTo(12.7)
    expect(parsed).toMatchObject(hexBoltDimensions[metricSize])
    expect(
      mp.string(`hexbolt_m${metricSize.slice(1)}_l0.5in`).json(),
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
      hexBoltModelPropsSchema.parse({ metricSize: "M6", length }),
    ).toThrow()
  }
  for (const invalid of [
    { mystery: true },
    { standard: "iso4017:2014" },
    { iso4017: false },
    { iso4017: "true" },
    { iso4029: true },
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
      hexBoltModelPropsSchema.parse({
        metricSize: "M6",
        length: 25,
        ...invalid,
      }),
    ).toThrow()
  }
  for (const tail of [
    "_m3",
    "_l12mm",
    "_length12mm",
    "_iso4017_iso4017",
    "_ISO4017_iso4017",
    "_iso4017(true)",
    "_iso4017(false)",
    "_iso40171",
    "_iso4017:2014",
    "_iso4029",
    "_standard(iso4017)",
    "_standard(iso4017:2014)",
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
    expect(() => mp.string(`hexbolt_m6_l25mm${tail}`).json()).toThrow()
  }
  for (const source of [
    "hexbolt",
    "hexbolt_m3",
    "hexbolt_l10mm",
    "hexbolt(3)_m3_l10mm",
    "hexbolt_m7_l10mm",
    "hexbolt_m3_l0mm",
    "hexbolt_m3_l",
    "hexbolt_m3_l10mm_",
  ]) {
    expect(() => mp.string(source).json()).toThrow()
  }
  expect(() =>
    parseHexBoltModelParams({ fn: "wrong", string: "wrong_m3_l10mm" }),
  ).toThrow()
  expect(
    hexBoltModelPropsSchema.parse({ metricSize: "M3", length: "1CM" }).length,
  ).toBe(10)
  for (const length of [0.3, 0.35]) {
    expect(() =>
      hexBoltModelPropsSchema.parse({ metricSize: "M3", length }),
    ).toThrow()
    expect(() => mp.string(`hexbolt_m3_l${length}mm`).json()).toThrow()
  }
  expect(
    hexBoltModelPropsSchema.parse({ metricSize: "M3", length: 0.36 }).length,
  ).toBe(0.36)
}
