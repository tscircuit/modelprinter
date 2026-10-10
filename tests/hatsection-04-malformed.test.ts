import { expect, test } from "bun:test"
import { mp } from "../src"
import { source } from "./fixtures/hatsection"
test("hatsection 4: malformed and duplicate properties are rejected", () => {
  for (const suffix of [
    "",
    "unknown2mm",
    "crownw1mm",
    "crownwidth1mm",
    "constructor1",
  ])
    expect(() => mp.string(source + "_" + suffix).json()).toThrow()
  expect(() => mp.string("hatsection").json()).toThrow()
})
