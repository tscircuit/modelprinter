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
 * Models explicitly define these analytic features; names are not inferred
 * measurements and never depend on mesh triangle or vertex indices.
 */
export const modelNamedEdgeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .regex(
        /^[A-Za-z_][A-Za-z0-9_-]*$/,
        "Named edge names must be identifiers usable in a scoped selector",
      ),
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

/** Dimension intent. offset is signed paper mm after projection, not a value.
 * Explicit edge selectors name a model-defined edge; booleans request inferred
 * width/height of the complete projected view instead of inventing an edge name.
 */
export const modelDrawingDimensionSchema = z
  .object({
    edgeRef: z
      .string()
      .trim()
      .regex(
        /^\.[A-Za-z_][A-Za-z0-9_-]*$/,
        "edgeRef must be a scoped named-edge selector such as .outer_top",
      )
      .optional(),
    widthOfView: z.literal(true).optional(),
    heightOfView: z.literal(true).optional(),
    orientation: z.enum(["horizontal", "vertical", "aligned"]).optional(),
    offset: z.number().finite().default(8),
    precision: z.number().int().min(0).max(6).default(1),
  })
  .strict()
  .superRefine((dimension, context) => {
    const choices = [
      dimension.edgeRef,
      dimension.widthOfView,
      dimension.heightOfView,
    ].filter((choice) => choice !== undefined).length
    if (choices !== 1)
      context.addIssue({
        code: "custom",
        message: "Specify exactly one of edgeRef, widthOfView or heightOfView",
      })
    const inferredOrientation = dimension.widthOfView
      ? "horizontal"
      : dimension.heightOfView
        ? "vertical"
        : undefined
    if (
      inferredOrientation &&
      dimension.orientation !== undefined &&
      dimension.orientation !== inferredOrientation
    )
      context.addIssue({
        code: "custom",
        path: ["orientation"],
        message: `This view dimension requires ${inferredOrientation} orientation`,
      })
  })
  .transform((dimension) => ({
    ...dimension,
    orientation: dimension.widthOfView
      ? ("horizontal" as const)
      : dimension.heightOfView
        ? ("vertical" as const)
        : (dimension.orientation ?? ("aligned" as const)),
  }))
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
    namedEdges: z.array(modelNamedEdgeSchema),
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
        if (dimension.edgeRef && !edgeNames.has(dimension.edgeRef.slice(1)))
          context.addIssue({
            code: "custom",
            path: ["views", viewIndex, "dimensions", dimensionIndex, "edgeRef"],
            message: `Dimension references unknown edge "${dimension.edgeRef}"`,
          })
    }
  })
export type ModelDrawing = z.output<typeof modelDrawingSchema>
