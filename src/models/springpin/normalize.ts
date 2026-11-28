import {
  type SpringPinSizeKey,
  springPinNominalLengths,
  springPinSpecs,
} from "./table"
import type { SpringPinRawProps } from "./validate"

const sizeKeys = Object.keys(springPinSpecs) as SpringPinSizeKey[]

export function normalizeSpringPinProps<T extends SpringPinRawProps>(props: T) {
  const matchedKey = sizeKeys.find(
    (key) =>
      Math.abs(springPinSpecs[key].holeDiameter - props.holeDiameter) <= 1e-9,
  )
  const spec = springPinSpecs[matchedKey ?? "3"]
  const canonicalLength =
    springPinNominalLengths.find(
      (nominal) => Math.abs(nominal - props.length) <= 1e-9,
    ) ?? props.length
  return {
    ...props,
    holeDiameter: spec.holeDiameter,
    length: canonicalLength,
  }
}
