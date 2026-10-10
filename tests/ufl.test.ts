import { expect, test } from "bun:test"
import {
  getUflDimensions,
  modelDefinitionSchema,
  mp,
  uflModelPropsSchema,
} from "../src"

test("U.FL receptacle contract preserves pad tokens, units, outline and validation", () => {
  const expected = {
    fn: "ufl",
    groundPitch: 3,
    groundPadWidth: 2.2,
    groundPadHeight: 1.1,
    signalPadWidth: 1.5,
    signalPadHeight: 1.1,
    signalPadX: -1.25,
  } as const
  expect(mp.string("ufl").json()).toEqual(expected)
  expect(mp.string("ufl3").json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(mp.getModelNames()).toContain("ufl")
  expect(mp.string("UFL_P0.3cm_SIGNALX-0.125cm").json()).toEqual(expected)
  expect(
    mp.string("ufl_p3.2mm_pw2mm_signalw1.4mm_signalx-1.3mm").json(),
  ).toMatchObject({
    groundPitch: 3.2,
    groundPadWidth: 2,
    signalPadWidth: 1.4,
    signalPadX: -1.3,
  })
  expect(getUflDimensions()).toMatchObject({
    baseWidth: 2.6,
    baseLength: 2.6,
    baseHeight: 0.35,
    shellOuterDiameter: 2,
    height: 1.25,
    bottomZ: 0,
    topZ: 1.25,
    groundTerminalY: 1.35,
    signalTerminalX: -0.95,
  })
  expect(getUflDimensions().bodyCenterX).toBeCloseTo(0.45, 8)
  expect(
    getUflDimensions({
      groundPadWidth: 2,
      signalPadX: -1.3,
      signalPadWidth: 1.4,
    }).bodyCenterX,
  ).toBeCloseTo(0.5, 8)
  for (const source of [
    "ufl4",
    "ufl_p0mm",
    "ufl_p-3mm",
    "ufl_signalx0mm",
    "ufl_signalx1mm",
    "ufl_p3mm_p3mm",
    "ufl_",
    "ufl_unknown1mm",
    "ufl_pw2mmjunk",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, "1mmjunk"])
    expect(() => uflModelPropsSchema.parse({ groundPadWidth: value })).toThrow()
  expect(() => uflModelPropsSchema.parse({ unexpected: true })).toThrow()
})
