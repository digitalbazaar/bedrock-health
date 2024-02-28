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
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import '@bedrock/health';

const {config} = bedrock;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config.mocha.tests.push(path.join(__dirname, 'mocha'));

// allow self-signed certs in test framework
config['https-agent'].rejectUnauthorized = false;

bedrock.events.on('bedrock.ready', () => {
  // add readiness dependencies
  config.health.readiness.dependencies.ready1 = {
    type: 'httpGet',
    parameters: {
      url: 'https://localhost:18443/test/health/ready1'
    }
  };
  config.health.readiness.dependencies.ready2 = {
    type: 'httpGet',
    parameters: {
      url: 'https://localhost:18443/test/health/ready2'
    }
  };
  config.health.readiness.dependencies.textPlain = {
    type: 'httpGet',
    parameters: {
      url: 'https://localhost:18443/test/health/text-plain'
    }
  };
});
// variables used while testing readiness dependencies
config.health.test = {
  ready1: true,
  ready2: true,
  textPlain: true,
};
