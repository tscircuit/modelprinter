import { expect, test } from "bun:test"
import {
  mp,
  parseModelStringParams,
  modelDefinitionSchema,
  ModelRegistry,
} from "../src"
import { registerAllModels } from "../src/generated/models"
import { modelStringFlagCases } from "./fixtures/model-string-flag-cases"

const registry = new ModelRegistry()
registerAllModels(registry)

for (const [base, flag, selector] of modelStringFlagCases) {
  test(`${base.split("_")[0]} ${flag} preserves the released JSON contract`, () => {
    const legacy = `${base}_${selector}`
    const source = `${base}_${flag}`
    const expected = mp.string(legacy).json()
    const builder = mp.string(source)
    expect(builder.json()).toEqual(expected)
    expect(registry.parse(parseModelStringParams(source))).toEqual(expected)
    expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
    expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
    const canonical = builder.params().string
    expect(mp.string(canonical).params().string).toBe(canonical)
    expect(mp.string(canonical).json()).toEqual(expected)
    expect(mp.string(legacy).params()).toEqual(parseModelStringParams(legacy))
    for (const invalid of [
      `${source}_${flag}`,
      `${source}_${selector}`,
      `${base}_${selector}_${flag}`,
      `${base}_${flag}(true)`,
      `${base}_${flag}1`,
    ])
      expect(() => mp.string(invalid).json()).toThrow()
  })
}

test("new flags remove redundant defaults while retaining dimensional and identifier tokens", () => {
  const source =
    "compressionspring_spec(custom)_od0.8cm_wire1mm_l20mm_turns8_ends(closedground)_lefthanded_state(free)"
  expect(mp.string(source).params().string).toBe(
    "compressionspring_od0.8cm_wire1mm_l20mm_turns8_closedground_lefthanded",
  )
  expect(
    mp.string("plainbushing_id8mm_od12mm_l20mm_plainclosed").params().string,
  ).toBe("plainbushing_id8mm_od12mm_l20mm")
  expect(
    mp
      .string(
        "hexbolt_standard(iso4017:2014)_m4_l20mm_hex_male_righthanded_fullthread",
      )
      .params().string,
  ).toBe("hexbolt_standard(iso4017:2014)_m4_l20mm_hex_fullthread")
})

test("mixed legacy selectors and flags reject hand conflicts and duplicate defaults", () => {
  for (const base of [
    "threadedrod_m6_l100mm",
    "shaftcollar_bore8mm_od16mm_w8mm_m4",
    "hexbolt_m4_l20mm",
  ]) {
    for (const suffix of [
      "lefthanded_righthanded",
      "lefthanded_threadhand(right)",
      "threadhand(left)_righthanded",
      "righthanded_threadhand(right)",
    ]) {
      expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
      expect(() =>
        registry.parse(parseModelStringParams(`${base}_${suffix}`)),
      ).toThrow()
    }
  }
  expect(() =>
    mp
      .string(
        "compressionspring_od8mm_wire1mm_l20mm_turns8_custom_spec(custom)",
      )
      .json(),
  ).toThrow()
  expect(() =>
    mp
      .string("plainbushing_id8mm_od12mm_l20mm_plainclosed_style(plainclosed)")
      .json(),
  ).toThrow()
})

test("flags remain model-local and preserve unsupported option validation", () => {
  for (const value of [
    "plainbushing_id8mm_od12mm_l20mm_setscrew",
    "shaftcollar_bore8mm_od16mm_w8mm_m4_singleclamp",
    "hexbolt_m4_l20mm_phillips",
    "buttonscrew_m4_l20mm_lefthanded",
    "hexnut_m6_lefthanded",
  ])
    expect(() => mp.string(value).json()).toThrow()
  // Legacy invalid strings retain deferred validation and untouched raw params.
  const invalidLegacy = "shaftcollar_bore8mm_od16mm_w8mm_m4_threadhand(opposed)"
  expect(mp.string(invalidLegacy).params()).toEqual(
    parseModelStringParams(invalidLegacy),
  )
  expect(() => mp.string(invalidLegacy).json()).toThrow()
})
