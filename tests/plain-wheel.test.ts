import { expect, test } from "bun:test"
import {
  getPlainWheelDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  plainWheelModelDefinitionSchema,
  plainWheelModelPropsSchema,
} from "../src"

test("plainwheel resolves solid disc, raised axial hub and axle bore defaults", () => {
  const parsed = mp
    .string(
      "plainwheel_od75mm_w25mm_bore10mm_hubod30mm_axlebore_hubw30mm_roundedge",
    )
    .json()
  if (parsed.fn !== "plainwheel") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "plainwheel",
    outerDiameter: 75,
    width: 25,
    boreDiameter: 10,
    hubDiameter: 30,
    axleBore: true,
    hubWidth: 30,
    roundEdge: true,
  })
  expect(mp.string("plainwheel").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(plainWheelModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("plainwheel")

  const dims = getPlainWheelDimensions()
  expect(dims.hubProjectionPerSide).toBe(2.5)
  expect(dims.hubWallThickness).toBe(10)
  expect(dims.webRadialSpan).toBe(22.5)
  expect(dims.treadEdgeRadius).toBe(2.5)
  expect(dims.rimBottomZ).toBe(2.5)
  expect(dims.rimTopZ).toBe(27.5)
  expect(dims.size).toEqual([75, 75, 30])
})

test("plainwheel normalizes units, aliases and schema roundtrips", () => {
  const custom = mp
    .string(
      "PLAINWHEEL_OUTERDIAMETER10CM_WIDTH3CM_BOREDIAMETER12MM_HUBDIAMETER4CM_AXLEBORE_HUBWIDTH3.6CM_ROUNDEDGE",
    )
    .json()
  if (custom.fn !== "plainwheel") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "plainwheel",
    outerDiameter: 100,
    width: 30,
    boreDiameter: 12,
    hubDiameter: 40,
    axleBore: true,
    hubWidth: 36,
    roundEdge: true,
  })
  const { fn, ...props } = custom
  expect(plainWheelModelPropsSchema.parse(props)).toEqual(props)
})

test("plainwheel rejects legacy selectors, duplicates and invalid hub or bore dimensions", () => {
  for (const badStr of [
    "plainwheel75",
    "plainwheel_mount(axlebore)",
    "plainwheel_edge(round)",
    "plainwheel_axlebore_axlebore",
    "plainwheel_roundedge_roundedge",
    "plainwheel_od75mm_outerdiameter75mm",
    "plainwheel_bore30mm_hubod30mm",
    "plainwheel_hubod75mm_od75mm",
    "plainwheel_w30mm_hubw25mm",
    "plainwheel_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { boreDiameter: 30, hubDiameter: 30 },
    { hubDiameter: 75, outerDiameter: 75 },
    { width: 30, hubWidth: 25 },
    { axleBore: false },
    { roundEdge: false },
    { mount: "axlebore" },
  ]) {
    expect(plainWheelModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
