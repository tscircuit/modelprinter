import { expect } from "bun:test"
import {
  femaleStandoffModelDefinitionSchema,
  femaleStandoffModelPropsSchema,
  maleFemaleStandoffModelDefinitionSchema,
  maleFemaleStandoffModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
  type FemaleStandoffModelPropsInput,
  type MaleFemaleStandoffModelPropsInput,
} from "../../src"

export function assertStandoffs() {
  for (const fn of ["femalestandoff", "malefemalestandoff"] as const) {
    const body = {
      metricSize: "M3" as const,
      width: 5.5,
      length: 10,
    }
    const expected =
      fn === "femalestandoff" ? { ...body, fn } : { ...body, fn, studLength: 5 }
    const source = `${fn}_m3_w5.5mm_l10mm${fn === "malefemalestandoff" ? "_stud5mm" : ""}`
    expect(mp.string(source).json()).toEqual(expected)
    expect(mp.string(fn).json()).toEqual(expected)
    expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
    expect(modelprinter.getModelNames()).toContain(fn)
    expect(mp.string(source).params()).toMatchObject({
      fn,
      m: "3",
      w: "5.5mm",
      l: "10mm",
    })

    expect(
      mp.string(`${fn.toUpperCase()}_M2.5_WIDTH0.25in_LENGTH2cm`).json(),
    ).toMatchObject({
      fn,
      metricSize: "M2.5",
      width: 6.35,
      length: 20,
    })
    expect(mp.string(`${fn}_m6_w10mm_l20mm`).json()).toMatchObject({
      metricSize: "M6",
      width: 10,
      length: 20,
    })

    for (const suffix of [
      "_m7",
      "_m",
      "_m3mm",
      "_m3_m4",
      "_w3mm",
      "_w2.5mm",
      "_w0",
      "_w-1mm",
      "_l0",
      "_l-1mm",
      "_w",
      "_l",
      "_typo1mm",
      "_w5mm_w6mm",
      "_w5mm_width6mm",
      "_l10mm_length20mm",
      "__l10mm",
      "3_m3",
      "(3)_m3",
    ]) {
      expect(() => mp.string(`${fn}${suffix}`).json()).toThrow()
    }
  }

  expect(mp.string("malefemalestandoff_studlength0.25in").json()).toMatchObject(
    { studLength: 6.35 },
  )
  for (const source of [
    "femalestandoff_stud5mm",
    "femalestandoff_studlength5mm",
    "malefemalestandoff_stud0",
    "malefemalestandoff_stud-1mm",
    "malefemalestandoff_stud",
    "malefemalestandoff_stud5mm_studlength6mm",
  ]) {
    expect(() => mp.string(source).json()).toThrow()
  }

  const femaleInput: FemaleStandoffModelPropsInput = {
    width: "0.25in",
    length: "2cm",
  }
  const maleInput: MaleFemaleStandoffModelPropsInput = {
    ...femaleInput,
    studLength: "0.5cm",
  }
  expect(femaleStandoffModelPropsSchema.parse(femaleInput)).toEqual({
    metricSize: "M3",
    width: 6.35,
    length: 20,
  })
  expect(maleFemaleStandoffModelPropsSchema.parse(maleInput)).toEqual({
    metricSize: "M3",
    width: 6.35,
    length: 20,
    studLength: 5,
  })

  for (const [schema, base] of [
    [femaleStandoffModelPropsSchema, {}],
    [maleFemaleStandoffModelPropsSchema, {}],
    [femaleStandoffModelDefinitionSchema, { fn: "femalestandoff" }],
    [maleFemaleStandoffModelDefinitionSchema, { fn: "malefemalestandoff" }],
  ] as const) {
    for (const property of ["width", "length"]) {
      for (const invalid of [0, -1, NaN, Infinity, "nonsense"]) {
        expect(() => schema.parse({ ...base, [property]: invalid })).toThrow()
      }
    }
    expect(() =>
      schema.parse({ ...base, metricSize: "M6", width: "0.5cm" }),
    ).toThrow()
    expect(() => schema.parse({ ...base, typo: true })).toThrow()
  }
  expect(() =>
    femaleStandoffModelPropsSchema.parse({ studLength: 5 }),
  ).toThrow()
  expect(() =>
    femaleStandoffModelDefinitionSchema.parse({
      fn: "femalestandoff",
      studLength: 5,
    }),
  ).toThrow()
  for (const studLength of [0, -1, NaN, Infinity, "nonsense"]) {
    expect(() =>
      maleFemaleStandoffModelPropsSchema.parse({ studLength }),
    ).toThrow()
    expect(() =>
      maleFemaleStandoffModelDefinitionSchema.parse({
        fn: "malefemalestandoff",
        studLength,
      }),
    ).toThrow()
  }
}
