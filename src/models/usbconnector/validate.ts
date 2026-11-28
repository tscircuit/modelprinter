import type { z } from "zod"

export interface UsbConnectorShape {
  te292304_1: true
  usb2TypeB: true
  width: number
  height: number
  length: number
  throughHole: true
  horizontal: true
  contacts: 4
  shield: boolean
  mountPitch: number
  mountHoleDiameter: number
  tailLength: number
}

export function validateUsbConnectorProps(
  p: UsbConnectorShape,
  ctx: z.RefinementCtx,
): void {
  if (p.width < 8 || p.height < 7 || p.length < 10) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message:
        "USB Type-B receptacle envelope must enclose the standard D-shaped mating cavity",
    })
  }
  if (p.mountHoleDiameter >= p.mountPitch * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["mountHoleDiameter"],
      message:
        "Shield mounting tab holes must remain separated across mountPitch",
    })
  }
  if (p.mountPitch > p.width + p.mountHoleDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["mountPitch"],
      message:
        "Mounting tab pitch cannot exceed the connector shroud width plus tab margin",
    })
  }
}
