import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  adhesiveMountElectricalHeatsinkModelPropsSchema,
  getAdhesiveMountElectricalHeatsinkDimensions,
} from "../src"
const source =
  "adhesivemountelectricalheatsink_w20mm_l25mm_h12mm_base2mm_fin1mm_fins6"
test("adhesive-mount electrical heatsink dimensions, datums and volume", () => {
  const model = mp.string(source).json()
  expect(model).toEqual({
    fn: "adhesivemountelectricalheatsink",
    width: 20,
    length: 25,
    height: 12,
    baseThickness: 2,
    finThickness: 1,
    finCount: 6,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain(
    "adhesivemountelectricalheatsink",
  )
  expect(
    getAdhesiveMountElectricalHeatsinkDimensions({ length: 25, height: 12 }),
  ).toEqual({
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
test("adhesive-mount electrical heatsink normalizes units and defaults", () => {
  expect(
    mp
      .string(
        "ADHESIVEMOUNTELECTRICALHEATSINK_W2cm_L1in_H12000mil_BASE2mm_FIN1mm_FINS6",
      )
      .json(),
  ).toMatchObject({ width: 20, length: 25.4, height: 304.8 })
  const p = adhesiveMountElectricalHeatsinkModelPropsSchema.parse({})
  expect(mp.string("adhesivemountelectricalheatsink").json()).toEqual({
    fn: "adhesivemountelectricalheatsink",
    ...p,
  })
  expect(adhesiveMountElectricalHeatsinkModelPropsSchema.parse(p)).toEqual(p)
  expect(
    getAdhesiveMountElectricalHeatsinkDimensions({ finCount: 2 }).finGap,
  ).toBe(18)
})
test("adhesive-mount electrical heatsink rejects conflicting, malformed and unrenderable envelopes", () => {
  for (const value of [
    "adhesivemountelectricalheatsink5",
    `${source}_w20mm`,
    `${source}_fins6`,
    `${source}_unknown1`,
    "adhesivemountelectricalheatsink_fins",
    "adhesivemountelectricalheatsink_fins2.5",
    "adhesivemountelectricalheatsink_fins6mm",
    "adhesivemountelectricalheatsink_fins1",
    "adhesivemountelectricalheatsink_fins129",
    "adhesivemountelectricalheatsink_h2mm",
    "adhesivemountelectricalheatsink_fin4mm",
    "adhesivemountelectricalheatsink_w20mmjunk",
    "adhesivemountelectricalheatsink_base0",
    "adhesivemountelectricalheatsink_w-1",
  ])
    expect(() => mp.string(value).json()).toThrow()
  for (const width of [0, -1, NaN, Infinity, "20mm junk", 1e308])
    expect(() =>
      adhesiveMountElectricalHeatsinkModelPropsSchema.parse({ width }),
    ).toThrow()
  expect(() =>
    adhesiveMountElectricalHeatsinkModelPropsSchema.parse({ fins: 4 }),
  ).toThrow()
  expect(() =>
    adhesiveMountElectricalHeatsinkModelPropsSchema.parse({ finCount: 6.5 }),
  ).toThrow()
  expect(() =>
    adhesiveMountElectricalHeatsinkModelPropsSchema.parse({
      baseThickness: 11,
    }),
  ).toThrow()
  expect(() =>
    adhesiveMountElectricalHeatsinkModelPropsSchema.parse({
      width: 6,
      finThickness: 1,
      finCount: 6,
    }),
  ).toThrow()
})
