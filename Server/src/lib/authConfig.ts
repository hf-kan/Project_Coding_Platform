/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { LogLevel } from '@azure/msal-node';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    clientId: process.env.CLIENT_ID as string,
    // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    authority: process.env.CLOUD_INSTANCE as string + process.env.TENANT_ID as string,
    // Client secret generated from the app registration in Azure portal
    clientSecret: process.env.CLIENT_SECRET as string,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel:any, message:any, _containsPii:any) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 'Info' as unknown as LogLevel,
    },
  },
};

const { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI, GRAPH_API_ENDPOINT } = process.env;

const GRAPH_ME_ENDPOINT = `${GRAPH_API_ENDPOINT}v1.0/me`;

export {
  msalConfig,
  REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI,
  GRAPH_ME_ENDPOINT,
};
