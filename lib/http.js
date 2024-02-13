/*!
 * Copyright (c) 2020-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as bedrock from '@bedrock/core';
import * as readiness from './readiness.js';
import {asyncHandler} from '@bedrock/express';
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
