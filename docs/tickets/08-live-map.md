# 08 — Live map for the Operator

**What to build:** the Operator sees one map above the live list with a
pin for every active report that has a GPS location. Pins appear, and
change colour when the status changes, without refreshing the page.

**Blocked by:** 07

**Status:** todo

- [x] One map shows a pin for each active (not resolved) report with GPS
- [x] Pin colour shows the status: red received, blue verified, purple
      dispatched
- [x] Tapping a pin shows the type, status, description and landmark
- [x] Reports without GPS are counted under the map, not hidden silently
- [x] New reports and status changes update the map by themselves
- [ ] Works on the live URL, on a computer and on a phone

**Team decision:** approved adding the free Leaflet library and
OpenStreetMap map pictures, which are outside the original pinned stack.
