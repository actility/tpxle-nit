## MQTT Broker:

- MQTT Broker Address:
  - nano-things.net
- MQTT Broker port:
  - 1883 (TCP, not recommended since it has no encryprion)
  - 8883 (SSL/TLS with Letsencrypt CA)
  - 8884 (SSL/TLS with [this self-signed CA](https://nano-things.net/ca.crt). In case the NS is not part of the PKI infrastructure, this should be used)
- CA Certificate:
  - CE certificate is only needed for port 8884.  
    The self-signed CA file is [this one](https://nano-things.net/ca.crt).
- MQTT User:
  - `<Your ThingPark UserId>`  
    Examples:
    - `community-api/somebody@example.com`
    - `somebody@example.com` (in case of the mobile app)
- MQTT passwd:
  - `<Your ThingPark Passwd>`

## MQTT Topics:

- Uplink Topic:
  - `<subscriberId>`/NS/`<nsId>`/NIT/`<nitId>`/LE/`<leId>`/AS
- Downlink Topic:
  - `<subscriberId>`/NIT/`<nitId>`/NS/`<nsId>`

## Explanation of params:

`<subscriberId>`

- The long subscriber id is shown in the top-right part of the ADM GUI. Here you need to use the short subscriber id that is without the leading 1000… prefix. (The number without the 1st ‘1’ and the following zeros.)
- In case you use the mobile app, please ask your norbert.herbert@actility.com for your subscriberId…
  We will generate a UI through which the subscriber Id can be queried.

`<nitId>`  
Possible values are: nanothings, dev1

- for internal or friendly user tests: `nanothings`
- for community users: `dev1` ---- NOT IN OPERATION YET! ----

`<nsId>`:  
It can be one of the following labels:

- `actility`
- `chirpstack`
- `everynet`
- `helium`
- `senet`
- `ttn`

`<leId>`:  
Possible values are: dev1, le-lab

- for the ecosystem TPXLE: `dev1`
- for R&D TPXLE: `le-lab`
