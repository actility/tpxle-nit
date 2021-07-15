# TPXLE Network Interface Translator for Helium and TTN

## Build and install the server
0. Make sure that beyond docker engine you have [docker-compose](https://docs.docker.com/compose/install/) available on your platform.
1. Clone this repo and enter to the folder of this project

    ```
    $ git clone https://github.com/actility/tpxle-nit
    $ cd tpxle-nit
    ```

2. For customised configuration edit the configuration files in the config folder (update the config.global.yml file)
3. Build the docker images:

    Execute the following command from the project root where the docker-compose.yml file is located
    ```
    $ docker-compose build
    ```

3. Create containers without starting them:

    ```
    $ docker-compose up --no-start
    ```

4. Run containers in detached mode

    ```
    $ docker-compose up --detach
    ```

5. For a production platform I recommend to configure an nginx reverse proxy so that `http://localhost:<PORT_NUMBER>` is mapped to a public `https://<PUBLIC_DOMAIN_NAME>/<APP_NAME>` web page with proper certifications. For that the following text need to be added to the nginx server configuration:

    ```
    location /<APP_NAME>/ {
        proxy_pass http://localhost:<PORT_NUMBER>/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    ```

## Maintain the server

- Stop containers  
    ```
    $ docker-compose stop
    ```

- Remove containers  
    ```
    $ docker-compose down
    ```

## Debugging the operation

- Connect to the fNS container via CLI:  
    ```
    $ ./attach.sh
    ```

- Check if the server is running:  
    ```
    # ps -ef
    ```

- If the server is not running start the app manually:  
    ```
    # npm start &
    ```

- Leave the container:  
    ```
    # exit
    ```

- You can check the logs with:  
    ```
    $ tail -f ./log/current.log
    ```
## Use the server

- Test if the server works
    ```
    curl localhost:8081/test
    ```

    1.	Check if the connector works here:
        https://localhost:8081/test
        There is an online version of this tool available at https://community.thingpark.io/tpxle-nit/
        If you install under your domain, please update the urls in the next steps.

    2.	Create a new integration on the Helium/TTN Console with the following parameters:
        Url for Helium: https://community.thingpark.io/tpxle-nit/uplink_from_helium
        Url for TTN: https://community.thingpark.io/tpxle-nit/uplink_from_ttn
        Header: "x-client-id: <YOUR_CLIENT_ID>"
        Header: "x-client-secret: <YOUR_CLIENT_SECRET>"

    (I suggest creating API-Only credentials to every Helium user.)

    3.	Configure the TPX-LE Binder Module through the DX-API so that tracker commands are forwarded to the following URL:
        URL for Helium: https://community.thingpark.io/tpxle-nit/downlink_to_helium
        URL for TTN: https://community.thingpark.io/tpxle-nit/downlink_to_ttn

    4.	Test the integration:
        Wait until the tracker sends a few UL messages
        Verify on Helium/TTN Console that UL messages are forwarded to the integration you created earlier
        Login to ADM and fin your trackers on the map. 
