# Actual disposable-local waitlist integration

Candidate d356cc1a9a42f9c7a1e7732859d892949a6e265a was copied from committed application files into an isolated working directory without .env files. Its existing pinned node_modules were reused; this was not another clean npm install. The actual Next dev API ran with only a generated local anonymous key. No service-role key was passed to the application or HTTP test driver.

Existing migration SHA256 7a3e7820c5c72982d090589abb5afd252d68af6f8ab6e60256850d79fd48dbbb was applied byte-for-byte. Seed was disabled. The disposable stack used local Postgres15.8.1.069, PostgRESTv12.2.11 and Kong2.8.1 with local Auth. See containers-safe.json for exact actual runtime images and verified port bindings.

Seven observations passed: invalid input400; actual signup201; normalized duplicate409; independent SQL confirms exactly one normalized row and no invalid entries; anonymous read discloses none; anonymous patch/delete leave SQL-observed rows unchanged. verify-http.py contains the actual test, including independent local SQL inspection. Synthetic example.test data only.

Docker ignored the bridge default binding in an initial empty stack. That stack was stopped/deleted before application requests. A data-free probe verified explicit HostIp127.0.0.1 works. start-loopback.py applied explicit bindings only to exact project-labeled containers on the unique test network; actual ports were independently inspected before the real tests. An intermediate guard refusal was fixed to accommodate the CLI's unnamed short-lived schema initializer while retaining exact project/network requirements. No global Docker configuration changed. These setup failures are not failing product tests or fabricated TDD RED evidence.

All test-owned containers/volumes/network were removed, app processes stopped and ports released. Images remain cached; no global prune was used. Generated keys/raw startup output are deliberately excluded from this proof. No hosted database, production data, schema/policy edit, deployment, native independent factory acceptance or full-spec PASS is claimed.
