import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  vBlockModelPropsSchema,
  getVBlockDimensions,
} from "../src"
const source =
  "vblock_l60mm_w40mm_h40mm_vangle90deg_vdepth10mm_mountgroovew3mm_mountgrooved3mm_mountz10mm"
const expected = {
  fn: "vblock",
  length: 60,
  width: 40,
  height: 40,
  grooveAngle: 90,
  grooveDepth: 10,
  mountGrooveWidth: 3,
  mountGrooveDepth: 3,
  mountGrooveZ: 10,
} as const
test("vblock contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(vBlockModelPropsSchema.parse(props)).toEqual(props)
  expect(getVBlockDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    vBlockModelPropsSchema.parse({
      ...props,
      length: `${props.length / 10}cm`,
    }),
  ).toEqual(props)
})
test("vblock rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "l1mm", "length1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("vblock").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      vBlockModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect(() =>
    vBlockModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("vblock rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [
    { grooveAngle: 180 },
    { grooveDepth: 20 },
    { mountGrooveDepth: 20 },
    { mountGrooveZ: 1 },
  ])
    expect(() =>
      vBlockModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
