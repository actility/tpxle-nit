
import { stringify } from 'querystring';
import fetch from 'node-fetch';

import cfg from '../config.js'; 
import logger from '../logger.js';

export const send_to_tpxle_async = async (translatedBody, clientID, clientSecret) => {

    const devEUI = translatedBody.deviceEUI;

    /*** Send accessToken request to DX-API ***/
    let dxapiTokenResponse;
    try{
        dxapiTokenResponse = await fetch(
            cfg.DXAPI_TOKEN_REQUEST_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                body: stringify({
                    grant_type: 'client_credentials',
                    client_id: clientID,
                    client_secret: clientSecret
                })
            }
        );
    } catch(err) { 
        logger.error(err.stack);
        return;
    };
    logger.debug(`UL: DevEUI: ${devEUI}: Token requested from DX-API. Response status: ${dxapiTokenResponse.status} ${dxapiTokenResponse.statusText}`);

    let accessTokenParsed;
    try {
        accessTokenParsed = await dxapiTokenResponse.json();
    } catch(err) { 
        logger.error(err.stack); 
        return;
    };
    logger.debug(`UL: DevEUI: ${devEUI}: Access Token received from DX-API`);

    /*** Send traslatedBody to TPX LE ***/
    let tpxleResponse;
    try {
        tpxleResponse = await fetch(
            cfg.TPXLE_FEED_URL,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessTokenParsed.access_token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(translatedBody)
            }
        );
    } catch(err) { 
        logger.error(err.stack);
        return; 
    };
    logger.debug(`UL: DevEUI: ${devEUI}: Message forwarded to TPXLE. Response Status: ${tpxleResponse.status} ${tpxleResponse.statusText}`);

    let tpxleResponseText;
    try {
        tpxleResponseText = await tpxleResponse.text();
    } catch(err) { 
        logger.error(err.stack);
        return;
    };
    if (tpxleResponseText) {
        logger.debug(tpxleResponseText);
    }

}

export default send_to_tpxle_async;
