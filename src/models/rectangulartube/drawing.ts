import { modelDrawingSchema, type ModelDrawing } from "../../model-drawing"
import {
  getRectangularTubeDimensions,
  type RectangularTubeModelPropsInput,
} from "./schema"

/** Parametric stock-tube references in model-local CAD mm, +Z up, centered on
 * XY with cut ends at Z=0 and Z=length. Cross-section edges stop at the corner
 * tangencies; rounded profiles never expose an overall envelope span as an edge.
 * The longitudinal reference follows the outer-right lower tangent. Width/height
 * presets measure projected view bounds independently of these explicit features.
 */
export function getRectangularTubeDrawing(
  input: RectangularTubeModelPropsInput,
): ModelDrawing {
  const { width, height, length, outerRadius } =
    getRectangularTubeDimensions(input)
  const left = -width / 2
  const right = width / 2
  const bottom = -height / 2
  const top = height / 2
  return modelDrawingSchema.parse({
    namedEdges: [
      {
        name: "outer_top",
        start: { x: left + outerRadius, y: top, z: 0 },
        end: { x: right - outerRadius, y: top, z: 0 },
      },
      {
        name: "outer_left",
        start: { x: left, y: bottom + outerRadius, z: 0 },
        end: { x: left, y: top - outerRadius, z: 0 },
      },
      {
        name: "outer_right_longitudinal",
        start: { x: right, y: bottom + outerRadius, z: 0 },
        end: { x: right, y: bottom + outerRadius, z: length },
      },
    ],
    views: [
      {
        name: "end",
        direction: "z+",
        dimensions: [
          { widthOfView: true, offset: 10 },
          { heightOfView: true, offset: 10 },
        ],
      },
      {
        name: "side",
        direction: "y-",
        dimensions: [{ heightOfView: true, offset: -10 }],
      },
    ],
  })
}
