import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pcbRailModelPropsSchema,
  getPcbRailDimensions,
} from "../src"
import { source, props } from "./fixtures/pcbrail-example"

test("pcbrail explicit attachment contract, units and public registry", () => {
  const expected = { fn: "pcbrail" as const, ...props }
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(pcbRailModelPropsSchema.parse(props)).toEqual(props)
  for (const [name, value] of Object.entries(props)) {
    const converted = pcbRailModelPropsSchema.parse({
      ...props,
      [name]: `${value / 10}cm`,
    })
    for (const [key, normalized] of Object.entries(converted))
      expect(normalized).toBeCloseTo(props[key as keyof typeof props], 10)
  }
  const dimensions = getPcbRailDimensions(props)
  expect(dimensions.bottomZ).toBe(0)
  expect(dimensions.topZ).toBeGreaterThan(0)
  for (let axis = 0; axis < 3; axis++)
    expect(dimensions.size[axis]).toBeCloseTo(
      dimensions.bounds[1][axis]! - dimensions.bounds[0][axis]!,
      10,
    )
})
