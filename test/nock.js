/*
 * Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const nock = require('nock');

nock('https://example.localhost')
  .get('/test/health/ready1')
  .reply(function() {
    if(config.health.test.ready1) {
      return [200, {ready: true, dependencies: {}}];
    } else {
      return [503, {ready: false, dependencies: {}}];
    }
  })
  .persist();

nock('https://example.localhost')
  .get('/test/health/ready2')
  .reply(function() {
    if(config.health.test.ready2) {
      return [200, {ready: true, dependencies: {}}];
    } else {
      return [503, {ready: false, dependencies: {}}];
    }
  })
  .persist();

nock('https://example.localhost')
  .get('/test/health/text-plain')
  .reply(function() {
    if(config.health.test.textPlain) {
      return [200, 'OK'];
    } else {
      return [503, 'This text/plain service is not healty.'];
    }
  })
  .persist();
