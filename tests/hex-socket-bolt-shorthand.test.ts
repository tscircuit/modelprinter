import { expect, test } from "bun:test"
import { mp, parseModelString, normalizeHexSocketBoltModelString } from "../src"

test("bolt shorthand resolves to the existing M3 x 10 socket-head geometry contract", () => {
  for (const source of ["m3bolt", "bolt_m3", "M3BOLT", "BOLT_M3", "bolt"]) {
    expect(mp.string(source).params().string).toBe("hexsocketbolt_m3_l10mm")
    expect(parseModelString(source)).toEqual(
      parseModelString("hexsocketbolt_m3_l10mm"),
    )
  }
})

test("bolt shorthand preserves metric sizes, explicit units and thread flags", () => {
  for (const [source, canonical] of [
    ["m4bolt_l12mm_nothreads", "hexsocketbolt_m4_l12mm_nothreads"],
    ["bolt_m2.5_length1cm", "hexsocketbolt_m2.5_l10mm"],
    ["bolt_m3_l0.5in_threads", "hexsocketbolt_m3_l12.7mm"],
  ] as const) {
    expect(mp.string(source!).params().string).toBe(canonical)
    expect(parseModelString(source!)).toEqual(parseModelString(canonical!))
    expect(normalizeHexSocketBoltModelString(canonical!)).toBe(canonical)
  }
  expect(mp.string("hexsocketbolt_m3_length1cm").params().string).toBe(
    "hexsocketbolt_m3_length1cm",
  )
})

test("bolt shorthand retains duplicate and malformed-token validation", () => {
  for (const source of [
    "m3bolt_m4",
    "m3bolt_m3",
    "bolt_m3_l10mm_length12mm",
    "m3bolt_threads_nothreads",
    "m99bolt",
    "m3bolt_l0mm",
    "m3bolt_l",
    "m3bolt_threadsfalse",
    "m3bolt_",
    "m3bolt_unknown",
  ])
    expect(() => parseModelString(source)).toThrow()
  for (const source of ["m3screw", "boltish_m3", "m3boltish"]) {
    expect(normalizeHexSocketBoltModelString(source)).toBe(source)
    expect(() => parseModelString(source)).toThrow()
  }
})
