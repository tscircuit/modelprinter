import { expect, test } from "bun:test"
import { mp, getLinearRailDimensions, getLinearRailMountingHoles } from "../src"
import { linearrailExample } from "./fixtures/linearrail-example"
test("generic rail string, unit normalization and mounting datums", () => {
  const model = mp.string(linearrailExample).json()
  if (model.fn !== "linearrail") throw new Error("Wrong model")
  expect(model.width).toBe(12)
  expect(model.neckWidth).toBe(8)
  expect(mp.string("linearrail").json()).toEqual(model)
  expect(
    mp
      .string(
        linearrailExample.replace("w12mm", "w1.2cm").replace("l100mm", "l0.1m"),
      )
      .json(),
  ).toEqual(model)
  const { fn, ...props } = model
  expect(getLinearRailDimensions(props)).toEqual({
    neckBottom: 2,
    headBottom: 4,
    lastHoleOffset: 87.5,
    lastEndMargin: 12.5,
    headHeight: 4,
  })
  expect(getLinearRailMountingHoles(props).map((h) => h.center)).toEqual(
    [12.5, 37.5, 62.5, 87.5].map((y) => ({ x: 0, y, z: 8 })),
  )
  for (const h of getLinearRailMountingHoles(props)) {
    expect(h.direction).toEqual({ x: 0, y: 0, z: -1 })
    expect(h.depth).toBe(8)
    expect(h.counterboreDepth).toBe(3)
  }
  expect(getLinearRailDimensions({ length: 110 }).lastEndMargin).toBe(22.5)
  expect(mp.string("linearrail_cbore0mm_cbored0mm").json().fn).toBe(
    "linearrail",
  )
})
