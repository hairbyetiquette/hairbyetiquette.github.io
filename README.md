# Hair by Etiquette

A local, buildless website for the boutique hair salon at 26 Old Street, Upton upon Severn, Worcester, WR8 0HW. Telephone: 01684 593920.

Open `index.html` directly, or run `python -m http.server 4173 --directory HairByEtiquette` from the workspace root and visit http://localhost:4173. No package installation or build is required. Fonts and photos are self-hosted, with local font fallbacks. Font licences are included in `assets/fonts/`.

## Design and content

The existing portfolio inspired the sticky navigation, sliding tab indicator, split hero and service cards. The design uses olive green, cream and restrained lemon accents, with Playfair Display and DM Sans typography.

All four photos supplied by the user are copied into `assets/` with descriptive filenames. The shopfront is the hero image; the three interior photos form the salon photo layout. The original AI-generated concept asset is retained as `assets/salon-interior.webp` but is no longer referenced on the site.

The site includes click-to-call links, directions to the salon address, Facebook and Yell links, and HairSalon structured data. Contact details supplied by the user were cross-checked against [Yell](https://www.yell.com/biz/hair-by-etiquette-worcester-1563674/). The Facebook listing uses the alternate spelling "Hair by Ettiquette"; the website keeps "Hair by Etiquette", matching the supplied storefront photo. Opening hours, prices and anniversary claims are not published without confirmation.

The services supplied in the user's screenshot are grouped into everyday hair/care, colour/highlights and styling/occasions. Duplicate "Blowdry" and "Blow dry" entries are combined. "Hair regrowth" is described as regrowth colouring (root colour), without implying medical hair-growth treatments. Prices and appointment timings are available by calling the salon.

## Booking

The appointment planner has been replaced by the Google Calendar appointment schedule supplied by the user:

- Public booking link: https://calendar.app.google/qKVAjC4Gqqs2WZUR9
- Embedded schedule: https://calendar.google.com/calendar/appointments/schedules/AcZssZ1D1hdHNbgFKJj6Yw5eEboqQ2pGeCfIiYANhGd4BVss_op9CQSTA5GtYRbF1hhFPZlJKNP-w5iJ?gv=true

The booking section loads the supplied schedule only after permission for Google Calendar is given. A direct booking link and phone fallback remain available. Main booking calls to action scroll to that section. Visitors finish bookings on Google's schedule; this website does not collect booking data or make calendar API calls. Appointment availability, durations, reminders and confirmations are managed in the connected Google Calendar schedule. Google may require verification or sign-in according to the schedule's settings.

The page prominently states that online bookings require at least 48 hours' notice and invites customers to call about earlier slots. **The website cannot enforce lead time inside a cross-origin Google iframe.** In the schedule owner's Google Calendar, edit the appointment schedule, open **Scheduling window**, set the minimum notice to **48 hours**, and save. See [Google's availability guidance](https://support.google.com/calendar/answer/11423292?hl=en-uk). No calendar account settings have been changed by this project.

## Privacy and optional embeds

- `privacy.html` and `cookies.html` describe the current site, Google services, retention criteria, contact details and privacy choices. The owner should confirm that the notice matches their actual booking record retention and hosting arrangements before publication.
- `privacy.js` creates a full-page first-visit consent dialog and a separate settings dialog. First-time choices are off. Accept, reject and individual settings are available, with equally styled accept/reject buttons. Escape dismisses the initial notice without granting consent. Privacy and cookie pages remain readable without making a choice.
- The essential local-storage entry `hbe-privacy-choices-v1` stores only the two choices, a version and the saved time. Choices expire after 180 days. Invalid, expired or unavailable storage never enables an embed automatically.
- Neither iframe exists before its permission is granted. The salon map is inline in the Find us section and remains entirely hidden until Google Maps is allowed. Accepting optional features or allowing Maps in settings reveals it automatically, including on later visits with a valid saved choice. There is no map popup or View map button. Withdrawing Maps permission removes the iframe and hides the map section; it cannot delete Google's own cookies or undo earlier disclosure.
- All fonts are local. There are no analytics, advertising tags, Google preconnect hints or remote preview images. Third-party requests were tested to be absent before consent and after rejection.
- Cookie settings are available from every page. Direct external links remain deliberate visits governed by the destination's own notices.

The inline map's olive-and-lemon address panel, frame and surrounding controls are customised. The Google map itself keeps its standard presentation. Recolouring Google's map tiles would require a separate Maps JavaScript API setup with a suitable restricted key and styling configuration; no API key is included or required for this share-style map embed.

## Gallery and motion

The gallery uses the four supplied salon photos, filters for inside/outside, a keyboard-accessible lightbox, Previous/Next controls and focus restoration. Images still open directly with JavaScript disabled. Animations include section reveals, staggered cards, image hover transitions and a gentle hero entrance. Reduced-motion preferences disable animation; no autoplay carousel or background tracking is used.

## Verification

Browser checks cover no external traffic before consent, persisted rejection, individual permissions, withdrawal, expired/corrupt preferences, live Calendar loading, inline map consent and visibility, gallery filtering and keyboard navigation, policy pages, reduced motion and no-JavaScript fallback. Responsive layouts were checked from 320px to 1440px.

No test appointment has been created. The project remains local and has not been published or added to the portfolio repository.
