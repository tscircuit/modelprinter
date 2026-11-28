import { expect, test } from "bun:test"
import {
  flangedLinearBushingModelPropsSchema,
  getFlangedLinearBushingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flangedlinearbushing resolves LMF12UU 12x21x30mm flanged bushing", () => {
  const parsed = parseModelString(
    "flangedlinearbushing_id12mm_od21mm_l30mm_flangeod42mm_closedrecirculating_round4hole_pcd32mm_holed4mm",
  )
  expect(parsed).toEqual({
    fn: "flangedlinearbushing",
    innerDiameter: 12,
    outerDiameter: 21,
    length: 30,
    flangeOuterDiameter: 42,
    closedRecirculating: true,
    round4Hole: true,
    pitchCircleDiameter: 32,
    holeDiameter: 4,
  })

  const dims = getFlangedLinearBushingDimensions()
  expect(dims.flangeThickness).toBe(6)
  expect(dims.mountingHoleCount).toBe(4)
})

test("flangedlinearbushing supports 8mm LMF8UU variant and roundtrips", () => {
  const parsed = parseModelString(
    "flangedlinearbushing_id8mm_od15mm_l24mm_flangeod32mm_pcd24mm_holed3.5mm",
  )
  expect(parsed.fn).toBe("flangedlinearbushing")
  if (parsed.fn !== "flangedlinearbushing") return
  expect(parsed.innerDiameter).toBe(8)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flangedLinearBushingModelPropsSchema.parse({}).round4Hole).toBe(true)
})

test("flangedlinearbushing rejects legacy selectors and colliding bolt circles", () => {
  expect(() =>
    parseModelString("flangedlinearbushing_mount(round4hole)"),
  ).toThrow()
  expect(() =>
    parseModelString("flangedlinearbushing_od21mm_pcd22mm_holed4mm"),
  ).toThrow()
})
