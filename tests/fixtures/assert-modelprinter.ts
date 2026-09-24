import { z } from "zod"
import { expect } from "bun:test"
import {
  flexScreenModelPropsSchema,
  modelDefinitionSchema,
  mp,
  parseModelString,
} from "../../src"

export function assertModelprinter() {
  // Exported schemas must share the consumer's Zod instance.
  expect(flexScreenModelPropsSchema).toBeInstanceOf(z.ZodType)
  expect(modelDefinitionSchema).toBeInstanceOf(z.ZodType)
  expect(
    modelDefinitionSchema.safeParse({
      fn: "flexscreen",
      foldsAboveBoard: true,
      foldsBelowBoard: true,
    }).success,
  ).toBe(false)

  // "normalizes unit-bearing properties to millimeters"
  {
    expect(
      flexScreenModelPropsSchema.parse({
        width: "2in",
        height: "30mm",
        flexCableLength: "6cm",
        boardTopZ: "-0.5mm",
        screenOffset: { x: "2mm", z: "-3mm" },
      }),
    ).toMatchObject({
      width: 50.8,
      height: 30,
      flexCableLength: 60,
      boardTopZ: -0.5,
      screenOffset: { x: 2, z: -3 },
    })
  }

  // "rejects unknown props and conflicting orientation shortcuts"
  {
    expect(() =>
      flexScreenModelPropsSchema.parse({ imaginaryLength: "4mm" }),
    ).toThrow()
    expect(() =>
      flexScreenModelPropsSchema.parse({
        foldsAboveBoard: true,
        foldsBelowBoard: true,
      }),
    ).toThrow("Only one FlexScreen orientation shortcut can be true")
  }
  const source =
    "flexscreen_w40mm_h22.5mm_flex60mm_foldsabove_distance20mm_foldstart9mm_outset6mm_conductors10"

  // "exposes the raw function and modifiers through params()"
  {
    expect(mp.string(source).params()).toEqual({
      flexscreen: true,
      fn: "flexscreen",
      w: "40mm",
      h: "22.5mm",
      flex: "60mm",
      foldsabove: true,
      distance: "20mm",
      foldstart: "9mm",
      outset: "6mm",
      conductors: "10",
      string: source,
    })
  }

  // "returns flat, validated JSON with fn"
  {
    expect(mp.string(source).json()).toEqual({
      fn: "flexscreen",
      width: 40,
      height: 22.5,
      flexCableLength: 60,
      orientation: "foldedToFaceAboveBoard",
      distanceAboveBoard: 20,
      foldDistanceFromConnector: 9,
      foldOutset: 6,
      conductorCount: 10,
    })
  }

  // "can inspect fn before function-specific validation"
  {
    expect(mp.string("soic8_w5mm").params()).toMatchObject({
      fn: "soic",
      num_pins: 8,
      w: "5mm",
    })
    expect(mp.string("0402").params().fn).toBe("0402")
  }

  // "rejects typos, ambiguous distance, and unsupported functions"
  {
    expect(() =>
      mp.string("flexscreen_foldsabove_distnace20mm").json(),
    ).toThrow('Unknown FlexScreen model token "distnace20mm"')
    expect(() => mp.string("flexscreen_sitsflat_distance20mm").json()).toThrow(
      'The "distance" token requires foldsabove or foldsbelow',
    )
    expect(() => parseModelString("motor_w20mm")).toThrow(
      'Unsupported modelprinter function "motor"',
    )
  }
}
