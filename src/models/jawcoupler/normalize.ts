import { hexSocketBoltDimensions } from "../../hex-socket-bolt-schema"
import type { JawCouplerRawProps } from "./validate"

export function normalizeJawCouplerProps<T extends JawCouplerRawProps>(
  props: T,
) {
  return {
    ...props,
    boreBDiameter: props.boreBDiameter ?? props.boreDiameter,
    threadPitch: hexSocketBoltDimensions[props.metricSize].threadPitch,
  }
}
