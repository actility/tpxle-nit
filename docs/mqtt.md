# ThingPark X Loction Engine Network Interface Translator MQTT setup guide

## MQTT Settings:

- MQTT Broker Address:
  - Test Server: `nano-things.net`
  - Community platform: `mqtt.community.thingpark.io` ---- NOT IMPLEMENTED YET! ----
- MQTT Broker port:
  - `1883` (TCP, not recommended since it has no encryprion)
  - `8883` (SSL/TLS with Letsencrypt CA)
  - `8884` (SSL/TLS with [this self-signed CA](https://nano-things.net/ca.crt). In case the NS is not part of the PKI infrastructure, this port should be used.)
- CA Certificate:
  - CA certificate is only needed for port 8884.  
    The self-signed CA file is [this one](https://nano-things.net/ca.crt).
- MQTT User:
  - `<Your ThingPark UserId>`  
    Examples:
    - `community-api/somebody@example.com`
    - `somebody@example.com` (in case of the mobile app)
- MQTT passwd:

  - `<Your ThingPark Passwd>`

- MQTT Topics:
  - Uplink Topic:
    - `<subscriberId>`/NS/`<nsId>`/NIT/`<nitId>`/LE/`<leId>`/AS
  - Downlink Topic:
    - `<subscriberId>`/NIT/`<nitId>`/NS/`<nsId>`

## Explanation of parameters:

`<subscriberId>`

- The long subscriber id is shown at the top-right part of the [ADM UI](https://dev1.thingpark.com/thingpark/abeewayDeviceAnalyzer/index.php?dxprofile=community) (You have to log-in in order to see it). Here you need to use the short subscriber id that is the number without the leading 1000… prefix. (without the number ‘1’ and whatever number of zeros follow it.)
- In case you use the Abeeway Mobile App, please ask your norbert.herbert@actility.com for your subscriberId…
  We will generate a UI through which the subscriber Id can be queried.

`<nitId>`

- Possible values are: `nanothings`, `dev1`
  - for testing new early releases set: `nanothings`
  - with the community platform set: `dev1` ---- NOT IN OPERATION YET! ----

`<nsId>`:

- It can be one of the following labels:
  - `actility`
  - `chirpstack`
  - `everynet`
  - `helium`
  - `senet`
  - `ttn`

`<leId>`:

- Possible values are: `dev1`, `le-lab`
  - for the community/ecosystem TPXLE set: `dev1`
  - for R&D TPXLE set: `le-lab`

## TPXLE Settings

- Configure the [Binder Module](https://dx-api.thingpark.io/location/latest/swagger-ui/index.html?shortUrl=tpdx-location-api-contract.json#/BinderConfig/post_binderConfigs) with the following parameters:
  ```
  {
    "deviceEUIList": "*",
    "callbackURL": “https://nano-things.net/tpxle-nit/downlink_mqtt/<subscriberId>/<leId>/<nsId>”
  }
  ```
