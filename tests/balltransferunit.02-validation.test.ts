import { expect, test } from "bun:test"
import {
  ballTransferUnitDefaults,
  ballTransferUnitModelDefinitionSchema,
  ballTransferUnitModelPropsSchema,
  mp,
} from "../src"

test("balltransferunit rejects ambiguous, duplicate and unsupported strings", () => {
  for (const source of [
    "balltransferunit25",
    "balltransferunit_unknown1mm",
    "balltransferunit_balld25mm_balldiameter25mm",
    "balltransferunit_h30mm_height30mm",
    "balltransferunit_face3hole_face3hole",
    "balltransferunit_face3hole_mount(face3hole)",
    "balltransferunit_mount(face3hole)_mount(face3hole)",
    "balltransferunit_mount(face4hole)",
    "balltransferunit_mountface3hole",
    "balltransferunit_face3hole(false)",
    "balltransferunit_ballprotrusion",
    "balltransferunit_balld25mmjunk",
    "balltransferunit_balld25e0mm",
    "balltransferunit_balld(25mm)",
    "balltransferunit_balld25mm__h30mm",
  ])
    expect(() => mp.string(source).json(), source).toThrow()
})

test("balltransferunit refuses impossible housing, retaining lip and mounting holes", () => {
  for (const props of [
    { bodyDiameter: 25.5 }, // socket reaches outside housing
    { height: 25.25 }, // socket reaches bottom
    { ballProtrusion: 12.5 }, // hemisphere cannot be retained
    { ballProtrusion: 11 }, // clearance widens opening beyond ball
    { flangeThickness: 22.5 }, // no cup below flange
    { pitchCircleDiameter: 35 }, // holes touch housing
    { flangeDiameter: 40 }, // holes touch flange rim
    { holeDiameter: 6 }, // holes intersect housing
    { socketClearance: -0.1 },
    { faceThreeHole: false },
    { mount: "face4hole" },
    { height: "30mmjunk" },
    { height: "3e1mm" },
    { ballDiameter: "25mm " },
  ]) {
    expect(ballTransferUnitModelPropsSchema.safeParse(props).success).toBe(
      false,
    )
    expect(
      ballTransferUnitModelDefinitionSchema.safeParse({
        fn: "balltransferunit",
        ...props,
      }).success,
    ).toBe(false)
  }
  for (const key of Object.keys(ballTransferUnitDefaults).filter(
    (key) => key !== "faceThreeHole",
  ))
    for (const value of [NaN, Infinity, -1, "NaN", "Infinity", "2px"])
      expect(
        ballTransferUnitModelPropsSchema.safeParse({ [key]: value }).success,
      ).toBe(false)
  for (const key of Object.keys(ballTransferUnitDefaults).filter(
    (key) => !["faceThreeHole", "socketClearance"].includes(key),
  ))
    expect(
      ballTransferUnitModelPropsSchema.safeParse({ [key]: 0 }).success,
    ).toBe(false)
  expect(
    ballTransferUnitModelPropsSchema.safeParse({ height: 1e200 }).success,
  ).toBe(false)
})
