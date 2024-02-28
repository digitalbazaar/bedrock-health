/*!
 * Copyright 2020 - 2024 Digital Bazaar, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
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
