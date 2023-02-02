# The Things Network

## 1. Connection with User Credentials

### 1.1. Uplink connection

_(To be configured on the LNS.)_

**Target URL:**

```
  https://nano-things.net/tpxle-nit/uplink_from_ttn/<YOUR_NIT_API_ID>
```

`<YOUR_NIT_API_ID>` is an arbitrary identifier of your company

**HTTP Headers:**

```
  x-client-id:       community-api/<YOUR_EMAIL_LIKE_USER_ID>
  x-client-secret:   <YOUR_PASSWORD>
  x-architecture-id: 'ECODX'
```

### 1.2. Downlink connection

_(To be configured on TPX Location Engine.)_

**Downlink Target URL:**

```
  https://nano-things.net/tpxle-nit/downlink_to_ttn/<YOUR_NIT_API_ID>
```

## 2. Connection with API Key

> This option is currently available only on our Preview environment!
> API keys will be supported in Q1 2023

### 2.1. Uplink connection

_(To be configured on the LNS.)_

**Target URL:**

```
  https://nano-things.net/tpxle-nit/uplink_from_ttn/<YOUR_NIT_API_ID>
```

`<YOUR_NIT_API_ID>` is an arbitrary identifier of your company

**HTTP Headers:**

```
  x-access-token:    <YOUR_API_KEY>
  x-architecture-id: 'ECODX'
```

`<YOUR_API_KEY>` is an API key that you can generate [here][1].

### 2.2. Downlink connection

_(To be configured on TPX Location Engine.)_

**Downlink Target URL:**

```
  https://nano-things.net/tpxle-nit/downlink_to_ttn/<YOUR_NIT_API_ID>
```

[1]: https://dx-api.thingpark.io/location-key-management/latest/swagger-ui/index.html?shortUrl=tpdx-location-key-management-api-contract.json
