import { expect, test } from "bun:test"
import { mp } from "../src"

test("cornerfoot uses boolean flags and rejects enum-style selectors", () => {
  const base = "cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm"
  expect(mp.string(base + "_cornercup").json()).toEqual(mp.string(base).json())
  for (const selector of ["shape(cornercup)"])
    expect(() => mp.string(base + "_" + selector).json()).toThrow()
})
