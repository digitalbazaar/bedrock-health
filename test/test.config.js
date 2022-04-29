/*!
 * Copyright (c) 2020-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from '@bedrock/core';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import '@bedrock/health';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config.mocha.tests.push(path.join(__dirname, 'mocha'));

// allow self-signed certs in test framework
config['https-agent'].rejectUnauthorized = false;

// add readiness dependencies
config.health.readiness.dependencies.ready1 = {
  type: 'httpGet',
  parameters: {
    url: 'https://example.localhost/test/health/ready1'
  }
};
config.health.readiness.dependencies.ready2 = {
  type: 'httpGet',
  parameters: {
    url: 'https://example.localhost/test/health/ready2'
  }
};
config.health.readiness.dependencies.textPlain = {
  type: 'httpGet',
  parameters: {
    url: 'https://example.localhost/test/health/text-plain'
  }
};
// variables used while testing readiness dependencies
config.health.test = {
  ready1: true,
  ready2: true,
  textPlain: true,
};
