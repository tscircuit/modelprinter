import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  channelBarModelPropsSchema,
  getChannelBarDimensions,
} from "../src"
const source = "channelbar_w40mm_h20mm_web3mm_flange3mm_innerr3mm_tipr1mm_l60mm"
const expected = {
  fn: "channelbar",
  width: 40,
  height: 20,
  webThickness: 3,
  flangeThickness: 3,
  innerRadius: 3,
  tipRadius: 1,
  length: 60,
} as const
test("channelbar contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(channelBarModelPropsSchema.parse(props)).toEqual(props)
  expect(getChannelBarDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    channelBarModelPropsSchema.parse({
      ...props,
      width: `${props.width / 10}cm`,
    }),
  ).toEqual(props)
})
test("channelbar rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "w1mm", "width1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("channelbar").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      channelBarModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    channelBarModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("channelbar rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [
    { flangeThickness: 20 },
    { webThickness: 20 },
    { innerRadius: 17 },
    { tipRadius: 1.5 },
  ])
    expect(() =>
      channelBarModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
