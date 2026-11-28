import type { z } from "zod"
import {
  type SpringPinSizeKey,
  springPinNominalLengths,
  springPinSpecs,
} from "./table"

export interface SpringPinRawProps {
  iso8752: true
  holeDiameter: number
  length: number
  free: true
}

const sizeKeys = Object.keys(springPinSpecs) as SpringPinSizeKey[]

export function validateSpringPinProps(
  props: SpringPinRawProps,
  context: z.RefinementCtx,
) {
  const matchedKey = sizeKeys.find(
    (key) =>
      Math.abs(springPinSpecs[key].holeDiameter - props.holeDiameter) <= 1e-9,
  )
  if (!matchedKey) {
    context.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message:
        "Hole diameter must be a supported ISO 8752 nominal size (1.5 through 12 mm)",
    })
    return
  }
  const spec = springPinSpecs[matchedKey]
  if (
    !springPinNominalLengths.some(
      (nominal) => Math.abs(nominal - props.length) <= 1e-9,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Length must be a tabulated ISO 8752 nominal value from 4 through 100 mm",
    })
  }
  if (
    props.length <= 2 * spec.chamferLength ||
    props.length < 1.5 * spec.holeDiameter
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Pin length must exceed both end chamfers and be at least 1.5x hole diameter",
    })
  }
}
