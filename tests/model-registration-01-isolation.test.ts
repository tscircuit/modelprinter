import { test } from "bun:test"
import { assertRegistryIsolation } from "./fixtures/assert-model-registration"

test("model registration isolation", assertRegistryIsolation)
