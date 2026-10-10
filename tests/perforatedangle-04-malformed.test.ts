import { expect, test } from "bun:test"
import { mp } from "../src"
import { source } from "./fixtures/perforatedangle"
test("perforatedangle 4: malformed and duplicate properties are rejected", () => {
  for (const suffix of ["", "unknown2mm", "w1mm", "width1mm", "constructor1"])
    expect(() => mp.string(source + "_" + suffix).json()).toThrow()
  expect(() => mp.string("perforatedangle").json()).toThrow()
})
