import { expect, test } from "bun:test"
import {
  nemaMotorMountModelPropsSchema,
  nemaMotorMountModelDefinitionSchema,
} from "../src"

test("nemamotormount rejects conflicting interfaces, motor collisions and lost ligaments", () => {
  for (const props of [
    { nemaSize: 8 },
    { nemaSize: "17" },
    { width: 42 },
    { height: 51 },
    { axisHeight: 24.15 },
    { axisHeight: 60 },
    { thickness: 30 },
    { mountingHoleSpacing: 30 },
    { nemaSize: 23, mountingHoleSpacing: 31 },
    { shaftClearanceDiameter: 22 },
    { nemaSize: 23, shaftClearanceDiameter: 38.1 },
    { shaftClearanceDiameter: 40.340620433565945 },
    { mountingHoleDiameter: 3 },
    { mountingHoleDiameter: 19 },
    { baseHoleSpacing: 5.5 },
    { baseHoleSpacing: 44.5 },
    { baseHoleOffset: 2.75 },
    { baseDepth: 22.75 },
    { width: 0 },
    { height: Infinity },
    { thickness: "3mmjunk" },
    { baseHoleDiameter: NaN },
    { width: 1e308, baseDepth: 1e308 },
    { bendRadius: 2 },
    { manufacturer: "example" },
  ]) {
    expect(
      nemaMotorMountModelPropsSchema.safeParse(props).success,
      JSON.stringify(props),
    ).toBe(false)
    expect(
      nemaMotorMountModelDefinitionSchema.safeParse({
        fn: "nemamotormount",
        ...props,
      }).success,
    ).toBe(false)
  }
})
