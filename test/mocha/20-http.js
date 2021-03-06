/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const {httpsAgent} = require('bedrock-https-agent');
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
    result.dependencies.textPlain.result.should.equal(
      'This text/plain service is not healty.');
  });
});
