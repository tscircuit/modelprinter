import { hexSocketBoltDimensions } from "../../hex-socket-bolt-schema"
import type { BrushlessDcMotorRawProps } from "./validate"

export function normalizeBrushlessDcMotorProps<
  T extends BrushlessDcMotorRawProps,
>(props: T) {
  return {
    ...props,
    threadPitch: hexSocketBoltDimensions[props.metricSize].threadPitch,
  }
}
