/*
 * Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
require('bedrock-health');
require('bedrock-https-agent');
require('bedrock-server');
require('bedrock-test');

require('./nock');

bedrock.start();
