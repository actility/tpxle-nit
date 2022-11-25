# Loriot

### Option #1 - With User Credentials

**Target URL:**

```
  https://nano-things.net/tpxle-nit/uplink_from_loriot/<YOUR_NIT_API_ID>
```

`<YOUR_NIT_API_ID>` is an arbitrary identifier of your company

**HTTP Headers:**:

```
  Authorization: <clientId>|<clientSecret>|<realm>|<downlinkUrl>
```

`<clientId>` is the thingpark community username in the following format: 'community-api/`email-address`'
`<clientSecret>` is the thingpark community password
`<realm>` must be equal to 'dev1'
`<downlinkUrl>` the downlink API URL of the Loriot server instance

### Option #2 - With API Key

> This option is currently available only on our Preview environment!
> API keys will be supported in Q1 2023

**Target URL:**

```
  https://nano-things.net/tpxle-nit/uplink_from_loriot/<YOUR_NIT_API_ID>
```

`<YOUR_NIT_API_ID>` is an arbitrary identifier of your company

**HTTP Headers:**

```
  Authorization: |<YOUR_API_KEY>|<realm>|<downlinkUrl>
```

`<YOUR_API_KEY>` is an API key that you can generate [here][1].
`<realm>` must be equal to 'dev1'
`<downlinkUrl>` the downlink API URL of the Loriot server instance

[1]: https://dx-api.thingpark.io/location-key-management/latest/swagger-ui/index.html?shortUrl=tpdx-location-key-management-api-contract.json
