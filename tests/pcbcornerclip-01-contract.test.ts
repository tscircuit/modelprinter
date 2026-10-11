import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pcbCornerClipModelPropsSchema,
  getPcbCornerClipDimensions,
} from "../src"
import { source, props } from "./fixtures/pcbcornerclip-example"

test("pcbcornerclip explicit attachment contract, units and public registry", () => {
  const expected = { fn: "pcbcornerclip" as const, ...props }
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(pcbCornerClipModelPropsSchema.parse(props)).toEqual(props)
  for (const [name, value] of Object.entries(props))
    expect(
      pcbCornerClipModelPropsSchema.parse({
        ...props,
        [name]: `${value / 10}cm`,
      }),
    ).toEqual(props)
  const dimensions = getPcbCornerClipDimensions(props)
  expect(dimensions.bottomZ).toBe(0)
  expect(dimensions.topZ).toBeGreaterThan(0)
  for (let axis = 0; axis < 3; axis++)
    expect(dimensions.size[axis]).toBeCloseTo(
      dimensions.bounds[1][axis]! - dimensions.bounds[0][axis]!,
      10,
    )
})
