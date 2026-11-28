import {
  type CotterPinSizeKey,
  cotterPinNominalLengths,
  cotterPinSpecs,
} from "./table"
import type { CotterPinRawProps } from "./validate"

const sizeKeys = Object.keys(cotterPinSpecs) as CotterPinSizeKey[]

export function normalizeCotterPinProps<T extends CotterPinRawProps>(props: T) {
  const matchedKey = sizeKeys.find(
    (key) =>
      Math.abs(cotterPinSpecs[key].nominalSize - props.nominalSize) <= 1e-9,
  )
  const spec = cotterPinSpecs[matchedKey ?? "2"]
  const canonicalLength =
    cotterPinNominalLengths.find(
      (nominal) => Math.abs(nominal - props.length) <= 1e-9,
    ) ?? props.length
  return {
    ...props,
    nominalSize: spec.nominalSize,
    length: canonicalLength,
  }
}
