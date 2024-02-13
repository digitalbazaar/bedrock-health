/*!
 * Copyright (c) 2020-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
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

