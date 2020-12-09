/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import assert from 'assert-plus';
import * as bedrock from 'bedrock';
import {httpsAgent} from 'bedrock-https-agent';
import {httpClient} from '@digitalbazaar/http-client';
import {URL} from 'url';
const {config, util: {BedrockError}} = bedrock;

// load config defaults
import './config.js';

const REGISTERED_TYPES = new Map();
const SUPPORTED_HTTP_PROTOCOLS = ['https:', 'http:'];

bedrock.events.on('bedrock.start', async () => {
  // validate all readiness dependencies to prevent startup if they are
  // not properly configured
  const deps = config.health.readiness.dependencies;
  for(const name in deps) {
    const dependency = deps[name];
    const {type} = dependency;
    if(typeof type !== 'string') {
      throw new Error(`Readiness dependency "${name}" is missing its "type".`);
    }
    const registration = REGISTERED_TYPES.get(type);
    if(!registration) {
      throw new Error(`Readiness type "${type}" is not registered.`);
    }
    const result = await registration.validate({name, dependency});
    if(!result.valid) {
      throw result.error;
    }
  }
});

/**
 * Runs all configured readiness dependency checks.
 *
 * @returns {Promise} A promise that settles with
 *   `{ready: true/false, dependencies}`.
 */
exports.check = async function() {
  // get all dependencies to run
  const deps = config.health.readiness.dependencies;

  // start running readiness checks
  const promises = [];
  const results = {};
  for(const name in deps) {
    const dependency = deps[name];
    results[name] = {ready: false, result: null};
    const registration = REGISTERED_TYPES.get(dependency.type);
    promises.push(registration.run({dependency}));
  }

  // await all readiness checks and store the results
  let ready = true;
  try {
    const depResults = await Promise.all(promises);
    let i = 0;
    for(const name in results) {
      const result = depResults[i++];
      results[name] = result;
      ready = ready && result.ready;
    }
  } catch(e) {
    // this should only happen if checks are misimplemented, they should
    // not be throwing exceptions but returning `{ready, result}`
    throw new BedrockError(
      'Readiness check failed to run.',
      'UnknownError', {
        public: true,
        httpStatusCode: 500
      }, e);
  }

  // report readiness and dependency results
  return {ready, dependencies: results};
};

/**
 * Registers a readiness type by binding it to a function to use when
 * checking it.
 *
 * @param {object} options - Options to use.
 * @param {string} options.type - The type to register.
 * @param {Function} options.run - The function to run whenever a dependency
 *   with the given type is checked.
 * @param {Function} options.validate - The function to use to validate
 *   all configured dependencies of the given type.
 */
exports.registerType = function({type, run, validate} = {}) {
  assert.string(type, 'type');
  assert.func(run, 'run');
  assert.func(validate, 'validate');

  if(REGISTERED_TYPES.has(type)) {
    throw new Error(`Readiness check type "${type}" is already registered.`);
  }
  REGISTERED_TYPES.set(type, {run, validate});
};

// register default types
exports.registerType({type: 'HTTP', run: _checkHttp, validate: _validateHttp});

async function _checkHttp({dependency} = {}) {
  // Note: only `GET` is supported at this time
  const {parameters} = dependency;
  const {url, expectedStatus = 200} = parameters;
  let result = null;
  let status;
  try {
    const response = await httpClient.get(url, {agent: httpsAgent});
    result = response.data;
    status = response.status;
  } catch(e) {
    status = e.status;
    if(e.response && e.data) {
      result = e.data;
    }
  }
  const ready = status === expectedStatus;
  return {ready, result};
}

async function _validateHttp({name, dependency} = {}) {
  try {
    assert.object(dependency, 'dependency');
    const {parameters} = dependency;
    assert.object(parameters, 'parameters');
    const {url, method = 'GET', expectedStatus = 200} = parameters;
    assert.string(url, 'url');
    assert.string(method, 'method');
    assert.number(expectedStatus, 'expectedStatus');
    const {protocol} = new URL(url);
    if(!SUPPORTED_HTTP_PROTOCOLS.includes(protocol)) {
      throw new Error(
        `HTTP readiness protocol "${protocol}" not supported. Supported ` +
        `protocols are: ${SUPPORTED_HTTP_PROTOCOLS.join(', ')}`);
    }
    if(method.toLowerCase() !== 'get') {
      throw new Error(
        'HTTP readiness method not supported. Supported ' +
        'methods are: GET');
    }
  } catch(e) {
    const error = new BedrockError(
      `Readiness dependency "${name}" is invalid.`,
      'DataError', {
        public: true,
        httpStatusCode: 500
      }, e);
    return {valid: false, error};
  }
  return {valid: true, error: null};
}
