# TPXLE Network Interface Translator for Helium and TTN

## Build and install the server

0. Make sure that beyond docker engine you have [docker-compose](https://docs.docker.com/compose/install/) available on your platform.
1. Clone this repo and enter to the folder of this project

   ```
   $ git clone https://github.com/actility/tpxle-nit
   $ cd tpxle-nit
   ```

2. For customised config set the environment variables in the `docker-compose.yml` file.

3. Build the docker images:

   Execute the following command from the project root where the docker-compose.yml file is located

   ```
   $ docker-compose build
   ```

4. Create containers without starting them:

   ```
   $ docker-compose up --no-start
   ```

5. Run containers in detached mode

   ```
   $ docker-compose up --detach
   ```

6. For a production platform I recommend to configure an nginx reverse proxy so that `http://localhost:<PORT_NUMBER>` is mapped to a public `https://<PUBLIC_DOMAIN_NAME>/<APP_NAME>` web page with proper certifications. For that the following text need to be added to the nginx server configuration:

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

- Connect to the `tpxle_nit_app` container via CLI:

  ```
  $ docker container exec -it tpxle_nit_app /bin/sh
  ```

- Check if the server is running:

  ```
  /opt/tpxle-nit/src # ps -ef
  ```

- If the server is not running start the app manually:

  ```
  /opt/tpxle-nit/src # npm start &
  ```

- You can check the logs with:

  ```
  /opt/tpxle-nit/src # tail -f ./log/current.log
  ```

- Leave the container:

  ```
  /opt/tpxle-nit/src # exit
  ```

## Use the server

1. Check if the server works here: http://localhost:8081/test

   - There is an online version of this Interface Translator at https://community.thingpark.io/tpxle-nit/

2. Set up your connectivity using TPXLE-NIT according to [TPXLE-NIT LNS Connectivity Setup Guide](LNS_Connectivity_Setup_Guide.md)
