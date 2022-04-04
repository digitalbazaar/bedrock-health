/*!
 * Copyright (c) 2020-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from '@bedrock/core';

const namespace = 'health';
const cfg = config[namespace] = {};

const basePath = '/health';
cfg.routes = {
  basePath
};

cfg.readiness = {};

/* example dependency:
cfg.readiness.dependencies.MyDependencyName = {
  type: 'httpGet',
  parameters: {
    url: 'https://exampe.com/health/ready',
    // default is 200
    expectedStatus: 200
  }
};
*/
cfg.readiness.dependencies = {};

