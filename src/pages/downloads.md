---
title: Downloads
description: Official release artifacts of Apache Iggy (Incubating)
wrapperClassName: downloads-page
---

# Apache Iggy (Incubating) Downloads

The Apache Iggy project publishes source‑code releases as compressed archives (`.tar.gz`). Binary convenience builds may appear in the future, but **the only official artifacts today are the source packages signed by Iggy committers and mirrored by the Apache Software Foundation.**

---

## Releases

| Version | Date&nbsp;(UTC) | Source archive | Signatures&nbsp;&amp;&nbsp;checksums |
|---------|-----------------|----------------|--------------------------------------|
| **0.5.0-incubating** *(latest)* | 2025-08-10 | [`iggy-0.5.0-incubating-src.tar.gz`](https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz) | [`asc`](https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz.asc), [`sha512`](https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz.sha512) |
| **0.4.300-incubating** | 2025-04-15 | [`iggy-0.4.300-incubating-src.tar.gz`](https://downloads.apache.org/incubator/iggy/0.4.300/iggy-0.4.300-incubating-src.tar.gz) | [`asc`](https://downloads.apache.org/incubator/iggy/0.4.300/iggy-0.4.300-incubating-src.tar.gz.asc), [`sha512`](https://downloads.apache.org/incubator/iggy/0.4.300/iggy-0.4.300-incubating-src.tar.gz.sha512) |

Older incubating releases will appear in the same [downloads directory](https://downloads.apache.org/incubator/iggy/) after they are approved by the Apache Incubator PMC. Permanent archives are kept at [archive.apache.org](https://archive.apache.org/); none exist yet because there are no older releases.

---

## Notes

- **Verify before use.** Always check the OpenPGP **signature** (`.asc`) or, if that is not possible, at least the **SHA‑512 checksum**.
- The [`KEYS`](https://downloads.apache.org/incubator/iggy/KEYS) file contains all public keys used to sign Iggy releases. Import it once; only new keys need to be added in future releases.
- Because Iggy is still in the Apache Incubator, releases are **incubating releases** and are not yet official ASF products. They are distributed under the Incubator’s rules and may evolve rapidly.

---

### Verify the signature

```bash
# Download artifact, matching .asc file and KEYS
curl -O https://downloads.apache.org/incubator/iggy/KEYS
curl -O https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz
curl -O https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz.asc

# Import Iggy release keys
gpg --import KEYS

# Verify signature
gpg --verify iggy-0.5.0-incubating-src.tar.gz.asc iggy-0.5.0-incubating-src.tar.gz
```

A successful verification prints **"Good signature from …"** and the fingerprint of an Iggy committer’s key.

---

### Verify the checksum

```bash
curl -O https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz.sha512
shasum -a 512 -c iggy-0.5.0-incubating-src.tar.gz.sha512
```

The command should output:

```
iggy-0.5.0-incubating-src.tar.gz: OK
```

---

## Need bleeding-edge code?

The latest development code is available from the `master` branch on GitHub:

```bash
git clone https://github.com/apache/iggy.git
```

Be aware that trunk builds **may be unstable and are not ASF‑endorsed releases**.

---

© 2025 The Apache Software Foundation.
Apache, Apache Iggy, the Apache feather logo, and related marks are trademarks of the ASF.
