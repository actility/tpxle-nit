#!/bin/bash

CLIENT_ID=
CLIENT_SECRET=

curl -i -X POST \
-H "content-type: application/json" \
-H 'x-tts-domain: eu1.cloud.thethings.network' \
-H 'x-downlink-replace: https://eu1.cloud.thethings.network/api/v3/as/applications/abeeway-tpxle/webhooks/webhook-site/devices/smartbadge-3f5/down/replace' \
-H 'x-downlink-push: https://eu1.cloud.thethings.network/api/v3/as/applications/abeeway-tpxle/webhooks/webhook-site/devices/smartbadge-3f5/down/push' \
-H 'x-downlink-apikey: NNSXS.7DI3BJKOKZKAVR4WPRLWNAZB5R3M5IGUUBYF72I.T5EH35MYLSZJPEQ3H5LIZVTOLHR7UFAJWM3A2CMJLG6TW6OK33SQ' \
-H "x-client-id: ${CLIENT_ID}" \
-H "x-client-secret: ${CLIENT_SECRET}" \
-d "@uplink_data_sample_from_ttn.json" \
http://localhost:8081/uplink_from_ttn


