import { expect } from "bun:test"
import { mp } from "../../src"
import { flexScreenModelPropsSchema } from "../../src/flex-screen-schema"

export const assertFlexScreenPitch = () => {
  expect(
    flexScreenModelPropsSchema.parse({
      pinCount: 30,
      pitch: "0.5mm",
      padWidth: "0.3mm",
      padLength: "1.25mm",
      tailLength: "3mm",
      taperLength: "2mm",
    }),
  ).toEqual({
    pinCount: 30,
    pitch: 0.5,
    padWidth: 0.3,
    padLength: 1.25,
    tailLength: 3,
    taperLength: 2,
  })
  expect(() =>
    flexScreenModelPropsSchema.parse({
      flexCableLength: 10,
      tailLength: 8,
      taperLength: 3,
    }),
  ).toThrow("tailLength and taperLength")
  expect(
    mp.string("flexscreen30_w16_h10_flex5_p0.5mm_sitsflat").json(),
  ).toEqual({
    fn: "flexscreen",
    pinCount: 30,
    pitch: 0.5,
    width: 16,
    height: 10,
    flexCableLength: 5,
    orientation: "sitsFlat",
  })
  expect(mp.string("flexscreen_p0.02in_pincount30").json()).toMatchObject({
    pinCount: 30,
    pitch: 0.508,
  })
  expect(mp.string("flexscreen30_pitch0.5").json()).toEqual(
    mp.string("flexscreen_pincount30_p0.5").json(),
  )
  expect(
    mp.string("flexscreen_conductorcount30_conductorpitch0.5").json(),
  ).toEqual({ fn: "flexscreen", conductorCount: 30, conductorPitch: 0.5 })
  expect(
    mp.string("flexscreen30_p0.5mm_pw0.3mm_pl1.25mm_tail3mm_taper2mm").json(),
  ).toEqual({
    fn: "flexscreen",
    pinCount: 30,
    pitch: 0.5,
    padWidth: 0.3,
    padLength: 1.25,
    tailLength: 3,
    taperLength: 2,
  })
  expect(
    mp
      .string(
        "flexscreen30_pitch0.5_padwidth0.3_padlength1.25_taillength3_taperlength2",
      )
      .json(),
  ).toEqual(mp.string("flexscreen30_p0.5_pw0.3_pl1.25_tail3_taper2").json())
  expect(mp.string("flexscreen_w16_h10_flex5_sitsflat").json()).toEqual({
    fn: "flexscreen",
    width: 16,
    height: 10,
    flexCableLength: 5,
    orientation: "sitsFlat",
  })
  for (const definition of [
    "flexscreen0_p0.5",
    "flexscreen2.5_p0.5",
    "flexscreen_pincount-1_p0.5",
    "flexscreen30_p0",
    "flexscreen30_p-0.5",
    "flexscreen30_p",
    "flexscreen30_pw0",
    "flexscreen30_pl-1",
    "flexscreen30_tail0",
    "flexscreen30_taper-2",
    "flexscreen30_flex10_tail10",
    "flexscreen30_flex10_tail8_taper3",
  ]) {
    expect(() => mp.string(definition).json()).toThrow()
  }
}
