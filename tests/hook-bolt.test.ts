import { expect, test } from "bun:test"
import {
  getHookBoltDimensions,
  hookBoltModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("hookbolt resolves M6 180-deg J-hook bolt", () => {
  const parsed = parseModelString(
    "hookbolt_custom_m6_straightl50mm_threadl25mm_hookid15mm_hookangle180deg_hookwire6mm_flattip",
  )
  expect(parsed).toEqual({
    fn: "hookbolt",
    custom: true,
    thread: "m6",
    straightLength: 50,
    threadLength: 25,
    hookInnerDiameter: 15,
    hookAngleDeg: 180,
    hookWireDiameter: 6,
    flatTip: true,
  })
  expect(getHookBoltDimensions().hookOuterSpan).toBe(27)
})

test("hookbolt supports M8 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "hookbolt_M8_straightl70mm_hookid20mm_hookwire8mm",
  )
  expect(parsed.fn).toBe("hookbolt")
  if (parsed.fn !== "hookbolt") return
  expect(parsed.thread).toBe("m8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(hookBoltModelPropsSchema.parse({}).flatTip).toBe(true)
})

test("hookbolt rejects legacy selectors and threadLength > straightLength", () => {
  expect(() =>
    parseModelString("hookbolt_hookangle(180deg)_tip(flat)"),
  ).toThrow()
  expect(() => parseModelString("hookbolt_straightl30mm_threadl40mm")).toThrow()
})
