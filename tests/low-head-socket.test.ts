import { expect, test } from "bun:test"
import {
  getLowHeadSocketDimensions,
  lowHeadSocketModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("lowheadsocket resolves DIN 7984 M3x10 low-profile cap screw", () => {
  const parsed = parseModelString("lowheadsocket_din7984_m3_l10mm_hexsocket")
  expect(parsed).toEqual({
    fn: "lowheadsocket",
    din7984: true,
    thread: "m3",
    length: 10,
    hexSocket: true,
  })

  const dims = getLowHeadSocketDimensions({ thread: "m3", length: 10 })
  expect(dims.headDiameter).toBeCloseTo(5.5)
  expect(dims.headHeight).toBeCloseTo(2.0)
  expect(dims.socketAcrossFlats).toBeCloseTo(2.0)
  expect(dims.overallLength).toBeCloseTo(12.0)
})

test("lowheadsocket supports M6x2cm screw and schema roundtrip", () => {
  const parsed = parseModelString("lowheadsocket_M6_l2cm")
  expect(parsed.fn).toBe("lowheadsocket")
  if (parsed.fn !== "lowheadsocket") return
  expect(parsed.thread).toBe("m6")
  expect(parsed.length).toBeCloseTo(20)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    lowHeadSocketModelPropsSchema.parse({ thread: "m5", length: 16 }).din7984,
  ).toBe(true)
})

test("lowheadsocket rejects legacy selectors and unsupported metric sizes", () => {
  expect(() =>
    parseModelString(
      "lowheadsocket_standard(din7984)_m3_l10mm_drive(hexsocket)",
    ),
  ).toThrow()
  expect(() => parseModelString("lowheadsocket_m7_l10mm")).toThrow()
})
