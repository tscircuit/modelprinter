import { expect, test } from "bun:test"
import { mp, perforatedAngleModelPropsSchema } from "../src"
import { props, source } from "./fixtures/perforatedangle"
test("perforatedangle 7: counts require bounded unitless integers", () => {
  for (const value of [0, -1, 1.5, 257, Infinity])
    expect(() =>
      perforatedAngleModelPropsSchema.parse({ ...props, holeCount: value }),
    ).toThrow()
  expect(() => mp.string(source.replace("holes3", "holes3mm")).json()).toThrow()
})
