mosquitto_sub \
 -h DESKTOP-JE5MKR1 \
 -p 8883 \
 -u demo \
 -P securedemo \
 -t /data/sensors \
 --cafile /etc/mosquitto/certs/ca.crt \
