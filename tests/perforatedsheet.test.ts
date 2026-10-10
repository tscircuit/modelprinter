import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  perforatedSheetModelPropsSchema,
  getPerforatedSheetDimensions,
} from "../src"
const source =
  "perforatedsheet_l60mm_w40mm_t1mm_hole3mm_pitchx10mm_pitchy10mm_edgex5mm_edgey5mm_stagger0mm"
const expected = {
  fn: "perforatedsheet",
  length: 60,
  width: 40,
  thickness: 1,
  holeDiameter: 3,
  pitchX: 10,
  pitchY: 10,
  edgeX: 5,
  edgeY: 5,
  stagger: 0,
} as const
test("perforatedsheet contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(perforatedSheetModelPropsSchema.parse(props)).toEqual(props)
  expect(getPerforatedSheetDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    perforatedSheetModelPropsSchema.parse({
      ...props,
      length: `${props.length / 10}cm`,
    }),
  ).toEqual(props)
})
test("perforatedsheet rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "l1mm", "length1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("perforatedsheet").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      perforatedSheetModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect(() =>
    perforatedSheetModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("perforatedsheet rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [
    { holeDiameter: 10 },
    { edgeX: 1 },
    { stagger: 10 },
    { pitchX: 0.001 },
  ])
    expect(() =>
      perforatedSheetModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
