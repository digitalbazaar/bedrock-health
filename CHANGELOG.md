# bedrock-health ChangeLog

## 4.0.0 - 2023-09-xx

### Changed
- **BREAKING**: Drop support for Node.js < 18.
- Use `@digitalbazaar/http-client@4`. This version requires Node.js 18+.

## 3.1.2 - 2022-12-02

### Fixed
- Adjust logging on readiness failure to include the error `message`.

## 3.1.1 - 2022-12-02

### Fixed
- Adjust logging on readiness failure to include the request `result`.

## 3.1.0 - 2022-12-02

### Added
- Add name of failing dependencies in not ready error logs.

## 3.0.0 - 2022-04-29

### Changed
- **BREAKING**: Update peer deps:
  - `@bedrock/core@6`
  - `@bedrock/express@8`
  - `@bedrock/https-agent@4`
  - `@bedrock/server@5`.

## 2.0.0 - 2022-04-04

### Changed
- **BREAKING**: Rename package to `@bedrock/health`.
- **BREAKING**: Convert to module (ESM).
- **BREAKING**: Remove default export.
- **BREAKING**: Require node 14.x.

## 1.3.0 - 2022-01-21

### Added
- Add additional tests and expose private test helper functions in API.
- Update Bedrock peer dependencies.

## 1.2.0 - 2021-07-23

### Added
- Update peer deps; use bedrock@4 and bedrock-express@4.

## 1.1.0 - 2021-07-15

### Added
- Do not listen for HTTP/HTTPS requests until readiness checks have passed. This
  is compatible with deployment platforms that lack explicit health and
  readiness checks, but instead expect that the application is ready when it
  responds to requests sent to the HTTP/HTTPS server's TCP port.
  - Add handler for the `bedrock-server.readinessCheck` event.

### Changed
- Use `nock` for mock HTTP endpoints.

## 1.0.2 - 2020-12-11

### Fixed
- Properly handle erroredSysCall.

## 1.0.1 - 2020-12-10

### Fixed
- Use http agent for http urls.

## 1.0.0 - 2020-12-10

- See git history for changes.
