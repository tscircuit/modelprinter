import { expect, test } from "bun:test"
import {
  getRectangularTubeDrawing,
  modelDrawingSchema,
  modelNamedEdgeSchema,
} from "../src"

test("drawing metadata validates finite nonzero named segments and unambiguous dimension refs", () => {
  const drawing = getRectangularTubeDrawing({
    width: 40,
    height: 20,
    wallThickness: 3,
    length: 80,
  })
  const edge = drawing.namedEdges[0]!
  for (const patch of [
    { name: " " },
    { start: { x: Infinity, y: 10, z: 0 } },
    { end: edge.start },
    { extra: "unsupported" },
  ])
    expect(modelNamedEdgeSchema.safeParse({ ...edge, ...patch }).success).toBe(
      false,
    )
  for (const patch of [
    { namedEdges: [...drawing.namedEdges, edge] },
    { namedEdges: [] },
    { views: [...drawing.views, drawing.views[0]] },
    { views: [] },
    {
      views: [
        { name: "end", direction: "z+", dimensions: [{ edgeRef: "missing" }] },
      ],
    },
    { views: [{ name: "end", direction: "front", dimensions: [] }] },
    {
      views: [
        {
          name: "end",
          direction: "z+",
          dimensions: [{ edgeRef: edge.name, precision: 7 }],
        },
      ],
    },
    {
      views: [
        {
          name: "end",
          direction: "z+",
          dimensions: [{ edgeRef: edge.name, offset: NaN }],
        },
      ],
    },
  ])
    expect(modelDrawingSchema.safeParse({ ...drawing, ...patch }).success).toBe(
      false,
    )
  const defaulted = modelDrawingSchema.parse({
    namedEdges: [{ ...edge, name: " overall_width " }],
    views: [
      {
        name: " end ",
        direction: "z+",
        dimensions: [{ edgeRef: " overall_width " }],
      },
    ],
  })
  expect(defaulted.namedEdges[0]!.name).toBe("overall_width")
  expect(defaulted.views[0]).toEqual({
    name: "end",
    direction: "z+",
    dimensions: [
      {
        edgeRef: "overall_width",
        orientation: "aligned",
        offset: 8,
        precision: 1,
      },
    ],
  })
})
