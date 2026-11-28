import { hexSocketBoltDimensions } from "../../hex-socket-bolt-schema"
import type { BrushDcMotorRawProps } from "./validate"

export function normalizeBrushDcMotorProps<T extends BrushDcMotorRawProps>(
  props: T,
) {
  return {
    ...props,
    threadPitch: hexSocketBoltDimensions[props.metricSize].threadPitch,
  }
}
