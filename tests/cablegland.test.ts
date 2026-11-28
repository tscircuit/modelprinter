import { expect, test } from "bun:test"
import {
  cableGlandModelDefinitionSchema,
  cableGlandModelPropsSchema,
  getCableGlandDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
} from "../src"

const source =
  "cablegland_m20_threadpitch1.5mm_cable8mm_barrell12mm_h35mm_hex24mm_capod24mm_compression"

test("cable gland public contract, dimensions and registry integration", () => {
  const model = mp.string(source).json()
  if (model.fn !== "cablegland") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "cablegland",
    metricSize: "M20",
    threadPitch: 1.5,
    cableDiameter: 8,
    barrelLength: 12,
    height: 35,
    hexWidth: 24,
    capOuterDiameter: 24,
    compression: true,
  })
  expect(parseModelString(source)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(cableGlandModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("cablegland")
  expect(mp.string(source).params()).toMatchObject({
    fn: "cablegland",
    m: "20",
    h: "35mm",
    string: source,
  })
  expect(
    getCableGlandDimensions({
      metricSize: "M20",
      cableDiameter: 8,
      barrelLength: 12,
      height: 35,
      hexWidth: 24,
      capOuterDiameter: 24,
    }),
  ).toEqual({
    metricSize: "M20",
    threadPitch: 1.5,
    cableDiameter: 8,
    barrelLength: 12,
    height: 35,
    hexWidth: 24,
    capOuterDiameter: 24,
    compression: true,
    nominalThreadDiameter: 20,
    barrelBottomZ: -12,
    bearingZ: 0,
    topZ: 35,
    abovePanelHeight: 23,
  })
})

test("cable gland bare names support renderer dispatch without a complete model", () => {
  for (const bare of ["cablegland", "CABLEGLAND"]) {
    const builder = mp.string(bare)
    expect(builder.params()).toMatchObject({
      fn: "cablegland",
      string: bare,
    })
    expect(() => builder.json()).toThrow()
  }
})

test("cable gland defaults, unit conversions and value-free compression flag", () => {
  const concise = mp
    .string("cablegland_m20_cable8mm_barrell12mm_h35mm_hex24mm_capod24mm")
    .json()
  expect(concise).toEqual(mp.string(source).json())
  expect(
    mp
      .string(
        "CABLEGLAND_M20_pitch0.15CM_cablediameter0.8CM_barrellength1.2CM_height3.5CM_hexwidth2.4CM_capouterdiameter2.4CM_COMPRESSION",
      )
      .json(),
  ).toEqual(mp.string(source).json())
  expect(
    cableGlandModelPropsSchema.parse({
      metricSize: "M25",
      cableDiameter: "0.5in",
      barrelLength: 15,
      height: 40,
      hexWidth: 30,
      capOuterDiameter: 30,
    }).cableDiameter,
  ).toBeCloseTo(12.7)
})

test("cable gland rejects enum selectors, duplicates and malformed tokens", () => {
  const base = "cablegland_m20_cable8mm_barrell12mm_h35mm_hex24mm_capod24mm"
  for (const suffix of [
    "type(compression)",
    "type(strainrelief)",
    "compression(true)",
    "compression_compression",
    "m20",
    "cable8mm",
    "barrell12mm",
    "h35mm",
    "hex24mm",
    "capod24mm",
    "threadpitch1.5mm_pitch1.5mm",
    "m18",
    "cable20mm",
    "barrell35mm",
    "hex20mm",
    "capod8mm",
    "h0",
    "unknown1",
    "",
  ]) {
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  }
  for (const invalid of [
    "cablegland",
    "cablegland_m20",
    "cablegland(20)_m20_cable8mm_barrell12mm_h35mm_hex24mm_capod24mm",
    "cablegland20_m20_cable8mm_barrell12mm_h35mm_hex24mm_capod24mm",
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
})

test("cable gland direct schemas enforce geometric and metric thread bounds", () => {
  const valid = {
    metricSize: "M20" as const,
    cableDiameter: 8,
    barrelLength: 12,
    height: 35,
    hexWidth: 24,
    capOuterDiameter: 24,
  }
  for (const extra of [
    { metricSize: "M18" },
    { threadPitch: 0 },
    { threadPitch: 20 },
    { cableDiameter: 20 },
    { barrelLength: 35 },
    { hexWidth: 20 },
    { capOuterDiameter: 8 },
    { compression: false },
    { type: "compression" },
    { unknown: true },
    { height: "35mmjunk" },
  ]) {
    const props = { ...valid, ...extra }
    expect(() => cableGlandModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "cablegland", ...props }),
    ).toThrow()
  }
})
