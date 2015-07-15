#!/bin/bash

COMPILER=./compiler/compiler.jar

INPUT="$(find src -name '*.js')"
OUTPUT="bin/topos.js"
ERROR="bin/err.log"

ARGS="--debug"
ARGS="$ARGS --formatting=PRETTY_PRINT"

mkdir -p bin
java \
  -jar $COMPILER \
  $ARGS \
  $INPUT \
  > $OUTPUT \
  2> $ERROR

echo "Content-type: text/html"
echo ""

if [[ $(< bin/err.log wc -l) -ne "0" ]]; then
  echo "<html>"
  echo "<body>"
  echo "<pre>"
  echo "<h1>Error</h1>"
  cat bin/err.log
  echo "</pre>"
  echo "</body>"
  echo "</html>"
else
  cat index.html
fi

exit 0
