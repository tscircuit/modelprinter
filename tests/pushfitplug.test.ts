import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pushFitPlugModelPropsSchema,
  getPushFitPlugDimensions,
} from "../src"
const source = "pushfitplug_tubeod6mm_l18mm_headod10mm_headt3mm"
const expected = {
  fn: "pushfitplug",
  tubeDiameter: 6,
  length: 18,
  headDiameter: 10,
  headThickness: 3,
} as const
test("pushfitplug contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(pushFitPlugModelPropsSchema.parse(props)).toEqual(props)
  expect(getPushFitPlugDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    pushFitPlugModelPropsSchema.parse({
      ...props,
      headDiameter: `${props.headDiameter / 10}cm`,
    }),
  ).toEqual(props)
})
test("pushfitplug rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "tubeod1mm",
    "tubediameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("pushfitplug").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      pushFitPlugModelPropsSchema.parse({ ...props, headDiameter: value }),
    ).toThrow()
  expect(() =>
    pushFitPlugModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("pushfitplug rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [{ headDiameter: 6 }, { headThickness: 18 }])
    expect(() =>
      pushFitPlugModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
