import { expect, test } from "bun:test"
import {
  getStockPlateDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  stockPlateModelDefinitionSchema,
  stockPlateModelPropsSchema,
} from "../src"

test("stock plate roadmap example has a complete millimeter contract", () => {
  const source = "stockplate_l100mm_w80mm_t12mm_edger0mm"
  const expected = {
    fn: "stockplate",
    length: 100,
    width: 80,
    thickness: 12,
    edgeRadius: 0,
  } as const
  expect(mp.string(source).params()).toMatchObject({
    l: "100mm",
    w: "80mm",
    t: "12mm",
    edger: "0mm",
  })
  expect(mp.string(source).json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(stockPlateModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("stockplate")
})

test("stock plate uses a centered XY envelope and a bottom-face Z datum", () => {
  expect(
    getStockPlateDimensions({
      length: 100,
      width: 80,
      thickness: 12,
      edgeRadius: 2,
    }),
  ).toEqual({
    length: 100,
    width: 80,
    thickness: 12,
    edgeRadius: 2,
    minX: -50,
    maxX: 50,
    minY: -40,
    maxY: 40,
    minZ: 0,
    maxZ: 12,
  })
})

test("stock plate accepts normalized units and defaults to sharp edges", () => {
  expect(
    mp.string("STOCKPLATE_length10CM_WIDTH80MM_thickness0.012M").json(),
  ).toEqual({
    fn: "stockplate",
    length: 100,
    width: 80,
    thickness: 12,
    edgeRadius: 0,
  })
  const inchPlate = stockPlateModelPropsSchema.parse({
    length: "1in",
    width: "0.5inch",
    thickness: "100mil",
    edgeRadius: ".01IN",
  })
  expect(inchPlate.length).toBeCloseTo(25.4)
  expect(inchPlate.width).toBeCloseTo(12.7)
  expect(inchPlate.thickness).toBeCloseTo(2.54)
  expect(inchPlate.edgeRadius).toBeCloseTo(0.254)
  expect(
    mp.string("stockplate_l1ft_w0.5feet_t100mil_edger0").json(),
  ).toMatchObject({ length: 304.8, width: 152.4, thickness: 2.54 })
  expect(
    stockPlateModelPropsSchema.parse({ length: 100, width: 80, thickness: 12 }),
  ).toEqual({ length: 100, width: 80, thickness: 12, edgeRadius: 0 })
  expect(
    mp.string("stockplate_l100_w80_t12_edgeradius.5").json(),
  ).toMatchObject({ edgeRadius: 0.5 })
})

test("stock plate rejects omitted, repeated and malformed string parameters", () => {
  const base = "stockplate_l100mm_w80mm_t12mm"
  for (const suffix of [
    "l100mm",
    "length100mm",
    "w80mm",
    "width80mm",
    "t12mm",
    "thickness12mm",
    "edger1mm_edger1mm",
    "edger1mm_edgeradius1mm",
    "edger",
    "edger(1mm)",
    "edger1mmjunk",
    "r1mm",
    "constructor1",
    "color(red)",
    "",
  ])
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  for (const source of [
    "stockplate",
    "stockplate_l100_w80",
    "stockplate_w80_t12",
    "stockplate_l100_t12",
    "stockplate100_l100_w80_t12",
    "stockplate(100)_l100_w80_t12",
    "stockplate_l100mmjunk_w80_t12",
    "stockplate_l1e2_w80_t12",
    "stockplate_l100yd_w80_t12",
    "stockplate_l(100)_w80_t12",
    "stockplate_l100__w80_t12",
    "stockplate_l100_w80_t12_",
  ])
    expect(() => mp.string(source).json()).toThrow()
})

test("stock plate validates finite lengths and radius against every dimension", () => {
  const base = { length: 100, width: 80, thickness: 12 }
  for (const extra of [
    { length: 0 },
    { width: -1 },
    { thickness: 0 },
    { length: Infinity },
    { width: NaN },
    { thickness: "12mmjunk" },
    { length: "1e2" },
    { edgeRadius: -1 },
    { edgeRadius: Infinity },
    { edgeRadius: 6 },
    { edgeRadius: 7 },
    { length: 2, edgeRadius: 1 },
    { width: 2, edgeRadius: 1 },
    { extra: true },
  ]) {
    const props = { ...base, ...extra }
    expect(() => stockPlateModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      stockPlateModelDefinitionSchema.parse({ fn: "stockplate", ...props }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "stockplate", ...props }),
    ).toThrow()
  }
  expect(() => getStockPlateDimensions({ ...base, edgeRadius: 6 })).toThrow()
  expect(mp.string("stockplate_l100_w80_t12_edger5.999").json()).toMatchObject({
    edgeRadius: 5.999,
  })
})
