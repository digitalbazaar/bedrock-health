/*!
 * Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
 */
import {asyncHandler} from 'bedrock-express';
import * as bedrock from 'bedrock';
import * as readiness from './readiness.js';
const {config, util: {BedrockError}} = bedrock;

bedrock.events.on('bedrock-express.configure.routes', app => {
  const {routes} = config.health;

  app.get(`${routes.basePath}/live`, asyncHandler(async (req, res) => {
    res.send('OK');
  }));

  app.get(`${routes.basePath}/ready`, asyncHandler(async (req, res) => {
    const result = await readiness.check();
    if(!result.ready) {
      throw new BedrockError('Readiness check failed.', 'InvalidStateError', {
        public: true,
        httpStatusCode: 503,
        ...result
      });
    }
    res.json(result);
  }));
});
