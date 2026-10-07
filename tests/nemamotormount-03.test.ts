import { expect, test } from "bun:test"
import {
  mp,
  nemaMotorMountModelPropsSchema,
  parseNemaMotorMountModelParams,
  parseModelStringParams,
} from "../src"

test("nemamotormount normalizes supported units and unambiguous parameter aliases", () => {
  const string =
    "NEMAMOTORMOUNT_NEMASIZE17_WIDTH5CM_HEIGHT6CM_BASEDEPTH4CM_THICKNESS3MM_AXISHEIGHT3CM_MOUNTSPAN3.1CM_SHAFTCLEARANCE2.3CM_MOTORHOLE3.5MM_BASEHOLE5.5MM_BASEHOLESPACING3CM_BASEHOLEOFFSET2CM"
  const definition = mp.string(string).json()
  if (definition.fn !== "nemamotormount") throw new Error("Wrong family")
  expect(definition).toEqual({
    fn: "nemamotormount",
    ...nemaMotorMountModelPropsSchema.parse({}),
  })
  expect(
    parseNemaMotorMountModelParams(parseModelStringParams(string)),
  ).toEqual(definition)
  expect(
    nemaMotorMountModelPropsSchema.parse({ width: "2in" }).width,
  ).toBeCloseTo(50.8)
  expect(
    nemaMotorMountModelPropsSchema.parse({ width: "0.05m", height: "60mm" })
      .width,
  ).toBe(50)
})
