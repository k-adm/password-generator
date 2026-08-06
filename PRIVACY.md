# Privacy Policy

**Extension:** Offline Password Generator (Chrome, Manifest V3)
**Last updated:** 2026-08-06

## Summary

This extension does not collect, store, transmit, or sell any personal or
sensitive user data. It has no backend, makes no network requests, and contains
no analytics or telemetry of any kind.

## What data is handled

The only data the extension writes anywhere is **your generator preferences** -
password length, which character classes are enabled, whether look-alike
characters are excluded, word count and separator for passphrases, and the
selected theme.

These preferences are stored with the
[`chrome.storage.local`](https://developer.chrome.com/docs/extensions/reference/api/storage)
API, which keeps them **on your own device**. They are never uploaded anywhere.
They are removed when you uninstall the extension.

## What is not handled

- **Generated passwords and passphrases are never stored.** They exist only in
  the popup while it is open and in your clipboard if you press Copy. Closing
  the popup discards them.
- No browsing history, page content, form data, cookies, or credentials are
  read. The extension declares no content scripts and no host permissions, so it
  has no access to the pages you visit.
- No personally identifiable information is requested or processed. There are no
  accounts and no sign-in.

## Permissions

The extension requests exactly one permission:

| Permission | Why |
|---|---|
| `storage` | To remember your generator settings between sessions on your device. |

No other permissions are requested.

## Network activity

None. The extension performs no network requests. All randomness comes from the
browser's built-in Web Crypto API (`crypto.getRandomValues`), and the diceware
wordlist is bundled inside the extension package.

## Third parties

No data is shared with anyone, because no data is collected. There are no
advertising, analytics, or tracking SDKs, and no remote code is loaded or
executed.

## Changes to this policy

Any change will be published in this file in the public repository, and the "Last
updated" date above will be revised.

## Contact

Questions or concerns: open an issue at
<https://github.com/k-adm/password-generator/issues>. For security reports,
please follow [SECURITY.md](SECURITY.md) instead of filing a public issue.
