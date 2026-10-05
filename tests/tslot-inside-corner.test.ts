import { expect, test } from "bun:test"
import {
  getTSlotInsideCornerMountingHoles,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  tSlotInsideCornerModelDefinitionSchema,
  tSlotInsideCornerModelPropsSchema,
} from "../src"

const example =
  "tslotinsidecorner_w20mm_leg40mm_t4mm_angle90deg_holes2_hole5mm_offset20mm_bendr1mm"

test("T-slot inside corner roadmap example resolves its mounting contract", () => {
  const model = mp.string(example).json()
  if (model.fn !== "tslotinsidecorner") throw new Error("Wrong model family")
  expect(model).toEqual({
    fn: "tslotinsidecorner",
    width: 20,
    legLength: 40,
    thickness: 4,
    angle: 90,
    holeCount: 2,
    holeDiameter: 5,
    holeOffset: 20,
    bendRadius: 1,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(tSlotInsideCornerModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("tslotinsidecorner")
})

test("T-slot inside corner holes cut through the centered width on both legs", () => {
  expect(getTSlotInsideCornerMountingHoles({ bendRadius: "1mm" })).toEqual([
    {
      center: { x: 20, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: -1 },
      diameter: 5,
      depth: 4,
    },
    {
      center: { x: 0, y: 0, z: 20 },
      direction: { x: -1, y: 0, z: 0 },
      diameter: 5,
      depth: 4,
    },
  ])
})

test("T-slot inside corner normalizes units and supplies sharp bend defaults", () => {
  const props = tSlotInsideCornerModelPropsSchema.parse({
    width: "2cm",
    legLength: "4cm",
    thickness: "0.4cm",
    holeOffset: "2cm",
  })
  expect(props).toEqual(tSlotInsideCornerModelPropsSchema.parse({}))
  expect(props.bendRadius).toBe(0)
  expect(parseModelString("TSLOTINSIDECORNER_WIDTH2CM_ANGLE90DEG")).toEqual({
    fn: "tslotinsidecorner",
    ...props,
  })
  expect(
    tSlotInsideCornerModelPropsSchema.parse({ width: "1in" }).width,
  ).toBeCloseTo(25.4)
})

test("T-slot inside corner rejects undefined layouts and edge or bend contact", () => {
  for (const props of [
    { holeCount: 1 },
    { holeCount: 4 },
    { angle: 45 },
    { holeDiameter: 20 },
    { holeOffset: 2.5 },
    { holeOffset: 37.5 },
    { bendRadius: 17.5 },
    { bendRadius: 40 },
    { thickness: 40 },
    { width: 0 },
    { legLength: Infinity },
    { thickness: "4mmjunk" },
    { bendRadius: -1 },
    { holeOffset: NaN },
    { unexpected: 1 },
  ]) {
    expect(tSlotInsideCornerModelPropsSchema.safeParse(props).success).toBe(
      false,
    )
    expect(
      tSlotInsideCornerModelDefinitionSchema.safeParse({
        fn: "tslotinsidecorner",
        ...props,
      }).success,
    ).toBe(false)
  }
})

test("T-slot inside corner parser rejects ambiguous and malformed tokens", () => {
  for (const value of [
    "tslotinsidecorner2",
    "tslotinsidecorner_w20mm_width20mm",
    "tslotinsidecorner_holes2_holecount2",
    "tslotinsidecorner_holes2_holes2",
    "tslotinsidecorner_holes2mm",
    "tslotinsidecorner_holes2.0",
    "tslotinsidecorner_angle90rad",
    "tslotinsidecorner_angle90deg_angle90deg",
    "tslotinsidecorner_t",
    "tslotinsidecorner_offset20mmjunk",
    "tslotinsidecorner_unknown1mm",
    "tslotinsidecorner__w20mm",
  ])
    expect(() => parseModelString(value)).toThrow()
})
