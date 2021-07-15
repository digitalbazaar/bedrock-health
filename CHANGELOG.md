# bedrock-health ChangeLog

## 1.1.0 - TBD

### Added
- Do not listen for HTTP/HTTPS requests until readiness checks have passed. This
  is compatible with deployment platforms that lack explicit health and
  readiness checks, but instead expect that the application is ready when it
  responds to requests sent to the HTTP/HTTPS server's TCP port.
  - Add handler for the `bedrock-server.readiness-check` event.

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
