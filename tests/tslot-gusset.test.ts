import { expect, test } from "bun:test"
import {
  getTSlotGussetMountingSlots,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  tSlotGussetModelDefinitionSchema,
  tSlotGussetModelPropsSchema,
} from "../src"

const example =
  "tslotgusset_w40mm_h40mm_t4mm_shape(righttriangle)_slots2_slot(5mm,12mm)_centers(12mm,28mm)"

test("T-slot gusset roadmap example resolves every shape and layout token", () => {
  const model = mp.string(example).json()
  if (model.fn !== "tslotgusset") throw new Error("Wrong model family")
  expect(model).toEqual({
    fn: "tslotgusset",
    width: 40,
    height: 40,
    thickness: 4,
    shape: "righttriangle",
    slotCount: 2,
    slot: [5, 12],
    centers: [12, 28],
    edgeMargin: 1,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(tSlotGussetModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("tslotgusset")
})

test("T-slot gusset defines perpendicular through slots with unambiguous centers", () => {
  expect(getTSlotGussetMountingSlots()).toEqual([
    {
      center: { x: 12, y: 3.5, z: 0 },
      orientation: 0,
      width: 5,
      length: 12,
      depth: 4,
      direction: { x: 0, y: 0, z: 1 },
    },
    {
      center: { x: 3.5, y: 28, z: 0 },
      orientation: 90,
      width: 5,
      length: 12,
      depth: 4,
      direction: { x: 0, y: 0, z: 1 },
    },
  ])
})

test("T-slot gusset normalizes tuple units and defaults its full custom layout", () => {
  const props = tSlotGussetModelPropsSchema.parse({
    width: "4cm",
    height: "4cm",
    thickness: "0.4cm",
    slot: ["0.5cm", "1.2cm"],
    centers: ["1.2cm", "2.8cm"],
    edgeMargin: "0.1cm",
  })
  expect(props).toEqual(tSlotGussetModelPropsSchema.parse({}))
  expect(
    parseModelString("TSLOTGUSSET_SLOT(0.5CM, 1.2CM)_CENTERS(1.2CM,2.8CM)"),
  ).toEqual({
    fn: "tslotgusset",
    ...props,
  })
  expect(
    tSlotGussetModelPropsSchema.parse({ thickness: "1in" }).thickness,
  ).toBeCloseTo(25.4)
})

test("T-slot gusset accepts non-square triangles and round-ended slots", () => {
  expect(
    tSlotGussetModelPropsSchema.safeParse({ width: 50, height: 45 }).success,
  ).toBe(true)
  expect(tSlotGussetModelPropsSchema.safeParse({ slot: [5, 5] }).success).toBe(
    true,
  )
})

test("T-slot gusset rejects slot boundary contact, overlap and unspecified layouts", () => {
  for (const props of [
    { slotCount: 1 },
    { shape: "square" },
    { slot: [12, 5] },
    { slot: [5, 12, 3] },
    { centers: [6, 28] },
    { centers: [12, 31] },
    { centers: [8, 8] },
    { centers: [12] },
    { edgeMargin: 0 },
    { width: 0 },
    { height: 20 },
    { thickness: Infinity },
    { slot: [NaN, 12] },
    { centers: ["12mmjunk", 28] },
    { edgeMargin: 1e308 },
    { width: 5e-324, height: 5e-324 },
    { unexpected: true },
  ]) {
    expect(tSlotGussetModelPropsSchema.safeParse(props).success).toBe(false)
    expect(
      tSlotGussetModelDefinitionSchema.safeParse({
        fn: "tslotgusset",
        ...props,
      }).success,
    ).toBe(false)
  }
})

test("T-slot gusset parser rejects duplicates, tuple mistakes and unknown tokens", () => {
  for (const value of [
    "tslotgusset2",
    "tslotgusset_w40mm_width40mm",
    "tslotgusset_slots2_slotcount2",
    "tslotgusset_slots2mm",
    "tslotgusset_slot(5mm,12mm)_slot(5mm,12mm)",
    "tslotgusset_centers(12mm,28mm)_centers(12mm,28mm)",
    "tslotgusset_slot(5mm)",
    "tslotgusset_slot(5mm,12mm,1mm)",
    "tslotgusset_slot(5mm,)",
    "tslotgusset_centers((12mm,28mm))",
    "tslotgusset_shape(righttriangle,righttriangle)",
    "tslotgusset_shape(righttriangle)_shape(righttriangle)",
    "tslotgusset_centers(12mm,28mm",
    "tslotgusset_t",
    "tslotgusset_unknown1mm",
    "tslotgusset__w40mm",
  ])
    expect(() => parseModelString(value)).toThrow()
})
