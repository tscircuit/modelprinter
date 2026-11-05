import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  anglePlateModelPropsSchema,
  getAnglePlateDimensions,
} from "../src"
import { source, props } from "./fixtures/angleplate"

test("angleplate roadmap 0176 string, public schemas and hole layout agree", () => {
  const definition = { fn: "angleplate" as const, ...props }
  expect(mp.string(source).json()).toEqual(definition)
  expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  expect(anglePlateModelPropsSchema.parse(props)).toEqual(props)
  const dimensions = getAnglePlateDimensions(props)
  expect(dimensions.size).toEqual([100, 80, 100])
  expect(dimensions.baseHoleCenters).toEqual([
    [-35, 21, 6],
    [-35, 71, 6],
    [35, 21, 6],
    [35, 71, 6],
  ])
  expect(dimensions.faceHoleCenters).toEqual([
    [-30, 6, 50],
    [30, 6, 50],
  ])
  // A radius changes only the straight-base grid center; the face stays at facez.
  expect(
    getAnglePlateDimensions({ ...props, innerRadius: 2 }).baseHoleCenters[0],
  ).toEqual([-35, 22, 6])
})
