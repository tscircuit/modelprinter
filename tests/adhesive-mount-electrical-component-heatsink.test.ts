import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  adhesiveMountElectricalComponentHeatsinkModelPropsSchema,
  getAdhesiveMountElectricalComponentHeatsinkDimensions,
} from "../src"
const source =
  "adhesivemountelectricalcomponentheatsink_w20mm_l25mm_h12mm_base2mm_fin1mm_fins6"
test("adhesive-mount electrical component heatsink dimensions, datums and volume", () => {
  const model = mp.string(source).json()
  expect(model).toEqual({
    fn: "adhesivemountelectricalcomponentheatsink",
    width: 20,
    length: 25,
    height: 12,
    baseThickness: 2,
    finThickness: 1,
    finCount: 6,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain(
    "adhesivemountelectricalcomponentheatsink",
  )
  expect(
    getAdhesiveMountElectricalComponentHeatsinkDimensions({
      length: 25,
      height: 12,
    }),
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
test("adhesive-mount electrical component heatsink normalizes units and defaults", () => {
  expect(
    mp
      .string(
        "ADHESIVEMOUNTELECTRICALCOMPONENTHEATSINK_W2cm_L1in_H12000mil_BASE2mm_FIN1mm_FINS6",
      )
      .json(),
  ).toMatchObject({ width: 20, length: 25.4, height: 304.8 })
  const p = adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse({})
  expect(mp.string("adhesivemountelectricalcomponentheatsink").json()).toEqual({
    fn: "adhesivemountelectricalcomponentheatsink",
    ...p,
  })
  expect(
    adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse(p),
  ).toEqual(p)
  expect(
    getAdhesiveMountElectricalComponentHeatsinkDimensions({ finCount: 2 })
      .finGap,
  ).toBe(18)
})
test("adhesive-mount electrical component heatsink rejects conflicting, malformed and unrenderable envelopes", () => {
  for (const value of [
    "adhesivemountelectricalcomponentheatsink5",
    `${source}_w20mm`,
    `${source}_fins6`,
    `${source}_unknown1`,
    "adhesivemountelectricalcomponentheatsink_fins",
    "adhesivemountelectricalcomponentheatsink_fins2.5",
    "adhesivemountelectricalcomponentheatsink_fins6mm",
    "adhesivemountelectricalcomponentheatsink_fins1",
    "adhesivemountelectricalcomponentheatsink_fins129",
    "adhesivemountelectricalcomponentheatsink_h2mm",
    "adhesivemountelectricalcomponentheatsink_fin4mm",
    "adhesivemountelectricalcomponentheatsink_w20mmjunk",
    "adhesivemountelectricalcomponentheatsink_base0",
    "adhesivemountelectricalcomponentheatsink_w-1",
  ])
    expect(() => mp.string(value).json()).toThrow()
  for (const width of [0, -1, NaN, Infinity, "20mm junk", 1e308])
    expect(() =>
      adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse({ width }),
    ).toThrow()
  expect(() =>
    adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse({ fins: 4 }),
  ).toThrow()
  expect(() =>
    adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse({
      finCount: 6.5,
    }),
  ).toThrow()
  expect(() =>
    adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse({
      baseThickness: 11,
    }),
  ).toThrow()
  expect(() =>
    adhesiveMountElectricalComponentHeatsinkModelPropsSchema.parse({
      width: 6,
      finThickness: 1,
      finCount: 6,
    }),
  ).toThrow()
})
