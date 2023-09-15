/*!
 * Copyright (c) 2020-2023 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import {asyncHandler} from '@bedrock/express';

const {config} = bedrock;

bedrock.events.on('bedrock-express.configure.routes', app => {

  app.get('/test/health/ready1', asyncHandler(async (req, res) => {
    if(config.health.test.ready1) {
      res.json({ready: true, dependencies: {}});
      return;
    }
    res.status(503).json({ready: false, dependencies: {}});
  }));

  app.get('/test/health/ready2', asyncHandler(async (req, res) => {
    if(config.health.test.ready2) {
      res.json({ready: true, dependencies: {}});
      return;
    }
    res.status(503).json({ready: false, dependencies: {}});
  }));

  app.get('/test/health/text-plain', asyncHandler(async (req, res) => {
    if(config.health.test.textPlain) {
      res.send('OK');
      return;
    }
    res.sendStatus(503);
  }));
});
