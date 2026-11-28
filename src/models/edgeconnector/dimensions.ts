import {
  type EdgeConnectorModelPropsInput,
  edgeConnectorModelPropsSchema,
} from "./schema"

export function getEdgeConnectorDimensions(
  input: EdgeConnectorModelPropsInput = {},
) {
  const p = edgeConnectorModelPropsSchema.parse(input)
  const positionsPerSide = p.contacts / 2
  const contactSpan = (positionsPerSide - 1) * p.pitch
  return {
    ...p,
    positionsPerSide,
    contactSpan,
    bottomZ: 0,
    topZ: p.height,
  }
}
