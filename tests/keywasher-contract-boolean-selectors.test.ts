import { expect, test } from "bun:test"
import { mp } from "../src"

test("keywasher uses boolean flags and rejects enum-style selectors", () => {
  const base = "keywasher_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1"
  expect(mp.string(base + "_custom_inward").json()).toEqual(
    mp.string(base).json(),
  )
  for (const selector of ["spec(custom)", "tab(inward)"])
    expect(() => mp.string(base + "_" + selector).json()).toThrow()
})
