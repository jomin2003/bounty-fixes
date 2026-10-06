# SUBMISSIONS — only verified fixed things (attributed to you)

Verified just now:
- simple-git 4.0.2 + wrapper: `node verify-simple-git-fix.mjs` 6/6 blocked, `npm audit` 0 vulns, `@simple-git/argv-parser@2.0.1`
- wordpress-sqli-fix.php: `php -l` No syntax errors, uses `sanitize_key` + `$wpdb->prepare(%s)` + `absint`
- wordpress-xss-fix.php: `php -l` No syntax errors, uses `floatval` + `esc_html`
- AtlassianTraversalFix.java: `javac` OK, `normalize().startsWith(root)` + double-decode block

Excluded (not a verified code fix, DO NOT submit as fixed):
- omarchy-audit.md — audit notes only, no upstream patch applied.

## How the bounty gets to YOU (not me)
I cannot cash out for you. Bounties pay to the account that submits the report.
You must paste these from YOUR account:
1. HackerOne: https://hackerone.com/omarchy (use Report 1 if you want that program, but note ours is a hardening proposal — submit as hardening, not as confirmed RCE)
2. Patchstack / WordPress plugin devs: via https://patchstack.com/database/ report / plugin support — include fixed file diff
3. Atlassian: via https://www.atlassian.com/trust/security/bug-bounty — only if you found an unpatched instance; do NOT submit the generic pattern as a new bug (CVE-2026-21589 is already public/patched)
4. simple-git: via https://github.com/steveukx/git-js/security/advisories — 4.0.1/4.0.2 already fixed upstream, submit only if you have a NEW bypass around 4.0.2 with PoC

Attributed to jomin2003. Payout goes to the payment profile on that account.

---
## Report 1 — simple-git hardening (use only if you have NEW bypass on 4.0.2, else do not submit)
Title: `simple-git post-4.0.1 hardening + wrapper blocks trailer.cmd / include / protocol.allow`
Steps:
1. `npm i simple-git@4.0.2`
2. Add `fixes/simple-git-safe-wrapper.mjs` `assertSafeConfig()` denylist
3. Try `trailer.myhook.cmd=calc.exe`, `include.path`, `protocol.allow`, `core.editor`, `--exec` — all throw `blocked unsafe git config`
Impact: prevents RCE class CVE-2026-102828/102829 if caller forwards user input to `config:[]`.
Fix: upgrade to 4.0.2 + keep blockUnsafeOperationsPlugin enabled + allowlist config keys. Evidence: `verify-simple-git-fix.mjs 6/6 blocked`, `npm audit 0 vulns`.
Reporter: jomin2003

## Report 2 — WordPress SQLi fix (send to plugin vendor, not a new bounty claim)
Title: `Fix unauth SQLi via $column interpolation — use prepare + allowlist`
Affected: SendPress <=1.26.1.20 (CVE-2026-39795), ARMember <=7.8 (CVE-2026-42417), Porto <=3.9.3 (CVE-2026-42415)
Patch file: `fixes/wordpress-sqli-fix.php` (php -l clean)
Diff essence: `$column=sanitize_key($column); $wpdb->prepare("SELECT ... WHERE $column = %s", $row_id)` + `absint($_POST[id])`
Reporter: jomin2003

## Report 3 — WordPress stored XSS fix
Affected: WPC Product Bundles <=8.6.6 (CVE-2026-93836), Ninja Forms <=3.15.3 (CVE-2026-94504)
Patch file: `fixes/wordpress-xss-fix.php` (php -l clean)
Diff essence: `floatval($qty)` + `esc_html()` on admin render, `wp_kses_post` if rich-text.
Reporter: jomin2003

## Report 4 — Atlassian traversal guard
Affected: CVE-2026-21589 (already public — submit only for unpatched instance you tested with permission)
Patch file: `fixes/AtlassianTraversalFix.java` (javac OK)
Reporter: jomin2003
