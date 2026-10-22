import { expect, test } from "bun:test"
import {
  getRectangularTubeDrawing,
  modelDrawingSchema,
  modelNamedEdgeSchema,
} from "../src"

test("drawing refs resolve declared edges while view presets need no invented edge", () => {
  const drawing = getRectangularTubeDrawing({
    width: 40,
    height: 20,
    wallThickness: 3,
    length: 80,
  })
  const edge = drawing.namedEdges[0]!
  for (const patch of [
    { name: " " },
    { name: ".outer_top" },
    { start: { x: Infinity, y: 10, z: 0 } },
    { end: edge.start },
    { extra: "unsupported" },
  ])
    expect(modelNamedEdgeSchema.safeParse({ ...edge, ...patch }).success).toBe(
      false,
    )
  for (const patch of [
    { namedEdges: [...drawing.namedEdges, edge] },
    { views: [...drawing.views, drawing.views[0]] },
    { views: [] },
    { views: [{ name: "end", direction: "front", dimensions: [] }] },
    {
      views: [
        {
          name: "end",
          direction: "z+",
          dimensions: [{ edgeRef: ".outer_top", precision: 7 }],
        },
      ],
    },
    {
      views: [
        {
          name: "end",
          direction: "z+",
          dimensions: [{ edgeRef: ".outer_top", offset: NaN }],
        },
      ],
    },
  ])
    expect(modelDrawingSchema.safeParse({ ...drawing, ...patch }).success).toBe(
      false,
    )
  // Models may provide inferred dimensions before they define named edges.
  expect(
    modelDrawingSchema.parse({ ...drawing, namedEdges: [] }).namedEdges,
  ).toEqual([])
  for (const dimension of [
    {},
    { edgeRef: "outer_top" },
    { edgeRef: ".missing" },
    { edgeRef: ".overall_width" },
    { edgeRef: ".outer_top", widthOfView: true },
    { widthOfView: true, heightOfView: true },
    { widthOfView: false },
    { widthOfView: true, orientation: "vertical" },
    { heightOfView: true, orientation: "aligned" },
  ])
    expect(
      modelDrawingSchema.safeParse({
        namedEdges: drawing.namedEdges,
        views: [{ name: "end", direction: "z+", dimensions: [dimension] }],
      }).success,
    ).toBe(false)
  const presets = modelDrawingSchema.parse({
    namedEdges: [],
    views: [
      {
        name: "end",
        direction: "z+",
        dimensions: [{ widthOfView: true }, { heightOfView: true }],
      },
    ],
  })
  expect(presets.views[0]!.dimensions).toEqual([
    { widthOfView: true, orientation: "horizontal", offset: 8, precision: 1 },
    { heightOfView: true, orientation: "vertical", offset: 8, precision: 1 },
  ])
  expect(modelDrawingSchema.parse(presets)).toEqual(presets)
  const defaulted = modelDrawingSchema.parse({
    namedEdges: [{ ...edge, name: " outer_top " }],
    views: [
      {
        name: " end ",
        direction: "z+",
        dimensions: [{ edgeRef: " .outer_top " }],
      },
    ],
  })
  expect(defaulted.namedEdges[0]!.name).toBe("outer_top")
  expect(defaulted.views[0]).toEqual({
    name: "end",
    direction: "z+",
    dimensions: [
      {
        edgeRef: ".outer_top",
        orientation: "aligned",
        offset: 8,
        precision: 1,
      },
    ],
  })
})
