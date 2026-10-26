# Mortgage production branch trigger repair

This directory defines the bounded provider configuration change required by
TES-195. It is a desired-state contract, not a provider request body or an
executable deployment command. No provider change occurs by committing it.

## Defect and scope

Cloudflare trigger `a1fce9f3-41f7-4148-b466-1cffa3503a7e` runs
`npx wrangler deploy` against the production `mortgage-utilitas-app` Worker.
Its wildcard include and `master` exclusion deployed the article branch before
review and subsequently replaced it with Dependabot branches. The exact source,
build, version and deployment associations are recorded in the delivery's
`deployment-provenance` document, revision
`46aa5b16-caa7-4e92-8aaa-30d8965ad109`.

The JSON contract changes only this trigger's branch filters: include exact
`master` and exclude nothing. Keep the repository, Worker, custom domain,
bindings, build command, deploy command and root directory unchanged. Retain
other trigger fields when the native endpoint requires a full update. Do not
create a second trigger, rename a branch or add a preview deployment.

`master` is the verified Git remote default and existing production branch.
Only independently accepted commits may be integrated there. The filters
prevent automatic production deployment from issue and dependency branches;
they do not themselves enforce review or replace branch protection.

## Review and application

1. Keep this change local. Do not push an issue branch while the unsafe trigger
   remains active. Viola reviews this exact configuration artifact first, then
   Cillian records technical acceptance. Existing article receipts cover their
   earlier commit, not this change.
2. Keanu uses his existing scoped managed Cloudflare connection and current run
   identity. Morgan's October 26 discovery has no usable Cloudflare connection;
   it is not a company-wide access failure. Read the current provider schema
   through the reviewed search descriptor and construct the documented update
   for this exact trigger. This file does not guess an endpoint or mutation
   parameter. Preserve any native denial or enforced approval.
3. Immediately before applying, read the exact trigger and repository/Worker
   association. Require the expected-before filters and unchanged fields from
   the contract. If different, stop and reconcile the changed artifact with
   reviewers. Inspect other active triggers for this same Worker; a second
   non-master production trigger would leave the hazard unresolved.
4. Apply only the two reviewed branch-filter changes. Preserve every other
   provider field. Do not deploy or push to test the filters. Read back the
   trigger, verify exact desired filters and unchanged fields, and retain a
   sanitized operation ID/time and result on the issue.
5. Check in-flight and queued builds for this Worker. A build started under the
   old filters can still deploy after the filter change. Resolve those builds
   through supported scoped native operations before declaring branch pushes
   safe. Any cancellation must target an identified non-master build for this
   Worker; never cancel unrelated work. If this needs an additional reviewed
   mutation, record it and obtain the relevant acceptance first.
6. Check the complete active trigger set and effective branch selection without
   generating a build. `master` must match. The current issue branch,
   `dependabot/npm_and_yarn/vite-8.3.5`,
   `dependabot/npm_and_yarn/multi-456d42d8d4`, `main`, and arbitrary feature
   branches must not match. Record provider read-back separately from this local
   branch-filter expectation.

The trigger label currently says "Deploy non-production branches". It is not
used as identity or authorization. Renaming it is outside this minimal change.

## Release continuation and recovery

After verified provider application, return the same delivery to Morgan.
Complete the README housing refresh in the isolated worktree, validate and
commit any changed snapshots, and obtain renewed relevant Viola then Cillian
acceptance of the final commit before integration into `master`. Reuse Margot's
editorial/media acceptance only for unchanged copy and media. Preserve the
proven original article publication date of October 22, 2026.

If update or read-back fails, do not push or deploy. Re-read after a timeout
before retrying a mutation. Keep the last deployed version unchanged and record
the precise failure with the operational owner. Never restore the unsafe
wildcard filters as a rollback. If the provider cannot maintain the reviewed
filters, prepare a separately reviewed disablement of this exact trigger using
its documented native operation. Do not delete or recreate triggers blindly.

Final release still requires actual reviewed production integration/deployment,
HTTP 200 at the canonical article, matching title/H1/body/metadata, valid links
and schema, approved shared brand card, index and sitemap checks, guarded
IndexNow and the valid article outcome receipt. This internal configuration
repair has no significant-release notification receipt of its own.
