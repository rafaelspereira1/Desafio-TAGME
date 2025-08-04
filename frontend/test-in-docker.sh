#!/bin/bash
# Build the Docker image and run tests
set -e

docker build -t angular-test .
docker run --rm angular-test
