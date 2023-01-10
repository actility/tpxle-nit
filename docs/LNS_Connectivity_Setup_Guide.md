# TPXLE-NIT LNS Connectivity Setup Guide

The ThingPark X Location Engine Network Interface Translator (NIT) can be used with the following LoRaWAN Network Servers:

- Actility
- Chirpstack
- Everynet
- Helium
- Loriot
- Proximus
- Senet
- TTN

In order to use NIT for connecting your LNS to TPX Location Engine you need to configure your LNS so that it forwards LoRaWAN uplink messages to a "_Target URL_" as HTTP POST requests extended by a set of "_HTTP Headers_".

In order to use NIT for connecting your Application Server (AS) to TPX Location Engine you need to configure your AS so that it sends LoRaWAN downlink messages to a "_Downlink Target URL_" as HTTP POST requests extended by a set of "_HTTP Headers_".

Click on the appropriate link below to see the relevant _Target URLs_ and _HTTP Headers_ for your connection:

- [Actility](Actility.md)
- [Chirpstack](Chirpstack.md)
- [Everynet](Everynet.md)
- [Helium](Helium.md)
- [Loriot](Loriot.md)
- [Proximus](Proximus.md)
- [Senet](Senet.md)
- [TTN](TTN.md)
