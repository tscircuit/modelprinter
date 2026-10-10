import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  cableTieBaseModelPropsSchema,
  getCableTieBaseDimensions,
} from "../src"
import { source, props } from "./fixtures/cabletiebase-example"

test("cabletiebase explicit attachment contract, units and public registry", () => {
  const expected = { fn: "cabletiebase" as const, ...props }
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(cableTieBaseModelPropsSchema.parse(props)).toEqual(props)
  for (const [name, value] of Object.entries(props))
    expect(
      cableTieBaseModelPropsSchema.parse({
        ...props,
        [name]: `${value / 10}cm`,
      }),
    ).toEqual(props)
  const dimensions = getCableTieBaseDimensions(props)
  expect(dimensions.bottomZ).toBe(0)
  expect(dimensions.topZ).toBeGreaterThan(0)
  for (let axis = 0; axis < 3; axis++)
    expect(dimensions.size[axis]).toBeCloseTo(
      dimensions.bounds[1][axis]! - dimensions.bounds[0][axis]!,
      10,
    )
})
