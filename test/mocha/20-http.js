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

import {config} from '@bedrock/core';
import {createRequire} from 'module';
import {httpsAgent} from '@bedrock/https-agent';
const require = createRequire(import.meta.url);
const {httpClient} = require('@digitalbazaar/http-client');

describe('HTTP', () => {
  it('should pass a liveness check', async function() {
    let response;
    let err;
    try {
      response = await httpClient.get(
        'https://localhost:18443/health/live', {agent: httpsAgent});
    } catch(e) {
      err = e;
    }
    assertNoError(err);
    should.exist(response);
    response.status.should.equal(200);
  });
  it('should pass a readiness check', async function() {
    config.health.test.ready1 = true;
    config.health.test.ready2 = true;
    config.health.test.textPlain = true;
    let response;
    let err;
    try {
      response = await httpClient.get(
        'https://localhost:18443/health/ready', {agent: httpsAgent});
    } catch(e) {
      err = e;
    }
    assertNoError(err);
    should.exist(response);
    response.status.should.equal(200);
    const result = response.data;
    should.exist(result);
    should.exist(result.ready);
    should.exist(result.dependencies);
    result.dependencies.should.be.an('object');
    should.exist(result.dependencies.ready1);
    should.exist(result.dependencies.ready2);
    result.dependencies.ready1.should.be.an('object');
    result.dependencies.ready2.should.be.an('object');
    result.ready.should.equal(true);
    should.exist(result.dependencies.ready1.ready);
    should.exist(result.dependencies.ready2.ready);
    result.dependencies.ready1.ready.should.equal(true);
    result.dependencies.ready2.ready.should.equal(true);
  });

  it('should fail a readiness check', async function() {
    config.health.test.ready1 = true;
    config.health.test.ready2 = false;
    config.health.test.textPlain = false;
    let response;
    let err;
    try {
      response = await httpClient.get(
        'https://localhost:18443/health/ready', {agent: httpsAgent});
    } catch(e) {
      err = e;
    }
    should.exist(err);
    should.not.exist(response);
    err.status.should.equal(503);
    should.exist(err.response);
    should.exist(err.data);
    const {data: {details: result}} = err;
    should.exist(result);
    should.exist(result.ready);
    should.exist(result.dependencies);
    result.dependencies.should.be.an('object');
    should.exist(result.dependencies.ready1);
    should.exist(result.dependencies.ready2);
    should.exist(result.dependencies.textPlain);
    result.dependencies.ready1.should.be.an('object');
    result.dependencies.ready2.should.be.an('object');
    result.dependencies.textPlain.should.be.an('object');
    result.ready.should.equal(false);
    should.exist(result.dependencies.ready1.ready);
    result.dependencies.ready1.ready.should.equal(true);
    result.dependencies.ready1.result.should.be.an('object');
    result.dependencies.ready1.result.should.have.keys(
      ['dependencies', 'ready']);
    should.exist(result.dependencies.ready2.ready);
    result.dependencies.ready2.ready.should.equal(false);
    result.dependencies.ready2.result.should.be.an('object');
    result.dependencies.ready2.result.should.have.keys(
      ['dependencies', 'ready']);
    result.dependencies.textPlain.ready.should.equal(false);
    result.dependencies.textPlain.result.should.equal('Service Unavailable');
  });
});
