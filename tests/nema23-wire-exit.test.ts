import { expect, test } from "bun:test"
import {
  getNemaMotorReferencePoints,
  mp,
  nemaMotorModelPropsSchema,
} from "../src"

test("NEMA23 defaults to the front wire side and preserves the rear screw axes", () => {
  const model = mp.string("nema23").json()
  if (model.fn !== "nema") throw new Error("Expected NEMA")
  expect(model).toMatchObject({
    wireSideAngle: 270,
    backFaceHoleSpacingX: 50,
    backFaceHoleSpacingY: 32,
    mountingHoleSpacing: 47.14,
  })
  const { fn, ...props } = model
  expect(nemaMotorModelPropsSchema.parse({ nemaSize: 23 })).toEqual(props)
  const ref = getNemaMotorReferencePoints({ nemaSize: 23 }).wireside
  expect(ref.direction.x).toBeCloseTo(0, 10)
  expect(ref.direction.y).toBeCloseTo(-1, 10)
  expect(ref.direction.z).toBe(0)
  expect(ref.position.x).toBeCloseTo(0, 10)
  expect(ref.position.y).toBeCloseTo(-28.2, 10)
  expect(ref.position.z).toBe(-48.5)
})

test("NEMA23 wire-angle overrides do not rotate the motor mounting references", () => {
  const front = getNemaMotorReferencePoints({ nemaSize: 23 })
  const side = getNemaMotorReferencePoints({
    nemaSize: 23,
    wireSideAngle: 0,
  })
  expect(side.wireside.direction).toEqual({ x: 1, y: 0, z: 0 })
  for (const name of [
    "frontface",
    "backface",
    "shafttip",
    "shaftflat",
  ] as const)
    expect(front[name]).toEqual(side[name])
  for (const angle of [0, 90, 180, 270, -90, 360]) {
    const expected = ((angle % 360) + 360) % 360
    expect(mp.string(`nema23_wireangle${angle}deg`).json()).toMatchObject({
      wireSideAngle: expected,
      backFaceHoleSpacingX: 50,
      backFaceHoleSpacingY: 32,
    })
  }
})

test("hidden wires and JST terminations share NEMA23's default mounting direction", () => {
  const expected = getNemaMotorReferencePoints({ nemaSize: 23 }).wireside
  for (const props of [
    { noWires: true },
    { wireStubs: true },
    { wireConnection: "jst-ph-4" },
  ])
    expect(
      getNemaMotorReferencePoints({ nemaSize: 23, ...props }).wireside,
    ).toEqual(expected)
  for (const [nemaSize, wireSideAngle] of [
    [8, 0],
    [17, 0],
    [34, 90],
  ] as const)
    expect(nemaMotorModelPropsSchema.parse({ nemaSize })).toMatchObject({
      wireSideAngle,
    })
})
