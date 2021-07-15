# TPXLE Network Interface Translator for Helium and TTN

## Build and install the server
0. Make sure that beyond docker engine you have [docker-compose](https://docs.docker.com/compose/install/) available on your platform.
1. Clone this repo and enter to the folder of this project
2. Edit the configuration files in the config folder (update the config.global.yml file)
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
    $ attach.sh
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
