import { expect, test } from "bun:test"
import {
  getTSlotOutsideCornerDimensions,
  getTSlotOutsideCornerMountingHoles,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  tSlotOutsideCornerModelDefinitionSchema,
  tSlotOutsideCornerModelPropsSchema,
} from "../src"

const example =
  "tslotoutsidecorner_w40mm_leg40mm_t4mm_angle90deg_holes4_hole5mm_hp20mm_bendr4mm"

test("T-slot outside corner roadmap example resolves its mounting contract", () => {
  const parsed = mp.string(example).json()
  if (parsed.fn !== "tslotoutsidecorner") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "tslotoutsidecorner",
    width: 40,
    legLength: 40,
    thickness: 4,
    angle: 90,
    holeCount: 4,
    holeDiameter: 5,
    holePitch: 20,
    holeOffset: 20,
    bendRadius: 4,
  })
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tSlotOutsideCornerModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("tslotoutsidecorner")
})

test("T-slot outside corner resolves inner mounting-face holes and bend radii", () => {
  expect(getTSlotOutsideCornerDimensions({ bendRadius: 6 })).toMatchObject({
    outerBendRadius: 6,
    innerBendRadius: 2,
    innerLegLength: 36,
    sideMargin: 7.5,
    size: [40, 40, 40],
  })
  expect(getTSlotOutsideCornerMountingHoles()).toEqual([
    {
      center: { x: 20, y: -10, z: 4 },
      direction: { x: 0, y: 0, z: -1 },
      diameter: 5,
      depth: 4,
    },
    {
      center: { x: 20, y: 10, z: 4 },
      direction: { x: 0, y: 0, z: -1 },
      diameter: 5,
      depth: 4,
    },
    {
      center: { x: 4, y: -10, z: 20 },
      direction: { x: -1, y: 0, z: 0 },
      diameter: 5,
      depth: 4,
    },
    {
      center: { x: 4, y: 10, z: 20 },
      direction: { x: -1, y: 0, z: 0 },
      diameter: 5,
      depth: 4,
    },
  ])
})

test("T-slot outside corner normalizes units, aliases and defaults", () => {
  const defaults = tSlotOutsideCornerModelPropsSchema.parse({})
  expect(mp.string("tslotoutsidecorner").json()).toEqual({
    fn: "tslotoutsidecorner",
    ...defaults,
  })
  expect(
    parseModelString(
      "TSLOTOUTSIDECORNER_WIDTH4CM_LEGLENGTH4CM_THICKNESS4MM_ANGLE90DEG_HOLECOUNT4_HOLEDIAMETER5MM_HOLEPITCH2CM_HOLEOFFSET2CM_BENDRADIUS4MM",
    ),
  ).toEqual({
    fn: "tslotoutsidecorner",
    ...defaults,
  })
  expect(
    tSlotOutsideCornerModelPropsSchema.parse({ width: "2in" }).width,
  ).toBeCloseTo(50.8)
})

test("T-slot outside corner rejects incompatible layouts and malformed tokens", () => {
  for (const badProps of [
    { holeCount: 2 },
    { angle: 60 },
    { thickness: 40 },
    { bendRadius: 40 },
    { holePitch: 5 },
    { holePitch: 35 },
    { holeOffset: 6.5 },
    { bendRadius: 18, holeOffset: 20 },
    { holeOffset: 37.5 },
    { width: 0 },
    { legLength: Number.POSITIVE_INFINITY },
    { bendRadius: -1 },
    { holeOffset: Number.NaN },
    { unexpected: 1 },
  ]) {
    expect(tSlotOutsideCornerModelPropsSchema.safeParse(badProps).success).toBe(
      false,
    )
  }

  for (const invalidTokenStr of [
    "tslotoutsidecorner4",
    "tslotoutsidecorner_w40mm_width40mm",
    "tslotoutsidecorner_holes4_holecount4",
    "tslotoutsidecorner_hp20mm_holepitch20mm",
    "tslotoutsidecorner_offset20mm_holeoffset20mm",
    "tslotoutsidecorner_bendr4mm_bendradius4mm",
    "tslotoutsidecorner_holes4mm",
    "tslotoutsidecorner_angle90rad",
    "tslotoutsidecorner_w",
    "tslotoutsidecorner_unknown1mm",
  ]) {
    expect(() => parseModelString(invalidTokenStr)).toThrow()
  }
})
