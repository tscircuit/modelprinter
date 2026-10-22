import { modelDrawingSchema, type ModelDrawing } from "../../model-drawing"
import {
  getRectangularTubeDimensions,
  type RectangularTubeModelPropsInput,
} from "./schema"

/** Parametric stock-tube references in model-local CAD mm, +Z up, centered on
 * XY with cut ends at Z=0 and Z=length. Overall spans use the nominal envelope;
 * for rounded profiles they are dimension datums, not topological edge claims.
 */
export function getRectangularTubeDrawing(
  input: RectangularTubeModelPropsInput,
): ModelDrawing {
  const { width, height, length, wallThickness } =
    getRectangularTubeDimensions(input)
  const left = -width / 2
  const right = width / 2
  const bottom = -height / 2
  const top = height / 2
  return modelDrawingSchema.parse({
    namedEdges: [
      {
        name: "overall_width",
        start: { x: left, y: top, z: 0 },
        end: { x: right, y: top, z: 0 },
      },
      {
        name: "overall_height",
        start: { x: left, y: bottom, z: 0 },
        end: { x: left, y: top, z: 0 },
      },
      {
        name: "overall_length",
        start: { x: right, y: bottom, z: 0 },
        end: { x: right, y: bottom, z: length },
      },
      {
        name: "wall_thickness",
        start: { x: 0, y: top - wallThickness, z: 0 },
        end: { x: 0, y: top, z: 0 },
      },
    ],
    views: [
      {
        name: "end",
        direction: "z+",
        dimensions: [
          { edgeRef: "overall_width", orientation: "horizontal", offset: 10 },
          { edgeRef: "overall_height", orientation: "vertical", offset: 10 },
          { edgeRef: "wall_thickness", orientation: "vertical", offset: -8 },
        ],
      },
      {
        name: "side",
        direction: "y-",
        dimensions: [
          { edgeRef: "overall_width", orientation: "horizontal", offset: -10 },
          { edgeRef: "overall_length", orientation: "vertical", offset: -10 },
        ],
      },
    ],
  })
}
