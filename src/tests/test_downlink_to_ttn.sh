#!/bin/bash

DEV_EUI=

curl -i -X POST \
-H 'content-type: application/json' \
-d '{
    "type": "downlink",
    "deveui": "'$DEV_EUI'",
    "port": "2",
    "payload": "020402"
}' \
http://localhost:8081/downlink_to_ttn
