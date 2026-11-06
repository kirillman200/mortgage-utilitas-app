# Mortgage production trigger removal contract

This nonexecuting contract supersedes the filter conversion in commit
9c69d221647c234599f7d20d1ca551a2ea01ee23. It is prepared for independent
review, not evidence of provider application. Keep it local until pushes are safe.

## Finding and selected repair

The two optional filter fields match the public PATCH schema, but Keanu's two
attempts returned Invalid request body (upstream 400/code 12002). The recorded
error does not isolate serialization, headers or provider validation as the cause.
Do not retry that unchanged request or supply redacted build-token fields.

The complete recorded inventory also contains an existing master-only trigger,
c8fddddc-2793-45f2-a0da-3d19a47e5e06. Converting the unsafe trigger to master
would duplicate production builds. Instead remove only unsafe trigger
a1fce9f3-41f7-4148-b466-1cffa3503a7e and preserve the existing master trigger.
This is removal, not a reversible enabled flag. The public update schema exposes
no enabled flag. Recovery must not recreate the unsafe trigger.

Official API contracts, inspected October 26, 2026:
- https://developers.cloudflare.com/api/resources/workers_builds/subresources/triggers/methods/update/
- https://developers.cloudflare.com/api/resources/workers_builds/subresources/triggers/methods/delete/

DELETE takes the account and trigger path parameters, with no request body.
It removes the target trigger and cancels its unfinished builds. This cancellation
side effect is part of the proposed review scope, not a separate blanket grant.
Native authorization remains binding. No raw provider request or credential is
permitted; Keanu must use his existing managed connection and current identity.

## Preconditions and bounded application

1. Obtain independent Viola QA and technical acceptance of this exact revision.
   Since Cillian prepared it, obtain Keanu's independent technical inspection of
   the operation as well before application; Cillian's release verdict must not
   represent self-authored preparation as independent verification.
2. Inspect the current native DELETE descriptor before constructing the managed
   call. Require it to agree with the JSON method/path and omitted body. If the
   descriptor changes semantics, stop for review. Do not guess aliases or replay
   redacted values. Keep any enforced native approval or denial intact.
3. Freshly read the complete trigger inventory, repository association, Worker
   and production domain. Require kirillman200/mortgage-utilitas-app,
   mortgage-utilitas-app, mortgage.utilitas.app and target wildcard includes [*],
   excludes [master]. Require both triggers' build/deploy/root settings to match
   the unchanged fields. Require the preserved trigger to be active and include
   only master with no excludes. Stop on any discrepancy or additional unsafe
   production trigger. Save sanitized nonsecret before-state evidence.
4. Fetch all pages of current builds. Identify unfinished builds belonging to
   the target trigger, including exact branch and commit. Proceed only if each
   is a non-master build for this repository/Worker. If an association is unknown
   or a master build is attached to the target, stop for review. Never cancel
   builds of the preserved trigger. Zero active builds in prior evidence is
   historical and must be refreshed. A new target build can race this read;
   the DELETE cancellation side effect addresses that race for this trigger.
5. Apply the exact DELETE once through the managed route. Do not deploy, push,
   delete the Worker, remove its repository connection, revoke build tokens,
   modify the master trigger or perform any other mutation. Record sanitized
   operation identity/time and result. After a timeout, reconcile inventory and
   builds before considering any retry. A 404 alone is not successful proof.
6. Read the complete trigger inventory back. Require target absent or marked
   deleted, and the preserved master trigger's nonsecret configuration unchanged.
   Verify its association and filters plus all other active triggers. Fetch all
   build pages again and require no queued/running target or other non-master
   production builds. Check latest deployment/version for any race deployment;
   distinguish observed changes from changes this operation caused. If uncertain,
   keep pushes paused. No test push or synthetic deployment is authorized.

## Recovery and release continuation

If removal fails, preserve provider state and keep branch pushes paused. If the
master trigger is missing or unhealthy, do not recreate a wildcard or mutate
unrelated fields. Return the exact finding for a separately reviewed repair.
The existing deployed Worker remains the recovery baseline; this operation does
not roll it back or restore the article. No automatic undo is claimed.

After verified repair, hand this same issue to Morgan. Preserve concurrent
master work, most recently recorded at 4731f8e5b85fce2c36b34e4870906407f3c3b49c;
recheck remote HEAD and protection before integration. Complete the required
housing refresh and renewed final-artifact Viola QA then Cillian acceptance.
Preserve October 22 original publication date and unchanged editorial/media
acceptance. Integrate through actual master, then verify deployment and complete
article HTTP/title/H1/body/canonical/metadata/links/schema/media/index/sitemap
checks and guarded IndexNow. Save the valid article outcome only after success.
This internal configuration artifact warrants no significant_release receipt.
