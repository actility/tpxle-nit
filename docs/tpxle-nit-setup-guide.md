# ThingPark X Loction Engine Network Interface Trnslator setup guide

The ThingPark X Loction Engine Network Interface Trnslator (TPXLE-NIT) can be used with Abeeway devices connected through Helium and TTN networks.
An instance of this interface translator is already hosted at Actility cloud and can be tested to connect Abeeway Devices to the [Abeeway Device Manager][3] application.
The following steps explain how to set up this connectivity.

## 1. Sing up for a new ThingPark Community account.

[Sing up][1]

![101-tpcp-signUp](images/101-tpcp-signUp.png)

## 2. Sign in with your new account to the ThingPark Community Console.
[ThingPark Community Console][2]

![102-tpcp-signIn](images/102-tpcp-signIn.png)

## 3. Create a fake application

Before adding your devices to the platform you need to create an Application. This application won't be used for anything. You need to create it because you cannot add devices to the ThingPark Community platform without an application.  

- Click on ***Applications>Create*** on the side bar menu and select ***https:// Generic Application***

  ![103-tpcp-createApp01](images/103-tpcp-createApp01.jpg)

- Fill in the form according to the following screenshot:

  ![104-tpcp-createApp02.png](images/104-tpcp-createApp02.png)

- Save the new application

## 4. Provision your Abeeway Trackers on the ThingPark Community Console.   
Since you are planning to use a 3rd party network server, you dont have to provision your devices with the correct AppSKey and AppEUI. We recommend you using "00000000000000000000000000000000" as ApppSKey and 0000000000000000 as JounEUI. The only important data you need to be accurate with is the DevEUI so that our platform can assign your device to your account.

- Click on ***Devices>Create*** on the side bar menu and select ***Abeeway***

  ![105-tpcp-createDevice01.png](images/105-tpcp-createDevice01.png)

- Fill in the form according to the following screenshots. (Please replace the DevEUI with your Device's real DevEUI.)

  ![106-tpcp-createDevice01.png](images/106-tpcp-createDevice02.png)

  ![107-tpcp-createDevice01.png](images/107-tpcp-createDevice03.png)

## 5. Create a new HTTP (webhook) integration on the Helium/TTN Console with the following parameters:
  - [Helium Console][4]: 
    - Url (for Helium): https://community.thingpark.io/tpxle-nit/uplink_from_helium
    - Header: "x-client-id: community-api/***<YOUR_THINGPARK_COMMUNITY_USER_ID>***"
    - Header: "x-client-secret: ***<YOUR_THINGPARK_COMMUNITY_PASSWORD>***"
  - [TTN Console][5]: 
    - Url (for TTN): https://community.thingpark.io/tpxle-nit/uplink_from_ttn
    - Header: "x-client-id: community-api/***<YOUR_THINGPARK_COMMUNITY_USER_ID>***"
    - Header: "x-client-secret: ***<YOUR_THINGPARK_COMMUNITY_PASSWORD>***"
 
## 6. Configure the ThingPark X Location Engine (TPX LE) Binder Module through the DX Location API so that tracker commands are forwarded to the right connector module:
  - Log in to [ThingPark DX API][6] with your ThingPark Community Credentials.

    ![201-dxapi-login.png](images/201-dxapi-login.png)

  - Click on ***DX Location API > Swagger UI***

    ![202-dxapi-loggedin.png](images/202-dxapi-loggedin.png)

  - Under the ***BinderConfig*** title click on *POST /binderConfigs*

    ![203-dxapi-locationAPI.png](images/203-dxapi-locationAPI.png)  

  - Click on the ***Try it out*** button.

    ![204-dxapi-binderConfigPost.png](images/204-dxapi-binderConfigPost.png)

  - Insert the following text into the textarea:
    - for Helium:
        ```
        {
          "deviceEUIList": "*",
          "callbackURL": "https://community.thingpark.io/tpxle-nit/downlink_to_helium"
        }
        ```
    - for TTN:
      ```
      {
        "deviceEUIList": "*",
        "callbackURL": "https://community.thingpark.io/tpxle-nit/downlink_to_ttn"
      }
      ```
      ![205-dxapi-binderConfigPostTryitout.png](images/205-dxapi-binderConfigPostTryitout.png)

  - Click on the ***Execute*** button under the text area.  

## 7. Test the uplink integration:
  - Wait until the tracker sends a few UL messages.
  - Verify on Helium/TTN Console that UL messages are forwarded to the integration you created earlier.
  - Login to [Abeeway Device Manager (ADM)][3] with your ThingPark Community Credentials.

    ![301-adm-login.png](images/301-adm-login.png) 

  - Select your devices.  
    If you cannot see any devices in the list after you logged, in then you trackers have not sent any messages to ADM yet. 

    ![302-adm-selectDevice.png](images/302-adm-selectDevice.png)

  - Find your trackers on the map.

    ![303-adm-map.png](images/303-adm-map.png)

## 8. Test the downlinlink integration:
  - Login to [Abeeway Device Manager (ADM)][3] with your ThingPark Community Credentials and select your devices.
  - Click on the ***Device Configuration*** tab at the top of the ADM GUI.
  - Click on the drop-dowm menu item at the bottom left of the page and select the ***Start SOS mode*** option.
  - Click on the ***Send Request*** button just at the right of the drop-down menu item.  
    This should generate a downlink command that will switch the tracker to SOS mode.
      
    ![304-adm-deviceConfiguration.png](images/304-adm-deviceConfiguration.png)


[1]: https://community.thingpark.org/
[2]: https://community.thingpark.io/
[3]: https://dev1.thingpark.com/thingpark/abeewayDeviceAnalyzer/index.php?dxprofile=community
[4]: https://console.helium.com/welcome
[5]: https://console.cloud.thethings.network/
[6]: https://dx-api.thingpark.io/getstarted/#/

