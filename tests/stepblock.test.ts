import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  stepBlockModelPropsSchema,
  getStepBlockDimensions,
} from "../src"
const source = "stepblock_l60mm_w30mm_h40mm_steps8_steprun7.5mm_steprise5mm"
const expected = {
  fn: "stepblock",
  length: 60,
  width: 30,
  height: 40,
  steps: 8,
  stepRun: 7.5,
  stepRise: 5,
} as const
test("stepblock contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(stepBlockModelPropsSchema.parse(props)).toEqual(props)
  expect(getStepBlockDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    stepBlockModelPropsSchema.parse({
      ...props,
      length: `${props.length / 10}cm`,
    }),
  ).toEqual(props)
})
test("stepblock rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "l1mm", "length1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("stepblock").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      stepBlockModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect(() =>
    stepBlockModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("stepblock rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [{ steps: 9 }, { stepRise: 6 }, { stepRun: 8 }])
    expect(() =>
      stepBlockModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
