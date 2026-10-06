import { test } from "bun:test"
import { assertRegistryParserBoundary } from "./fixtures/assert-model-registration"

test("model registration boundary", assertRegistryParserBoundary)
