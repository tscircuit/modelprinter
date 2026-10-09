import { expect } from "bun:test"
import {
  panScrewDimensions,
  panScrewModelPropsSchema,
  panScrewModelDefinitionSchema,
  modelDefinitionSchema,
  mp,
  modelprinter,
} from "../../src"
import { parsePanScrewModelParams } from "../../src/models/panscrew/parse-model-string"

export const assertPanScrew = () => {
  const builder = mp.string("panscrew_m3_l10mm_drive(phillips)")
  const model = builder.json()
  if (model.fn !== "panscrew") throw new Error("Unexpected model family")
  expect(model).toMatchObject({
    diameter: 3,
    threadPitch: 0.5,
    headDiameter: 5.6,
    headHeight: 2.4,
    crownRadius: 5,
    recessNumber: 1,
    recessReferenceDiameter: 3,
    recessPenetration: 1.4,
  })
  expect(builder.params()).toMatchObject({ fn: "panscrew", m: "3", l: "10mm" })
  expect(model).toEqual({
    fn: "panscrew",
    iso7045: true,
    metricSize: "M3",
    length: 10,
    thread: "full",
    drive: "phillips",
    threadHand: "right",
    threadClass: "6g",
    threadGender: "male",
    showThreads: true,
    iso4757: true,
    recessType: "H",
    ...panScrewDimensions.M3,
  })
  expect(mp.string(builder.params().string + "_iso7045").json()).toEqual(model)
  expect(mp.string(builder.params().string + "_ISO7045").json()).toEqual(model)
  expect(mp.string(builder.params().string + "_iso4757").json()).toEqual(model)
  expect(
    mp.string(builder.params().string + "_ISO4757_iso7045").json(),
  ).toEqual(model)
  expect(model).not.toHaveProperty("recessStandard")
  expect(model).not.toHaveProperty("standard")
  const { fn, ...props } = model
  expect(panScrewModelPropsSchema.parse(props)).toEqual(props)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(panScrewModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("panscrew")
  expect(mp.string("PANSCREW_M3_length1.0cm_DRIVE(PHILLIPS)").json()).toEqual(
    model,
  )
  expect(
    mp
      .string(
        "panscrew_metricsize(m3)_l10mm_threadpitch0.5mm_threadhand(left)_nothreads",
      )
      .json(),
  ).toMatchObject({ threadHand: "left", showThreads: false })

  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const parsed = panScrewModelPropsSchema.parse({
      metricSize,
      length: "0.5in",
    })
    expect(parsed.length).toBeCloseTo(12.7)
    expect(parsed).toMatchObject(panScrewDimensions[metricSize])
    expect(
      mp.string(`panscrew_m${metricSize.slice(1)}_l0.5in`).json(),
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
      panScrewModelPropsSchema.parse({ metricSize: "M3", length }),
    ).toThrow()
  }
  for (const invalid of [
    { mystery: true },
    { standard: "iso7045:2011" },
    { iso7045: false },
    { iso4757: false },
    { iso4757: "true" },
    { recessStandard: "iso4757:1983" },
    { iso7045: "true" },
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
      panScrewModelPropsSchema.parse({
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
    "_iso7045_iso7045",
    "_iso4757_iso4757",
    "_ISO4757_iso4757",
    "_iso4757(true)",
    "_iso4757false",
    "_iso4757:1983",
    "_recessstandard(iso4757:1983)",
    "_ISO7045_iso7045",
    "_iso7045(true)",
    "_iso7045(false)",
    "_iso70451",
    "_iso7045:2011",
    "_iso4029",
    "_standard(iso7045)",
    "_standard(iso7045:2011)",
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
    expect(() => mp.string(`panscrew_m3_l10mm${tail}`).json()).toThrow()
  }
  for (const source of [
    "panscrew",
    "panscrew_m3",
    "panscrew_l10mm",
    "panscrew(3)_m3_l10mm",
    "panscrew_m7_l10mm",
    "panscrew_m3_l0mm",
    "panscrew_m3_l",
    "panscrew_m3_l10mm_",
  ]) {
    expect(() => mp.string(source).json()).toThrow()
  }
  expect(() => mp.string("panscrew_m3_l30mm").json()).toThrow()
  expect(() =>
    parsePanScrewModelParams({ fn: "wrong", string: "wrong_m3_l10mm" }),
  ).toThrow()
  expect(
    panScrewModelPropsSchema.parse({ metricSize: "M3", length: "1CM" }).length,
  ).toBe(10)
  for (const length of [0.3, 0.35]) {
    expect(() =>
      panScrewModelPropsSchema.parse({ metricSize: "M3", length }),
    ).toThrow()
    expect(() => mp.string(`panscrew_m3_l${length}mm`).json()).toThrow()
  }
  expect(
    panScrewModelPropsSchema.parse({ metricSize: "M3", length: 0.36 }).length,
  ).toBe(0.36)
  expect(mp.string("panscrew_m3_l10mm_recesst10.34mm").json()).toMatchObject({
    recessT1: 0.34,
  })
  expect(() => mp.string("panscrew_m3_l10mm_recesst10.35mm").json()).toThrow()
  expect(() =>
    mp.string("panscrew_m3_l10mm_recesst10.34mm_recesst10.34mm").json(),
  ).toThrow()
  expect(() => mp.string("panscrew_m3_l10mm_recesst1").json()).toThrow()
}
