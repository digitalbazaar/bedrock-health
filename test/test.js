/*
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const {asyncHandler} = require('bedrock-express');
require('bedrock-health');
require('bedrock-https-agent');
require('bedrock-server');
require('bedrock-test');
const {config} = bedrock;

// add test health endpoints
bedrock.events.on('bedrock-express.configure.routes', app => {
  app.get('/test/health/ready1', asyncHandler(async (req, res) => {
    if(config.health.test.ready1) {
      res.json({ready: true, dependencies: {}});
    } else {
      res.status(503).json({ready: false, dependencies: {}});
    }
  }));
  app.get('/test/health/ready2', asyncHandler(async (req, res) => {
    if(config.health.test.ready2) {
      res.json({ready: true, dependencies: {}});
    } else {
      res.status(503).json({ready: false, dependencies: {}});
    }
  }));
});

bedrock.start();
