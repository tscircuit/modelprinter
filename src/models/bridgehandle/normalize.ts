import { bridgeHandleThreads } from "./table"
import type { BridgeHandleRawProps } from "./validate"

export function normalizeBridgeHandleProps<T extends BridgeHandleRawProps>(
  props: T,
) {
  return {
    ...props,
    threadPitch: bridgeHandleThreads[props.metricSize].threadPitch,
  }
}
