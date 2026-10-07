import { expect, test } from "bun:test"
import {
  mp,
  getLinearCarriageDimensions,
  getLinearCarriageMountingHoles,
} from "../src"
import { linearcarriageExample } from "./fixtures/linearcarriage-example"
test("generic carriage mates to an explicit rail profile and preserves the rail-bed datum", () => {
  const model = mp.string(linearcarriageExample).json()
  if (model.fn !== "linearcarriage") throw new Error("Wrong model")
  expect(mp.string("linearcarriage").json()).toEqual(model)
  expect(
    mp
      .string(
        linearcarriageExample
          .replace("railw12mm", "railw1.2cm")
          .replace("clearance0.15mm", "clearance0.015cm"),
      )
      .json(),
  ).toEqual(model)
  const { fn, ...props } = model
  const dims = getLinearCarriageDimensions(props)
  expect(dims.bottom).toBeCloseTo(2.15, 10)
  expect(dims.channelShoulder).toBeCloseTo(3.85, 10)
  expect(dims.channelTop).toBeCloseTo(8.15, 10)
  expect(dims.channelHeadWidth).toBeCloseTo(12.3, 10)
  expect(dims.channelNeckWidth).toBeCloseTo(8.3, 10)
  expect(getLinearCarriageMountingHoles(props).map((h) => h.center)).toEqual([
    { x: -10, y: -10, z: 13 },
    { x: -10, y: 10, z: 13 },
    { x: 10, y: -10, z: 13 },
    { x: 10, y: 10, z: 13 },
  ])
  for (const h of getLinearCarriageMountingHoles(props)) {
    expect(h.depth).toBe(4)
    expect(h.direction).toEqual({ x: 0, y: 0, z: -1 })
  }
})
