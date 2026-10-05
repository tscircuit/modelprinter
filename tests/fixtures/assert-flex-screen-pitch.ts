import { expect } from "bun:test"
import { mp } from "../../src"

export const assertFlexScreenPitch = () => {
  expect(
    mp.string("flexscreen30_w16_h10_flex5_p0.5mm_sitsflat").json(),
  ).toEqual({
    fn: "flexscreen",
    conductorCount: 30,
    conductorPitch: 0.5,
    width: 16,
    height: 10,
    flexCableLength: 5,
    orientation: "sitsFlat",
  })
  expect(mp.string("flexscreen_p0.02in_pincount30").json()).toMatchObject({
    conductorCount: 30,
    conductorPitch: 0.508,
  })
  expect(mp.string("flexscreen30_pitch0.5").json()).toEqual(
    mp.string("flexscreen_conductors30_conductorpitch0.5").json(),
  )
  expect(mp.string("flexscreen_conductorcount30_p0.5").json()).toEqual(
    mp.string("flexscreen30_p0.5").json(),
  )
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
  ]) {
    expect(() => mp.string(definition).json()).toThrow()
  }
}
