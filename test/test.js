/*!
 * Copyright (c) 2020-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as bedrock from '@bedrock/core';
import '@bedrock/health';
import '@bedrock/https-agent';
import '@bedrock/server';
import '@bedrock/test';

import './http.js';

bedrock.start();
