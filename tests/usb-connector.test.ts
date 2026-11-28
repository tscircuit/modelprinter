import { expect, test } from "bun:test"
import {
  getUsbConnectorDimensions,
  modelDefinitionSchema,
  parseModelString,
  usbConnectorModelPropsSchema,
} from "../src"

test("usbconnector resolves TE 292304-1 USB 2.0 Type-B receptacle envelope and tabs", () => {
  const parsed = parseModelString(
    "usbconnector_te292304-1_usb2typeb_w12.04mm_h11.5mm_l15.71mm_throughhole_horizontal_contacts4_shield_mountp12.04mm_mountdia2.3mm_tail3.01mm",
  )
  expect(parsed).toEqual({
    fn: "usbconnector",
    te292304_1: true,
    usb2TypeB: true,
    width: 12.04,
    height: 11.5,
    length: 15.71,
    throughHole: true,
    horizontal: true,
    contacts: 4,
    shield: true,
    mountPitch: 12.04,
    mountHoleDiameter: 2.3,
    tailLength: 3.01,
  })

  const dims = getUsbConnectorDimensions()
  expect(dims.mountTabLeftX).toBeCloseTo(-6.02)
  expect(dims.mountTabRightX).toBeCloseTo(6.02)
  expect(dims.bottomZ).toBeCloseTo(-3.01)
  expect(dims.topZ).toBeCloseTo(11.5)
})

test("usbconnector supports unshielded flag, unit conversions and schema roundtrip", () => {
  const parsed = parseModelString("usbconnector_unshielded_tail3mm")
  expect(parsed.fn).toBe("usbconnector")
  if (parsed.fn !== "usbconnector") return
  expect(parsed.shield).toBe(false)
  expect(parsed.tailLength).toBe(3)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(usbConnectorModelPropsSchema.parse({}).contacts).toBe(4)
})

test("usbconnector rejects legacy selectors, invalid contacts and detached mount tabs", () => {
  expect(() =>
    parseModelString(
      "usbconnector_part(TE292304-1)_interface(USB2TypeB)_mount(throughhole)",
    ),
  ).toThrow()
  expect(() => parseModelString("usbconnector_contacts9")).toThrow()
  expect(() =>
    parseModelString("usbconnector_w12mm_mountp20mm_mountdia2.3mm"),
  ).toThrow()
})
