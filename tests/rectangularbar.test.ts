import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  rectangularBarModelPropsSchema,
  getRectangularBarDimensions,
} from "../src"
const source = "rectangularbar_w20mm_h12mm_l60mm_cornerr1mm"
const expected = {
  fn: "rectangularbar",
  width: 20,
  height: 12,
  length: 60,
  cornerRadius: 1,
} as const
test("rectangularbar contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(rectangularBarModelPropsSchema.parse(props)).toEqual(props)
  expect(getRectangularBarDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    rectangularBarModelPropsSchema.parse({
      ...props,
      width: `${props.width / 10}cm`,
    }),
  ).toEqual(props)
})
test("rectangularbar rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "w1mm", "width1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("rectangularbar").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      rectangularBarModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    rectangularBarModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("rectangularbar rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [{ cornerRadius: 6 }])
    expect(() =>
      rectangularBarModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
