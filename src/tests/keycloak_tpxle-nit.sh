#!/bin/bash

KC_REALM=le-lab
KC_USERNAME=<Keycloak username>
KC_PASSWORD=<Keycloak password>
KC_CLIENT=tpx-le-nit
KC_URL="https://le-lab.preview.thingpark.com/auth"
GRANT_TYPE=password

# Request Tokens for credentials
KC_RESPONSE=$( \
  curl -k -v \
       -d "username=$KC_USERNAME" \
       -d "password=$KC_PASSWORD" \
       -d "grant_type=$GRANT_TYPE" \
       -d "client_id=$KC_CLIENT" \
       -d "scope=openid" \
       "$KC_URL/realms/$KC_REALM/protocol/openid-connect/token" \
   | jq .
)

KC_ACCESS_TOKEN=$(echo $KC_RESPONSE| jq -r .access_token)
KC_ID_TOKEN=$(echo $KC_RESPONSE| jq -r .id_token)
KC_REFRESH_TOKEN=$(echo $KC_RESPONSE| jq -r .refresh_token)
if [ $KC_ACCESS_TOKEN = "null" ]; then
	echo $KC_RESPONSE
else
	echo 'Access token:'
	echo $KC_ACCESS_TOKEN
	echo '-----------------------------'
	echo 'ID token:'
	echo $KC_ID_TOKEN
	echo '-----------------------------'
	echo 'Refresh token:'
	echo $KC_REFRESH_TOKEN
	echo '-----------------------------'
fi
