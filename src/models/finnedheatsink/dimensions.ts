import {
  type FinnedHeatsinkModelPropsInput,
  finnedHeatsinkModelPropsSchema,
} from "./schema"

export function getFinnedHeatsinkDimensions(
  input: FinnedHeatsinkModelPropsInput = {},
) {
  const props = finnedHeatsinkModelPropsSchema.parse(input)
  const crossFinSpan = props.longitudinal ? props.width : props.length
  const finRunSpan = props.longitudinal ? props.length : props.width
  const finCenterSpan = (props.finCount - 1) * props.finPitch
  const outerFinSpan = finCenterSpan + props.finThickness
  const finCenters = Array.from(
    { length: props.finCount },
    (_, index) => -finCenterSpan / 2 + index * props.finPitch,
  )
  return {
    ...props,
    finHeight: props.height - props.baseThickness,
    channelWidth: props.finPitch - props.finThickness,
    finCenterSpan,
    outerFinSpan,
    sideMargin: (crossFinSpan - outerFinSpan) / 2,
    holeEndMargin: (finRunSpan - props.holePitch - props.holeDiameter) / 2,
    finCenters,
    size: [props.width, props.length, props.height] as [number, number, number],
    bottomZ: 0,
    finBaseZ: props.baseThickness,
    topZ: props.height,
  }
}
