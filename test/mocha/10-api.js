/*!
 * Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const {readiness} = require('bedrock-health');

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
});
