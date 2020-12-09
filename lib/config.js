/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from 'bedrock';

const namespace = 'health';
const cfg = config[namespace] = {};

const basePath = '/health';
cfg.routes = {
  basePath
};

cfg.readiness = {};
cfg.readiness.dependencies = {};
/* example dependency:
cfg.readiness.dependencies.MyDependencyName = {
  name: 'MyDependencyName',
  type: 'HTTP',
  parameters: {
    url: 'https://exampe.com/health/ready',
    // default is `GET` for `HTTP`
    method: 'GET',
    // default is 200
    expectedStatus: 200
  }
};
*/
