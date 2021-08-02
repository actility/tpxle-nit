#!/bin/bash

ACCESS_TOKEN=
CLIENT_ID=
CLIENT_SECRET=

curl -i -X POST \
-H "x-access-token: ${ACCESS_TOKEN}" \
-H "content-type: application/json" \
-d "@uplink_data_sample_from_helium.json" \
http://localhost:8081/uplink_from_helium

curl -i -X POST \
-H "x-client-id: ${CLIENT_ID}" \
-H "x-client-secret: ${CLIENT_SECRET}" \
-H "content-type: application/json" \
-d "@uplink_data_sample_from_helium.json" \
http://localhost:8081/uplink_from_helium


