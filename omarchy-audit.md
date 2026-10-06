# Omarchy audit 2026-10-06 (branch quattro, depth 1)

Scope: https://github.com/omacom/omarchy — HackerOne $250-$1500, eligible only if bug is in Omarchy integration, not upstream.

Findings (static grep):
- No direct `curl|sh` installer in repo root; install/ uses local scripts.
- Risk areas to harden for bounty-worthy fix:
  1. `bin/omarchy` command router builds binary names via join_words from args — ensure allowlist: only dispatch to known COMMAND_* keys, reject `..`, `/`, `;`, `$()`.
  2. Migration scripts `migrations/*.sh` run with `bash -euo pipefail` + sudo/pacman — pin package versions, verify checksums, require `OMARCHY_ALLOW_DIRECT_PACMAN` guard (already present, keep).
  3. Templates using `$(...)` with filenames — quote `"$file"`, use `--` before paths, avoid eval.

Patch pattern shipped:
```bash
# BEFORE:
binary="omarchy-$(echo "$args")"
$binary "$@"

# AFTER:
case "$key" in
  upgrade|install|remove|theme-*) ;;
  *) echo "unknown command" >&2; exit 1;;
esac
binary="omarchy-${key//[^a-z0-9-]/}"
[ -x "$BIN_DIR/$binary" ] || exit 1
exec "$BIN_DIR/$binary" "$@"
```
+ add `set -u`, `IFS`, ShellCheck in CI, no `chmod 777`, no unpinned curl|bash.
