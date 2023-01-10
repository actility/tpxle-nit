# Senet

## 1. Connection with User Credentials

### 1.1. Uplink connection

**Target URL:**

```
  https://nano-things.net/tpxle-nit/uplink_from_senet/<YOUR_NIT_API_ID>
```

`<YOUR_NIT_API_ID>` is an arbitrary identifier of your company

**HTTP Headers:**

```
  x-client-id:       community-api/<YOUR_EMAIL_LIKE_USER_ID>
  x-client-secret:   <YOUR_PASSWORD>
  x-realm:           dev1
  x-downlink-api:    <DOWNLINK_API_URL>
  x-downlink-apikey: <DOWNLINK_API_KEY>
```

### 1.2. Downlink connection

**Downlink Target URL:**

```
  https://nano-things.net/tpxle-nit/downlink_to_senet/<YOUR_NIT_API_ID>
```

## 2. Connection with API Key

> This option is currently available only on our Preview environment!
> API keys will be supported in Q1 2023

### 2.1. Uplink connection

**Target URL:**

```
  https://nano-things.net/tpxle-nit/uplink_from_senet/<YOUR_NIT_API_ID>
```

`<YOUR_NIT_API_ID>` is an arbitrary identifier of your company

**HTTP Headers:**

```
  x-access-token:    <YOUR_API_KEY>
  x-realm:           dev1
  x-downlink-api:    <DOWNLINK_API_URL>
  x-downlink-apikey: <DOWNLINK_API_KEY>
```

`<YOUR_API_KEY>` is an API key that you can generate [here][1].

### 2.2. Downlink connection

**Downlink Target URL:**

```
  https://nano-things.net/tpxle-nit/downlink_to_senet/<YOUR_NIT_API_ID>
```

[1]: https://dx-api.thingpark.io/location-key-management/latest/swagger-ui/index.html?shortUrl=tpdx-location-key-management-api-contract.json
