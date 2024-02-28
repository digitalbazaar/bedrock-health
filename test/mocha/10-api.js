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
import {readiness} from '@bedrock/health';

describe('readiness', () => {
  it('should pass a readiness check', async function() {
    config.health.test.ready1 = true;
    config.health.test.ready2 = true;
    const result = await readiness.check();
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
    const result = await readiness.check();
    should.exist(result);
    should.exist(result.ready);
    should.exist(result.dependencies);
    result.dependencies.should.be.an('object');
    should.exist(result.dependencies.ready1);
    should.exist(result.dependencies.ready2);
    result.dependencies.ready1.should.be.an('object');
    result.dependencies.ready2.should.be.an('object');
    result.ready.should.equal(false);
    should.exist(result.dependencies.ready1.ready);
    should.exist(result.dependencies.ready2.ready);
    result.dependencies.ready1.ready.should.equal(true);
    result.dependencies.ready2.ready.should.equal(false);
  });
  it('should return error if readiness protocol is not supported',
    async function() {
      const dependency = {
        type: 123,
        parameters: {
          url: 'urn:zcap:xyz'
        }
      };

      const result = await readiness._validateHttpGet(
        {name: 'ready3', dependency});

      should.exist(result);
      result.valid.should.equal(false);
      const {error: err} = result;
      should.exist(err);
      err.name.should.equal('DataError');
      err.message.should.equal('Readiness dependency "ready3" is invalid.');
      err.details.httpStatusCode.should.equal(500);
      err.cause.message.should.equal('HTTP readiness protocol "urn:" not ' +
        'supported. Supported protocols are: https:, http:');
    });
  it('should throw error if readiness check type is already registered',
    async function() {
      let result;
      let err;
      try {
        result = await readiness.registerType(
          {type: 'httpGet', run: async () => {}, validate: async () => {}});
      } catch(e) {
        err = e;
      }
      should.not.exist(result);
      should.exist(err);
      err.message.should.equal(
        'Readiness check type "httpGet" is already registered.');
    });
});

describe('UnknownError', () => {
  after(() => {
    delete config.health.readiness.dependencies.testError;
  });
  it('should throw error if checks are misimplemented', async function() {
    config.health.readiness.dependencies.testError = {
      type: 'testUnknownError',
      parameters: {
        url: 'https://example.localhost/test/health/testError'
      }
    };
    const mockCheckHttpGet = async () => {
      throw new Error('misimplemented.');
    };
    readiness.registerType({
      type: 'testUnknownError',
      run: mockCheckHttpGet,
      validate: async () => {}
    });
    let result;
    let err;
    try {
      result = await readiness.check();
    } catch(e) {
      err = e;
    }
    should.not.exist(result);
    should.exist(err);
    err.name.should.equal('UnknownError');
    err.message.should.equal('Readiness check failed to run.');
    err.details.httpStatusCode.should.equal(500);
  });
});
