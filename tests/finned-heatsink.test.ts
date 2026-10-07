import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  finnedHeatsinkModelPropsSchema,
  getFinnedHeatsinkDimensions,
} from "../src"
const source = "finnedheatsink_w20mm_l25mm_h12mm_base2mm_fin1mm_fins6"
test("finned heatsink dimensions, datums and volume", () => {
  const model = mp.string(source).json()
  expect(model).toEqual({
    fn: "finnedheatsink",
    width: 20,
    length: 25,
    height: 12,
    baseThickness: 2,
    finThickness: 1,
    finCount: 6,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("finnedheatsink")
  expect(getFinnedHeatsinkDimensions({ length: 25, height: 12 })).toEqual({
    width: 20,
    length: 25,
    height: 12,
    finPitch: 3.8,
    finGap: 2.8,
    finHeight: 10,
    baseBottomZ: 0,
    baseTopZ: 2,
    volume: 2500,
  })
})
test("finned heatsink normalizes units and defaults", () => {
  expect(
    mp.string("FINNEDHEATSINK_W2cm_L1in_H12000mil_BASE2mm_FIN1mm_FINS6").json(),
  ).toMatchObject({ width: 20, length: 25.4, height: 304.8 })
  const p = finnedHeatsinkModelPropsSchema.parse({})
  expect(mp.string("finnedheatsink").json()).toEqual({
    fn: "finnedheatsink",
    ...p,
  })
  expect(finnedHeatsinkModelPropsSchema.parse(p)).toEqual(p)
  expect(getFinnedHeatsinkDimensions({ finCount: 2 }).finGap).toBe(18)
})
test("finned heatsink rejects conflicting, malformed and unrenderable envelopes", () => {
  for (const value of [
    "finnedheatsink5",
    `${source}_w20mm`,
    `${source}_fins6`,
    `${source}_unknown1`,
    "finnedheatsink_fins",
    "finnedheatsink_fins2.5",
    "finnedheatsink_fins6mm",
    "finnedheatsink_fins1",
    "finnedheatsink_fins129",
    "finnedheatsink_h2mm",
    "finnedheatsink_fin4mm",
    "finnedheatsink_w20mmjunk",
    "finnedheatsink_base0",
    "finnedheatsink_w-1",
  ])
    expect(() => mp.string(value).json()).toThrow()
  for (const width of [0, -1, NaN, Infinity, "20mm junk", 1e308])
    expect(() => finnedHeatsinkModelPropsSchema.parse({ width })).toThrow()
  expect(() => finnedHeatsinkModelPropsSchema.parse({ fins: 4 })).toThrow()
  expect(() =>
    finnedHeatsinkModelPropsSchema.parse({ finCount: 6.5 }),
  ).toThrow()
  expect(() =>
    finnedHeatsinkModelPropsSchema.parse({ baseThickness: 11 }),
  ).toThrow()
  expect(() =>
    finnedHeatsinkModelPropsSchema.parse({
      width: 6,
      finThickness: 1,
      finCount: 6,
    }),
  ).toThrow()
})
