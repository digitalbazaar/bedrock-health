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
