import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  dowelPinModelDefinitionSchema,
  dowelPinModelPropsSchema,
  dowelPinEndLeadLengths,
  dowelPinNominalLengths,
  getDowelPinDimensions,
} from "../src"
const source = "dowelpin_standard(iso8734)_d3mm_l10mm"
test("dowel pin pinned public contract and schema integration", () => {
  const model = mp.string(source).json()
  if (model.fn !== "dowelpin") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "dowelpin",
    standard: "iso8734:1997",
    diameter: 3,
    length: 10,
    endLeadLength: 0.5,
    endLeadAngle: 15,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(dowelPinModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("dowelpin")
  expect(mp.string(source).params()).toMatchObject({
    fn: "dowelpin",
    d: "3mm",
    l: "10mm",
    standard: "(iso8734)",
    string: source,
  })
  expect(getDowelPinDimensions({ diameter: 3, length: 10 })).toMatchObject({
    bearingZ: 0,
    topZ: 10,
    endLeadLength: 0.5,
  })
  expect(
    getDowelPinDimensions({ diameter: 3, length: 10 }).endDiameter,
  ).toBeCloseTo(2.732050807568877)
})
test("dowel pin unit conversions, pinned defaults and tabulated parameter domain", () => {
  expect(
    mp
      .string(
        "DOWELPIN_standard(ISO8734:1997)_diameter0.3CM_length1CM_c0.05CM_endleadangle15",
      )
      .json(),
  ).toEqual(mp.string(source).json())
  expect(mp.string("dowelpin_d3mm_l10mm").json()).toEqual(
    mp.string(source).json(),
  )
  for (const [value, c] of Object.entries(dowelPinEndLeadLengths)) {
    const props = dowelPinModelPropsSchema.parse({
      diameter: Number(value),
      length: 40,
    })
    expect(props.endLeadLength).toBe(c)
    expect(dowelPinModelPropsSchema.parse(props)).toEqual(props)
  }
  for (const length of dowelPinNominalLengths)
    expect(dowelPinModelPropsSchema.parse({ diameter: 1, length }).length).toBe(
      length,
    )
})
test("dowel pin rejects unknown, repeated, malformed and contradictory tokens", () => {
  for (const suffix of [
    "d3mm",
    "diameter3mm",
    "length10mm",
    "l10mm",
    "standard(iso8734)",
    "c0.4mm",
    "c0.5mm_endleadlength0.5mm",
    "endleadangle45",
    "endleadangle15_endleadangle15",
    "threads",
    "round",
    "unknown1",
    "constructor1",
    "",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  for (const value of [
    "dowelpin",
    "dowelpin_d3mm",
    source.replace("d3mm", "d3mmjunk"),
    source.replace("d3mm", "d3e0"),
    source.replace("d3mm", "d(3mm)"),
    source.replace("d3mm", "d3.5mm"),
    source.replace("l10mm", "l11mm"),
    source.replace("standard(iso8734)", "standard(din7)"),
    source.replace("dowelpin_", "dowelpin(3)_"),
  ])
    expect(() => mp.string(value).json()).toThrow()
})
test("dowel pin direct schemas require finite nominal dimensions and separated fixed end leads", () => {
  for (const extra of [
    { diameter: 0 },
    { diameter: Infinity },
    { diameter: NaN },
    { diameter: 3.5 },
    { length: 0 },
    { length: 11 },
    { diameter: 20, length: 6 },
    { length: 101 },
    { endLeadLength: 0.4 },
    { endLeadAngle: 45 },
    { unknown: true },
    { standard: "din7" },
    { length: "10mmjunk" },
    { diameter: "3e0" },
  ]) {
    expect(() =>
      dowelPinModelPropsSchema.parse({ diameter: 3, length: 10, ...extra }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({
        fn: "dowelpin",
        diameter: 3,
        length: 10,
        ...extra,
      }),
    ).toThrow()
  }
})
