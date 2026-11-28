import { expect, test } from "bun:test"
import {
  getMultiChannelPanelDimensions,
  modelDefinitionSchema,
  multiChannelPanelModelPropsSchema,
  parseModelString,
} from "../src"

test("multichannelpanel resolves 200x100x8mm 10-channel twinwall sheet", () => {
  const parsed = parseModelString(
    "multichannelpanel_l200mm_w100mm_t8mm_skint1mm_webt1mm_pitch10mm_channels10",
  )
  expect(parsed).toEqual({
    fn: "multichannelpanel",
    length: 200,
    width: 100,
    thickness: 8,
    skinThickness: 1,
    webThickness: 1,
    pitch: 10,
    channels: 10,
  })
  expect(getMultiChannelPanelDimensions().cellHeight).toBe(6)
})

test("multichannelpanel supports 12-channel 120mm sheet and roundtrips", () => {
  const parsed = parseModelString("multichannelpanel_w120mm_channels12")
  expect(parsed.fn).toBe("multichannelpanel")
  if (parsed.fn !== "multichannelpanel") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(multiChannelPanelModelPropsSchema.parse({}).channels).toBe(10)
})

test("multichannelpanel rejects mismatched channel counts and parenthesized tokens", () => {
  expect(() => parseModelString("multichannelpanel_core(rect)")).toThrow()
  expect(() =>
    parseModelString("multichannelpanel_w100mm_pitch10mm_channels4"),
  ).toThrow()
})
