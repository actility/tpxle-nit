mosquitto_pub \
 -h DESKTOP-JE5MKR1 \
 -p 8883 \
 -u community-api%2Fnorbert.herbert%2Bcmty%40actility.com \
 -P n0Rabab%401234 \
 -t 2167/uplink \
 --cafile /etc/mosquitto/certs/ca.crt \
 -m '{"result":42}'
