#!/bin/bash

mkdir -p "bots/$1"

cat <<EOF > "bots/$1/bot.json"
{
  "trigger": "!$1",
  "gifs": "$1.gif",
  "messages": "$2"
}
EOF

if [[ -n "$3" ]]; then
  cp $3 "bots/$1/$1.gif"
fi
