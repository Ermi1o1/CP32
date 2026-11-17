# Open Tier-1 alerts

Items the collector flagged as project-critical. Clear a line once it is filed or dismissed.

Last triage: **2026-11-14** (`/intel-review`). 48 Tier-1 alerts reviewed, 7 filed
to `items/`, 41 dismissed. 45 of the 48 came from the collector's first
backfill run on 2026-11-09 and had never been triaged; daily runs since have
produced 0–2 Tier-1 items each, so the backlog was a one-off, not a filter
fault. See `proposals/2026-11-14-review.md` for what is still open.

## Open — needs the founder

- [ ] 2026-07-06 · **Fana Media** · [C] Ethiopia Unveils Official Digital Platforms for COP32 — filed as
  `items/2026/07/2026-07-06-ethiopia-official-cop32-digital-platforms.md`.
  **Stays open**: the underlying fact is not traced to a primary source, and it
  bears on R1 and on D1. Settled by reading the official COP32 host site or a
  government statement naming what launched in July 2026 and who operates it.
- [ ] **Which COP32 domain is official, and who operates it.** Three candidates,
  none with verified attribution:
  `cop32.gov.et` (an `events@cop32.gov.et` address appears in an Ethiopian
  Environmental Protection Authority official's public post; the domain itself
  could not be fetched from this session),
  `cop32ethiopia.et` (live placeholder, self-describes as "The Official Site of
  COP32", names no operator, no contact details, links only to `cop32ethiopia`
  social handles),
  `cop32ethiopia.org` (the domain this pipeline watches; a WordPress maintenance
  page with a login UI). `cic-26.com` was already flagged unverified in
  `reality-check.md`. Until this is settled the `page_watch` entry may be
  pointed at the wrong host.
- [ ] **Is a COP32 host-country mobile app announced, procured or in
  development, and who owns it?** Not answered by anything collected so far.
  Check e-GP, MinT, the Digital/ICT and Utilities Task Force, and the COP32
  secretariat.

## Dismissed on 2026-11-14

- 34 Apple App Store listings from the 2026-11-09 backfill that matched on
  loose iTunes search before the `match:` regex in `sources.yml` was applied
  (Ethiopian Calendar, Sheger FM, ESP32-Cam, Atlas Copco, Hegemonia, CBE Mobile
  Banking, assorted shopping, radio and dating apps). Not COP-related.
- 7 news items restating what `reality-check.md` already records: the host
  selection and Ethiopia–Nigeria contest, PM Abiy's preparation statements,
  UNGA and Global South commentary, and COP31-sidelines diplomacy coverage.
- [ ] 2026-11-15 · **ENA English** · [C] Ethiopia Leads a Week of Green Diplomacy, Red Sea Access Push Gains International Momentum — https://news.google.com/rss/articles/CBMiUkFVX3lxTFBTaHMxQllpVmlZd3lpUnAySFAxblk1Ny1mRjBMal9rdldrenJhQWUtdUh1aXhXNFZ0TVh2N3NvOTZkYmE4c0JicUtPaU5wcWNaSEE?oc=5
- [ ] 2026-11-13 · **TV BRICS** · [C] OSC Secretary-General: COP32 in Ethiopia to serve as platform for Global South to coordinate their positions — https://news.google.com/rss/articles/CBMiyAFBVV95cUxQemdid0NUa2RveTR5M3ZaLVFidDA5YnFUazVVb19UdVdlcWI5OU84V2JNZENFZGM3OGdiZEVwamdaclUzMzB0VTlsaUFyUGFnTTN3R0lLVnBrSkc4dFFKNDBwOV9SUWlDcFdkTVhnd0ExYUFNSTlxR2c2UTBxb09MSGlySWlsXzJjNENuTW0xd3V2MXlGQTJKQUlySndpQ1hjT0pNM0dVQkRfSHRad2kxcWpHS1JKZVFBVjd0RlliN01LdVVOSmRFeQ?oc=5
- [ ] 2026-11-17 · **Ghana Business News** · [C] Climate promises must translate into funding and action at COP32 – AGNA — https://news.google.com/rss/articles/CBMitgFBVV95cUxNVDNnaUdnX1laTnY2cC1OTVFvUmxVdkpnZXkzc2xpU2pVMkpmdVZINE5vdkdlQVgwY2ZJdHIzYnJEc2NVRDlqX3NGUVJWekxra2JZeFRIbFY1WGJzZGZEUHlsdnMtWnpuUEI0czZCbUc0bnlWMnZVdmJHV0tnWXdhV3BKbzFnMWNMd1dXWEZZZVBzT2M5eUNjSUhsZHRZNmkwZ2R0RVVqZ0U2R2FHd2Q0V1ByOHI3Zw?oc=5
