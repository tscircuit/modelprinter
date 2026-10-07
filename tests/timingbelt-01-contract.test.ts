import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  timingBeltModelPropsSchema,
  getTimingBeltDimensions,
  parseTimingBeltModelParams,
} from "../src"
const example = "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm"
test("timingbelt canonical string, dimensions, units and registration", () => {
  const expected = {
    fn: "timingbelt",
    profile: "t5",
    shape: "openstraight",
    toothCount: 20,
    width: 10,
  } as const
  expect(mp.string(example).json()).toEqual(expected)
  expect(mp.string("timingbelt").json()).toEqual(expected)
  expect(
    mp
      .string(
        "TIMINGBELT_PROFILE(T5)_SHAPE(OPENSTRAIGHT)_TOOTHCOUNT20_WIDTH1cm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("timingbelt")
  const { fn, ...props } = expected
  expect(timingBeltModelPropsSchema.parse(props)).toEqual(props)
  const d = getTimingBeltDimensions(props)
  expect(d.length).toBe(100)
  expect(d.toothTipWidth).toBeCloseTo(2.65 - 2.4 * Math.tan(Math.PI / 9), 12)
  expect(d.totalThickness).toBe(2.2)
  expect([d.toothRootZ, d.toothTipZ, d.backZ]).toEqual([-0.425, -1.625, 0.575])
  expect([d.firstToothCenterX, d.lastToothCenterX, d.endMargin]).toEqual([
    2.5, 97.5, 1.175,
  ])
  expect(() =>
    parseTimingBeltModelParams({ fn: "wrong", string: example }),
  ).toThrow()
})
