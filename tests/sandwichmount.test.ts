import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  sandwichMountModelPropsSchema,
  getSandwichMountDimensions,
} from "../src"
const source =
  "sandwichmount_w50mm_l50mm_h25mm_holepitch35mm_holed6mm_coreh19mm_platethickness3mm"
const expected = {
  fn: "sandwichmount",
  width: 50,
  length: 50,
  height: 25,
  holePitch: 35,
  holeDiameter: 6,
  coreHeight: 19,
  plateThickness: 3,
} as const
test("sandwichmount contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(sandwichMountModelPropsSchema.parse(props)).toEqual(props)
  expect(getSandwichMountDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    sandwichMountModelPropsSchema.parse({
      ...props,
      width: `${props.width / 10}cm`,
    }),
  ).toEqual(props)
})
test("sandwichmount rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "w1mm", "width1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("sandwichmount").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      sandwichMountModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    sandwichMountModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("sandwichmount rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [
    { height: 30 },
    { holePitch: 45 },
    { holeDiameter: 35 },
  ])
    expect(() =>
      sandwichMountModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
