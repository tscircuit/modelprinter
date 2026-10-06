import { test } from "bun:test"
import { assertRegistryRegistrationErrors } from "./fixtures/assert-model-registration"

test("model registration errors", assertRegistryRegistrationErrors)
