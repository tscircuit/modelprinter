import { expect, test } from "bun:test"
import {
  getTSlotJoinPlateDimensions,
  getTSlotJoinPlateMountingSlots,
  modelDefinitionSchema,
  modelprinter,
  mp,
  type TSlotJoinPlateModelDefinition,
  tSlotJoinPlateModelPropsSchema,
} from "../src"

const source = "tslotjoinplate_l80mm_w20mm_t4mm_slots4_slot(5mm,10mm)_p20mm"
const expected: TSlotJoinPlateModelDefinition = {
  fn: "tslotjoinplate",
  length: 80,
  width: 20,
  thickness: 4,
  slotCount: 4,
  slot: [5, 10],
  pitch: 20,
}

test("tslotjoinplate contract, mounting slots, dimensions and registry", () => {
  const parsed = mp.string(source).json()
  expect(parsed).toEqual(expected)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("tslotjoinplate")

  const { fn, ...props } = expected
  expect(tSlotJoinPlateModelPropsSchema.parse(props)).toEqual(props)

  const dims = getTSlotJoinPlateDimensions(props)
  expect(dims).toMatchObject({
    centerSpan: 60,
    firstSlotCenterX: -30,
    lastSlotCenterX: 30,
    ligament: 10,
    endMargin: 5,
    sideMargin: 7.5,
    size: [80, 20, 4],
    bottomZ: 0,
    topZ: 4,
  })

  expect(getTSlotJoinPlateMountingSlots(props)).toEqual([
    {
      center: { x: -30, y: 0, z: 0 },
      orientation: 0,
      width: 5,
      length: 10,
      depth: 4,
      direction: { x: 0, y: 0, z: 1 },
    },
    {
      center: { x: -10, y: 0, z: 0 },
      orientation: 0,
      width: 5,
      length: 10,
      depth: 4,
      direction: { x: 0, y: 0, z: 1 },
    },
    {
      center: { x: 10, y: 0, z: 0 },
      orientation: 0,
      width: 5,
      length: 10,
      depth: 4,
      direction: { x: 0, y: 0, z: 1 },
    },
    {
      center: { x: 30, y: 0, z: 0 },
      orientation: 0,
      width: 5,
      length: 10,
      depth: 4,
      direction: { x: 0, y: 0, z: 1 },
    },
  ])
})

test("tslotjoinplate normalizes units, aliases, case and defaults", () => {
  expect(mp.string("tslotjoinplate").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    mp
      .string(
        "tslotjoinplate_length8cm_width2cm_thickness4mm_slotcount4_slot( 5mm , 1cm )_pitch20mm",
      )
      .json(),
  ).toEqual(expected)
  expect(
    tSlotJoinPlateModelPropsSchema.parse({
      length: "4in",
      width: "1in",
      thickness: "200mil",
      slotCount: 2,
      slot: ["0.2in", "0.5in"],
      pitch: "2in",
    }),
  ).toEqual({
    length: 101.6,
    width: 25.4,
    thickness: 5.08,
    slotCount: 2,
    slot: [5.08, 12.7],
    pitch: 50.8,
  })
})

test("tslotjoinplate rejects malformed, duplicate and geometrically invalid inputs", () => {
  for (const invalidStr of [
    "tslotjoinplate80",
    `${source}_l80mm`,
    `${source}_length80mm`,
    `${source}_slots4`,
    `${source}_slotcount4`,
    `${source}_p20mm`,
    `${source}_pitch20mm`,
    `${source}_slot(5mm,10mm)`,
    `${source}_unknown1`,
    "tslotjoinplate_slots1",
    "tslotjoinplate_slots65",
    "tslotjoinplate_slots4mm",
    "tslotjoinplate_slots2.5",
    "tslotjoinplate_slot(5mm)",
    "tslotjoinplate_slot(10mm,5mm)",
    "tslotjoinplate_w5mm_slot(5mm,10mm)",
    "tslotjoinplate_p10mm_slot(5mm,10mm)",
    "tslotjoinplate_l70mm_slots4_slot(5mm,10mm)_p20mm",
    "tslotjoinplate_l",
  ]) {
    expect(() => mp.string(invalidStr).json()).toThrow()
  }

  for (const badLength of [
    0,
    -5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    1e308,
  ]) {
    expect(() =>
      tSlotJoinPlateModelPropsSchema.parse({ length: badLength }),
    ).toThrow()
  }

  expect(() => tSlotJoinPlateModelPropsSchema.parse({ extra: true })).toThrow()
})
