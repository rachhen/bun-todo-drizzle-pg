#!/bin/sh -ex

# Run database migration
bun run migrate

# Starting server
bun run start