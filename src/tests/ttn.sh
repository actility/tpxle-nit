#!/bin/bash

DEV_EUI=20635f01E10003f5

curl -i -X POST \
-H 'content-type: application/json' \
-d '{
    "type": "downlink",
    "deveui": "'$DEV_EUI'",
    "port": "2",
    "payload": "020402"
}' \
https://nano-things.net/tpxle-nit/downlink_to_ttn
