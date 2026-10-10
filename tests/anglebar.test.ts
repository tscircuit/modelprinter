import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  angleBarModelPropsSchema,
  getAngleBarDimensions,
} from "../src"
const source = "anglebar_w25mm_h25mm_t3mm_innerr3mm_tipr1mm_l60mm"
const expected = {
  fn: "anglebar",
  width: 25,
  height: 25,
  thickness: 3,
  innerRadius: 3,
  tipRadius: 1,
  length: 60,
} as const
test("anglebar contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(angleBarModelPropsSchema.parse(props)).toEqual(props)
  expect(getAngleBarDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    angleBarModelPropsSchema.parse({
      ...props,
      width: `${props.width / 10}cm`,
    }),
  ).toEqual(props)
})
test("anglebar rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "w1mm", "width1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("anglebar").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      angleBarModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    angleBarModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("anglebar rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [
    { thickness: 25 },
    { innerRadius: 22 },
    { tipRadius: 1.5 },
  ])
    expect(() =>
      angleBarModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
