import { z } from "zod"

const modelDrawingPointSchema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
  })
  .strict()

/** Authored reference segment in model-local right-handed CAD coordinates,
 * millimeters, +Z up. Endpoints are points and pick up placement translation.
 * A segment may be a nominal-envelope datum, not a final mesh or B-rep edge.
 */
export const modelNamedEdgeSchema = z
  .object({
    name: z.string().trim().min(1),
    start: modelDrawingPointSchema,
    end: modelDrawingPointSchema,
  })
  .strict()
  .refine(
    ({ start, end }) =>
      start.x !== end.x || start.y !== end.y || start.z !== end.z,
    { message: "Named edges must have distinct endpoints", path: ["end"] },
  )
export type ModelNamedEdge = z.output<typeof modelNamedEdgeSchema>

/** Dimension intent. offset is a signed distance in paper mm after projection;
 * measured values come from the reference segment, never from this offset.
 */
export const modelDrawingDimensionSchema = z
  .object({
    edgeRef: z.string().trim().min(1),
    orientation: z
      .enum(["horizontal", "vertical", "aligned"])
      .default("aligned"),
    offset: z.number().finite().default(8),
    precision: z.number().int().min(0).max(6).default(1),
  })
  .strict()
export type ModelDrawingDimension = z.output<typeof modelDrawingDimensionSchema>

export const modelDrawingViewSchema = z
  .object({
    name: z.string().trim().min(1),
    direction: z.enum(["x+", "x-", "y+", "y-", "z+", "z-", "isometric"]),
    dimensions: z.array(modelDrawingDimensionSchema),
  })
  .strict()
export type ModelDrawingView = z.output<typeof modelDrawingViewSchema>

/** Semantic drawing metadata; geometry generation and paper rendering are
 * downstream responsibilities. Reference names remain stable as parameters vary.
 */
export const modelDrawingSchema = z
  .object({
    namedEdges: z.array(modelNamedEdgeSchema).min(1),
    views: z.array(modelDrawingViewSchema).min(1),
  })
  .strict()
  .superRefine((drawing, context) => {
    const edgeNames = new Set<string>()
    for (const [index, edge] of drawing.namedEdges.entries()) {
      if (edgeNames.has(edge.name))
        context.addIssue({
          code: "custom",
          path: ["namedEdges", index, "name"],
          message: `Named edge "${edge.name}" is duplicated`,
        })
      edgeNames.add(edge.name)
    }
    const viewNames = new Set<string>()
    for (const [viewIndex, view] of drawing.views.entries()) {
      if (viewNames.has(view.name))
        context.addIssue({
          code: "custom",
          path: ["views", viewIndex, "name"],
          message: `Drawing view "${view.name}" is duplicated`,
        })
      viewNames.add(view.name)
      for (const [dimensionIndex, dimension] of view.dimensions.entries())
        if (!edgeNames.has(dimension.edgeRef))
          context.addIssue({
            code: "custom",
            path: ["views", viewIndex, "dimensions", dimensionIndex, "edgeRef"],
            message: `Dimension references unknown edge "${dimension.edgeRef}"`,
          })
    }
  })
export type ModelDrawing = z.output<typeof modelDrawingSchema>
