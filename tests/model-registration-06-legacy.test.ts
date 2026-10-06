import { test } from "bun:test"
import { assertLegacyModelOutputs } from "./fixtures/assert-model-registration"

test("model registration legacy", assertLegacyModelOutputs)
