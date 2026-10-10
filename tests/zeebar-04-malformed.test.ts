import { expect, test } from "bun:test"
import { mp } from "../src"
import { source } from "./fixtures/zeebar"
test("zeebar 4: malformed and duplicate properties are rejected", () => {
  for (const suffix of ["", "unknown2mm", "h1mm", "height1mm", "constructor1"])
    expect(() => mp.string(source + "_" + suffix).json()).toThrow()
  expect(() => mp.string("zeebar").json()).toThrow()
})
