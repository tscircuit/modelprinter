import { test } from "bun:test"
import { assertSheetMetal } from "./fixtures/assert-sheet-metal"
import { expectPngSnapshot } from "./fixtures/expect-png-snapshot"
import { renderSheetMetalSnapshot } from "./fixtures/render-sheet-metal-snapshot"

test("sheet metal plate - four views", async () => {
  assertSheetMetal()
  await expectPngSnapshot(await renderSheetMetalSnapshot(0), import.meta.path)
})
