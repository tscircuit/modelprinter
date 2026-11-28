import { expect, test } from "bun:test"
import {
  getLeadscrewSupportDimensions,
  leadscrewSupportModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("leadscrewsupport resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "leadscrewsupport_bore12mm_w60mm_h43mm_depth25mm_holepitch46mm_holed5mm_angularpair",
  )
  expect(parsed).toEqual({
    fn: "leadscrewsupport",
    boreDiameter: 12,
    width: 60,
    height: 43,
    depth: 25,
    holePitch: 46,
    holeDiameter: 5,
    angularPair: true,
  })
  expect(getLeadscrewSupportDimensions().sideWallMargin).toBeCloseTo(4.5, 6)
})

test("leadscrewsupport supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "leadscrewsupport_bore15mm_w70mm_h48mm_holepitch54mm",
  )
  expect(parsed.fn).toBe("leadscrewsupport")
  if (parsed.fn !== "leadscrewsupport") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(leadscrewSupportModelPropsSchema.parse({})).toBeDefined()
})

test("leadscrewsupport rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("leadscrewsupport_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("leadscrewsupport_w60mm_holepitch58mm_holed5mm"),
  ).toThrow()
})
