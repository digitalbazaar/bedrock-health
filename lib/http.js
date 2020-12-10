/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {asyncHandler} from 'bedrock-express';
import * as bedrock from 'bedrock';
import * as readiness from './readiness.js';
const {config} = bedrock;

bedrock.events.on('bedrock-express.configure.routes', app => {
  const {routes} = config.health;

  app.get(`${routes.basePath}/live`, asyncHandler(async (req, res) => {
    res.send('OK');
  }));

  app.get(`${routes.basePath}/ready`, asyncHandler(async (req, res) => {
    const result = await readiness.check();
    if(!result.ready) {
      res.status(503);
    }
    res.json(result);
  }));
});
