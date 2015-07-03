#!/bin/bash

COMPILER=./compiler/compiler.jar

INPUT="$(find src -name '*.js')"
OUTPUT="bin/gl.js"

#ARGS="--manage_closure_dependencies"

mkdir -p bin
java -jar $COMPILER $ARGS $INPUT --debug --formatting=PRETTY_PRINT > $OUTPUT
