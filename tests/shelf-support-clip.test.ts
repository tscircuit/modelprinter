import { expect, test } from "bun:test"
import {
  getShelfSupportClipDimensions,
  modelDefinitionSchema,
  parseModelString,
  shelfSupportClipModelPropsSchema,
} from "../src"

test("shelfsupportclip resolves 40x25mm 2-hook pilaster shelf clip", () => {
  const parsed = parseModelString(
    "shelfsupportclip_h40mm_w25mm_l30mm_t2mm_hooks2_pitch20mm_hookw6mm_hookh8mm_hookdepth5mm_throat2.5mm_ledgel20mm",
  )
  expect(parsed).toEqual({
    fn: "shelfsupportclip",
    height: 40,
    width: 25,
    length: 30,
    thickness: 2,
    hooks: 2,
    hookPitch: 20,
    hookWidth: 6,
    hookHeight: 8,
    hookDepth: 5,
    throat: 2.5,
    ledgeLength: 20,
  })
  expect(getShelfSupportClipDimensions().overallDepth).toBe(27)
})

test("shelfsupportclip supports 50mm heavy-duty clip and roundtrips", () => {
  const parsed = parseModelString("shelfsupportclip_h50mm_pitch25mm")
  expect(parsed.fn).toBe("shelfsupportclip")
  if (parsed.fn !== "shelfsupportclip") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(shelfSupportClipModelPropsSchema.parse({}).hooks).toBe(2)
})

test("shelfsupportclip rejects overflowing hook pitches and parenthesized tokens", () => {
  expect(() => parseModelString("shelfsupportclip_finish(zinc)")).toThrow()
  expect(() => parseModelString("shelfsupportclip_h40mm_pitch35mm")).toThrow()
})
