# Requirements Document

## Introduction

The New Haven Tapball Cricket League (NHTCL) is a community cricket tournament held over Independence Day weekend — July 4–5, 2026 — at 150 Kimberly Avenue, New Haven, Connecticut. The event features 8 teams competing in a pool-stage followed by knockout semi-finals and a final, with all matches played using taped-tennis (tapball) cricket rules.

This document specifies requirements for a fully static website (HTML5 + Bootstrap 5 + CSS3 + vanilla JavaScript) deployable on GitHub Pages. The website serves as the primary digital presence for the tournament: informing participants, publishing the schedule and standings, showcasing sponsors, enabling team registration inquiries, and providing printable artifacts (rulebook, invitation letters, event brochure).

---

## Glossary

- **NHTCL**: New Haven Tapball Cricket League — the tournament described in this document.
- **Website**: The fully static HTML/CSS/JS site hosted on GitHub Pages representing NHTCL.
- **Page**: A single HTML file or distinct scrollable section within the Website.
- **Visitor**: Any person who views the Website via a browser.
- **Admin**: The tournament organizer who updates static content and deploys the Website.
- **Team**: A registered playing unit of 9 or 11 players (depending on chosen format).
- **Pool**: One of two groups (Pool A or Pool B), each containing 4 Teams, used for the round-robin stage.
- **Round Robin**: The pool-stage format in which each Team plays every other Team in its Pool once (3 matches per Team).
- **Knockout Stage**: The elimination stage consisting of two Semi-finals and one Final.
- **Semi-final**: A knockout match between the 1st-place team of one Pool and the 2nd-place team of the other Pool.
- **Final**: The championship match between the two Semi-final winners.
- **Format Option 1**: 11-a-side, 8 overs per innings.
- **Format Option 2**: 9-a-side, 6 overs per innings.
- **Over**: A set of 6 legal deliveries bowled by one bowler.
- **Innings**: One team's batting turn; each team bats one innings per match.
- **Tapball**: A tennis ball wrapped in electrical or PVC tape used in place of a leather cricket ball.
- **Slow-Over-Rate Penalty**: A run penalty applied to the batting team's opponents' score when the fielding team fails to complete their allotted overs within the prescribed time limit.
- **Points Table**: A standings table showing each team's matches played, wins, losses, ties, no-results, net run rate, and total points within their Pool.
- **Net Run Rate (NRR)**: A tiebreaker metric calculated as (total runs scored ÷ total overs faced) − (total runs conceded ÷ total overs bowled).
- **Man of the Match (MOM)**: An individual performance award given after each Semi-final and the Final.
- **Man of the Series (MOS)**: An award for the best overall performer across the entire tournament.
- **Best Bowler**: An award for the best overall bowling figures across the tournament.
- **Chief Guest**: A dignitary or community leader invited to preside over a ceremony.
- **Sponsor**: An organization or individual providing financial or in-kind support in exchange for recognition.
- **Title Sponsor**: The primary sponsor contributing $500 or more.
- **Gold Sponsor**: A sponsor contributing $250 or more.
- **Silver Sponsor**: A sponsor contributing $100 or more.
- **Community Sponsor**: A sponsor contributing goods or services (in-kind) rather than cash.
- **GitHub Pages**: A free static-site hosting service provided by GitHub.
- **Bootstrap 5**: The front-end CSS/JS framework used for responsive layout and components.
- **Print CSS**: Stylesheet rules that control how a page renders when printed or saved as PDF.
- **WCAG**: Web Content Accessibility Guidelines — the international standard for web accessibility.
- **Countdown Timer**: A live JavaScript widget on the Home page counting down to the tournament start date/time.
- **Bracket**: A visual representation of the knockout stage showing Semi-final and Final match slots.
- **Brochure**: A single printable page summarizing the event details, format, and key information.

---

## Requirements

### Requirement 1: Static Site Deployment on GitHub Pages

**User Story:** As an Admin, I want to deploy the Website as a fully static site on GitHub Pages, so that the tournament has a publicly accessible web presence with zero hosting cost and no server-side dependencies.

#### Acceptance Criteria

1. THE Website SHALL consist exclusively of HTML5, CSS3, Bootstrap 5, and vanilla JavaScript files with no server-side code, build pipeline dependency, or database connection required at runtime.
2. THE Website SHALL use relative file paths for all internal links, stylesheets, scripts, and images so that it functions correctly when served from a GitHub Pages subdirectory URL.
3. WHEN a Visitor navigates to any Page of the Website, THE Website SHALL load and render fully without any server-side processing or API calls to non-static external services.
4. IF a Visitor requests a URL path that does not correspond to an existing HTML file, THEN THE Website SHALL present a custom 404 error page with a link back to the Home page.
5. THE Website SHALL include a `README.md` file at the repository root documenting deployment instructions for the Admin.

---

### Requirement 2: Responsive Layout and Mobile Compatibility

**User Story:** As a Visitor using any device, I want the Website to be readable and navigable on screens of all sizes, so that I can access tournament information on my phone, tablet, or desktop.

#### Acceptance Criteria

1. THE Website SHALL use Bootstrap 5 grid and utility classes to implement a mobile-first responsive layout across all Pages.
2. WHEN a Visitor views any Page on a viewport width of 320px or wider, THE Website SHALL render all content without horizontal scrolling or content overflow.
3. WHEN a Visitor views the Website on a viewport width below 768px, THE Website SHALL collapse the navigation menu into a hamburger toggle using Bootstrap's navbar-toggler component.
4. WHEN a Visitor views the Website on a viewport width of 768px or wider, THE Website SHALL display the full horizontal navigation bar.
5. THE Website SHALL pass visual inspection on the following representative viewport widths: 375px (mobile), 768px (tablet), 1280px (desktop).

---

### Requirement 3: Accessibility Compliance

**User Story:** As a Visitor with a disability, I want the Website to be usable with assistive technologies, so that I can access all tournament information regardless of my ability.

#### Acceptance Criteria

1. THE Website SHALL provide `alt` attribute text for every `<img>` element that conveys content; decorative images SHALL use `alt=""`.
2. THE Website SHALL maintain a color-contrast ratio of at least 4.5:1 for normal text and 3:1 for large text between foreground text color and background color, as defined by WCAG 2.1 Level AA.
3. THE Website SHALL use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) to define page structure.
4. THE Website SHALL ensure all interactive elements (links, buttons, form fields) are focusable and operable via keyboard navigation alone.
5. THE Website SHALL include a `<title>` element with a descriptive, unique value on every Page.
6. THE Website SHALL include a visible skip-navigation link as the first focusable element on every Page, allowing keyboard users to bypass the navigation bar.

---

### Requirement 4: Performance — Fast Page Load

**User Story:** As a Visitor on a mobile data connection, I want each page to load quickly, so that I am not frustrated waiting for tournament information.

#### Acceptance Criteria

1. THE Website SHALL not embed or load any external JavaScript framework other than Bootstrap 5 (CDN-hosted) and optional vanilla JS utilities.
2. THE Website SHALL optimize all images to a maximum file size of 200 KB per image before deployment, using compressed JPEG or WebP formats for photos and SVG for logos.
3. THE Website SHALL defer non-critical JavaScript execution by placing `<script>` tags at the end of `<body>` or using the `defer` attribute.
4. WHEN a Visitor loads any Page on a standard broadband connection (≥5 Mbps), THE Website SHALL complete first contentful paint within 3 seconds.

---

### Requirement 5: Patriotic Independence Day Visual Theme

**User Story:** As a Visitor, I want the Website's visual design to reflect the Independence Day celebration, so that the patriotic spirit of the July 4th event is communicated immediately.

#### Acceptance Criteria

1. THE Website SHALL apply a primary color palette of patriotic red (#BF0A30 or equivalent), white (#FFFFFF), and blue (#002868 or equivalent) as its dominant accent colors.
2. THE Website SHALL display Independence Day thematic elements (stars, flag-inspired accents, or patriotic iconography) within the Home page hero section.
3. THE Website SHALL maintain a consistent visual identity (logo, color palette, typography) across all Pages.
4. THE Website SHALL include a site-wide navigation bar and footer that are identical in structure and styling across all Pages.

---

### Requirement 6: Navigation Structure

**User Story:** As a Visitor, I want a clear and consistent navigation menu, so that I can quickly reach any section of the Website.

#### Acceptance Criteria

1. THE Website SHALL provide a top navigation bar containing links to all 12 primary pages: Home, About, Schedule, Teams, Rules, Standings, Awards, Sponsors, Gallery, Contact/Register, Invitation Letters, and Brochure.
2. WHEN a Visitor clicks a navigation link, THE Website SHALL navigate to the corresponding Page without a full-page reload for same-page anchor links, or load the target HTML file for separate pages.
3. THE Website SHALL highlight the active navigation link to indicate the Visitor's current Page using Bootstrap's `active` class or equivalent CSS.
4. THE Website SHALL display the event name "New Haven Tapball Cricket League" and a tournament logo or crest in the navigation bar on all Pages.

---

### Requirement 7: Home / Landing Page

**User Story:** As a Visitor landing on the Website for the first time, I want to immediately understand the event and feel the excitement, so that I am motivated to explore further and register my team.

#### Acceptance Criteria

1. THE Home_Page SHALL display a full-width hero banner section containing: the tournament name, event dates (July 4–5, 2026), venue (150 Kimberly Avenue, New Haven, CT), and a prominent call-to-action button linking to the Contact/Register page.
2. THE Home_Page SHALL display a Countdown_Timer showing days, hours, minutes, and seconds remaining until 9:00 AM Eastern Time on July 4, 2026.
3. WHEN the tournament start date has passed, THE Countdown_Timer SHALL display a message such as "The Tournament is Underway!" instead of negative time values.
4. THE Home_Page SHALL display a Quick-Links section with icon-card links to: Schedule, Teams, Rules, Standings, and Contact/Register pages.
5. THE Home_Page SHALL display a brief event summary (50–100 words) highlighting the Independence Day theme, venue, team count, and prize categories.
6. THE Home_Page SHALL display a Sponsors highlight strip showing Title Sponsor and Gold Sponsor logos (or placeholder boxes if no sponsors are confirmed).

---

### Requirement 8: About the League Page

**User Story:** As a Visitor unfamiliar with tapball cricket, I want to learn about the tournament's background and the tapball format, so that I understand what I am participating in or watching.

#### Acceptance Criteria

1. THE About_Page SHALL contain a "Tournament Story" section describing the origin and purpose of the NHTCL, the Independence Day connection, and the New Haven community it serves.
2. THE About_Page SHALL contain a "What is Tapball Cricket?" section explaining the format: tennis ball wrapped in tape, used instead of a leather ball, adapted rules for faster gameplay.
3. THE About_Page SHALL contain a "Format Overview" section describing both Format Option 1 (11-a-side, 8 overs) and Format Option 2 (9-a-side, 6 overs), including match duration estimates for each.
4. THE About_Page SHALL contain a "Tournament Structure" section describing the pool stage (2 pools × 4 teams, 3 matches each), knockout stage (semi-finals and final), and two-day schedule structure.
5. THE About_Page SHALL contain a "Venue" section with the full address (150 Kimberly Avenue, New Haven, CT), number of available pitches (3), and a note that 3 matches can run in parallel.

---

### Requirement 9: Schedule Page

**User Story:** As a Team captain or Visitor, I want to see the complete match schedule, so that I know exactly when and where each match is taking place.

#### Acceptance Criteria

1. THE Schedule_Page SHALL display a Day 1 (July 4, 2026) section listing all 12 pool-stage matches organized by round, showing start time, Pitch number (1, 2, or 3), Pool (A or B), and participating team names (or TBD placeholders).
2. THE Schedule_Page SHALL display a Day 2 (July 5, 2026) section listing both Semi-finals (9:00 AM, Pitches 1 and 2 in parallel) and the Final (start time dependent on chosen format: 10:45 AM), plus the closing ceremony time (12:00–1:00 PM).
3. THE Schedule_Page SHALL clearly indicate the 30-minute buffer/lunch breaks between rounds on Day 1.
4. THE Schedule_Page SHALL display the estimated end times for Day 1 for both format options: ~3:26 PM for Format Option 1 and ~2:14 PM for Format Option 2.
5. THE Schedule_Page SHALL display a Pool Draw section showing which 4 teams are in Pool A and which 4 teams are in Pool B, with the full round-robin fixture list (6 matches per pool, 12 total).
6. THE Schedule_Page SHALL display a Knockout Bracket visual showing the two Semi-final slots and the Final slot, with winner progression lines.
7. WHEN team assignments are not yet confirmed, THE Schedule_Page SHALL display "TBD" in all team name fields within the schedule and bracket.

---

### Requirement 10: Teams Page

**User Story:** As a Visitor, I want to browse the registered teams, so that I can learn who is competing in the tournament.

#### Acceptance Criteria

1. THE Teams_Page SHALL display a team card for each of the 8 registered Teams, containing: team name, team logo or placeholder image, pool assignment (Pool A or Pool B), and a short team description (optional, placeholder text if not provided).
2. THE Teams_Page SHALL display a "Registration Open" banner and a link to the Contact/Register page when fewer than 8 teams are registered.
3. WHEN all 8 teams are confirmed, THE Teams_Page SHALL remove the "Registration Open" banner and display all team cards in a responsive grid (2 columns on mobile, 4 columns on desktop).
4. THE Teams_Page SHALL group team cards visually by Pool (Pool A section, then Pool B section).

---

### Requirement 11: Rules Page

**User Story:** As a Team captain, I want to read the complete official tapball rulebook, so that I understand all playing rules and can prepare my team.

#### Acceptance Criteria

1. THE Rules_Page SHALL present the complete NHTCL tapball rulebook covering all the following rule categories: General Playing Rules, Batting Rules, Bowling Rules, Fielding Rules, Scoring, Slow-Over-Rate Penalty, Tiebreaker Rules, and Code of Conduct.
2. THE Rules_Page SHALL specify the Slow-Over-Rate Penalty for Format Option 1: the fielding team must complete 8 overs within 35 minutes; each over short of the target results in 5 runs added to the batting team's score.
3. THE Rules_Page SHALL specify the Slow-Over-Rate Penalty for Format Option 2: the fielding team must complete 6 overs within 27 minutes; each over short of the target results in 5 runs added to the batting team's score.
4. THE Rules_Page SHALL clearly display which format option is in effect for the tournament (or list both with a note indicating the chosen format will be announced before registration closes).
5. THE Rules_Page SHALL specify tiebreaker rules for the Points Table: (1) Net Run Rate, (2) head-to-head result, (3) coin toss.
6. THE Rules_Page SHALL specify points allocation: Win = 2 points, No Result = 1 point each, Loss = 0 points.
7. THE Rules_Page SHALL include a Print button that triggers the browser's print dialog for the Rules Page content, styled with Print CSS to produce a clean, logo-free printable document.
8. THE Rules_Page SHALL include a section listing fielding restrictions, maximum overs per bowler, and any no-ball/wide-ball definitions specific to tapball cricket.

---

### Requirement 12: Standings / Points Table Page

**User Story:** As a Visitor following the tournament, I want to see live (manually updated) standings, so that I know which teams are advancing to the knockout stage.

#### Acceptance Criteria

1. THE Standings_Page SHALL display two separate Points Tables: one for Pool A and one for Pool B.
2. EACH Points_Table SHALL contain the following columns: Position, Team Name, Matches Played (P), Wins (W), Losses (L), No Results (NR), Net Run Rate (NRR), and Points (Pts).
3. THE Standings_Page SHALL visually highlight (e.g., green background or bold row) the top 2 teams in each Pool to indicate qualification for the Semi-finals.
4. THE Standings_Page SHALL display a "Standings will be updated after each round" notice so Visitors understand the table is manually refreshed.
5. WHEN all pool matches are complete, THE Standings_Page SHALL display a "Knockout Stage Qualifiers" section listing the four qualifying teams and their Semi-final matchups.
6. THE Standings_Page SHALL use placeholder rows for all 4 teams in each Pool, pre-populated with zeros, until the Admin updates the static HTML with actual results.

---

### Requirement 13: Awards Page

**User Story:** As a Visitor, I want to learn about the tournament awards and trophies, so that I understand what is at stake and feel the prestige of the competition.

#### Acceptance Criteria

1. THE Awards_Page SHALL display all award categories: Winner Trophy, Runner-up Trophy, Man of the Match (Semi-final 1), Man of the Match (Semi-final 2), Man of the Match (Final), Man of the Series, Best Bowler, and Special/Organizing Committee Award.
2. THE Awards_Page SHALL display a description for each award category explaining the selection criteria.
3. THE Awards_Page SHALL display a visual distinction between the two large trophies (Winner, Runner-up) and the six smaller trophies, using different icon sizes or imagery.
4. THE Awards_Page SHALL include trophy budget context: large trophies ~$40–80 each, small trophies ~$8–20 each, total estimated budget $160–$280.
5. WHEN award winners are not yet known, THE Awards_Page SHALL display "To Be Announced" in the winner fields with placeholder trophy imagery.
6. WHEN award winners are confirmed post-tournament, THE Awards_Page SHALL be updated by the Admin to display winner names alongside their respective awards.

---

### Requirement 14: Sponsors Page

**User Story:** As a potential Sponsor, I want to understand the sponsorship tiers, benefits, and audience reach, so that I can decide whether to support the tournament.

#### Acceptance Criteria

1. THE Sponsors_Page SHALL display all four sponsorship tiers in descending order of prominence: Title Sponsor ($500+), Gold Sponsor ($250+), Silver Sponsor ($100+), Community Sponsor (in-kind).
2. THE Sponsors_Page SHALL list the specific benefits for each tier: Title Sponsor (logo on all banners, jersey mention, Website hero section placement, ceremony acknowledgment), Gold Sponsor (logo on Website, ceremony mention), Silver Sponsor (Website listing), Community Sponsor (Website listing with donation description).
3. THE Sponsors_Page SHALL display confirmed Sponsor logos or "Be Our Sponsor" placeholder cards for each tier.
4. THE Sponsors_Page SHALL include a "Become a Sponsor" call-to-action section with contact email and a link to the Contact/Register page.
5. THE Sponsors_Page SHALL display the expected audience reach (8 teams × ~15 members each = ~120 participants, plus spectators and online visitors) to provide Sponsors with context.

---

### Requirement 15: Gallery Page

**User Story:** As a Visitor, I want to view event photos, so that I can relive the excitement or get a feel for previous events.

#### Acceptance Criteria

1. THE Gallery_Page SHALL display a responsive photo grid using Bootstrap 5 columns, showing placeholder images with descriptive alt text before the event and actual photos after the event.
2. THE Gallery_Page SHALL display a "Photos will be added during and after the tournament" notice in the pre-event state.
3. WHEN a Visitor clicks a gallery image, THE Gallery_Page SHALL display the image in a lightbox or full-screen overlay using a vanilla JS or CSS-only implementation (no jQuery or external JS libraries other than Bootstrap).
4. THE Gallery_Page SHALL organize photos into labeled sections: "Inauguration Ceremony (July 4)", "Pool Matches", "Semi-finals", "Final & Closing Ceremony".

---

### Requirement 16: Contact and Registration Page

**User Story:** As a Team captain, I want to submit my team's registration interest and contact the organizers, so that I can participate in the tournament.

#### Acceptance Criteria

1. THE Contact_Page SHALL display a Team Registration Interest Form containing the following fields: Team Name (required, text), Captain Name (required, text), Captain Email (required, email format), Captain Phone (required, tel format), Number of Players (required, number, 9–11), Pool Preference (optional, dropdown: No Preference / Pool A / Pool B), and Message/Notes (optional, textarea).
2. WHEN a Visitor submits the Registration Form with all required fields completed, THE Contact_Page SHALL display a confirmation message indicating the submission was received, using a mailto link or Formspree endpoint for form submission (no server-side processing).
3. IF a Visitor attempts to submit the Registration Form with any required field empty or in an invalid format, THEN THE Contact_Page SHALL display inline validation error messages next to each invalid field and prevent submission.
4. THE Contact_Page SHALL display the organizer's contact information: email address, phone number (placeholder), and tournament venue address (150 Kimberly Avenue, New Haven, CT 06519).
5. THE Contact_Page SHALL embed a Google Maps iframe showing the venue location (150 Kimberly Avenue, New Haven, CT), with a fallback text link to Google Maps if the embed is blocked.
6. THE Contact_Page SHALL display the entry fee information: $100–$125 per team, with a note that fees are subject to confirmation.

---

### Requirement 17: Invitation Letters Page

**User Story:** As an Admin or organizer, I want printable invitation letter templates for the Chief Guest and potential Sponsors, so that I can send formal invitations with the correct event details.

#### Acceptance Criteria

1. THE Invitation_Page SHALL display two distinct printable letter templates: a Chief Guest Invitation Letter and a Sponsor Invitation Letter.
2. THE Chief_Guest_Letter SHALL include the following content: formal salutation, tournament name and dates (July 4–5, 2026), venue (150 Kimberly Avenue, New Haven, CT), role of the Chief Guest (presiding over the inauguration or closing ceremony), RSVP contact details, and a signature block for the organizer.
3. THE Sponsor_Letter SHALL include the following content: formal salutation, tournament overview, sponsorship tier table (Title/Gold/Silver/Community with benefits), contact details for the Sponsor liaison, and a signature block.
4. THE Invitation_Page SHALL include a Print button for each letter template that triggers the browser's print dialog, styled with Print CSS to output only the letter content (no navigation, no footer) on standard US Letter paper size.
5. THE Invitation_Page SHALL use Bootstrap's print utility classes to hide all Website navigation and non-letter content when printing.

---

### Requirement 18: Brochure Page

**User Story:** As an Admin, I want a printable single-page event brochure that I can distribute physically and digitally, so that the tournament has professional promotional material.

#### Acceptance Criteria

1. THE Brochure_Page SHALL fit all primary event information on a single printable page (US Letter, portrait orientation) when printed via the browser's print dialog.
2. THE Brochure_Page SHALL include the following content sections within the printable area: NHTCL logo/crest, event name, dates (July 4–5, 2026), venue and address, format overview (chosen format option), schedule summary (Day 1: Pool matches, Day 2: Semi-finals + Final), entry fee ($100–$125/team), contact/registration details, and sponsor acknowledgment area.
3. THE Brochure_Page SHALL apply Print CSS rules that display a two-column or poster-style layout suitable for a single printed page, hiding the navigation bar and Website footer.
4. THE Brochure_Page SHALL include a "Print Brochure" button that triggers the browser's print dialog.
5. THE Brochure_Page SHALL be readable as a standalone web page for digital sharing, with the same layout visible on-screen.

---

### Requirement 19: Tournament Format and Schedule Data

**User Story:** As an Admin, I want all match duration calculations and schedule data to be accurately reflected on the Website, so that teams and visitors have correct timing expectations.

#### Acceptance Criteria

1. THE Schedule_Page SHALL document Format Option 1 timings: 8 overs × 4 min/over = 32 min per innings, 2 innings = 64 min, innings break = 10 min, total match duration = 74 minutes.
2. THE Schedule_Page SHALL document Format Option 2 timings: 6 overs × 4 min/over = 24 min per innings, 2 innings = 48 min, innings break = 8 min, total match duration = 56 minutes.
3. THE Schedule_Page SHALL display Day 1 schedule feasibility: 12 pool matches ÷ 3 pitches = 4 rounds; with 30-minute breaks between rounds, Format Option 1 ends at approximately 3:26 PM and Format Option 2 ends at approximately 2:14 PM.
4. THE Schedule_Page SHALL display Day 2 schedule: both Semi-finals start at 9:00 AM in parallel (Pitches 1 and 2); 30-minute break follows; Final starts at approximately 10:45 AM; closing ceremony 12:00–1:00 PM.
5. THE About_Page SHALL state that 3 pitches are available enabling 3 matches to run simultaneously.

---

### Requirement 20: Equipment and Budget Information

**User Story:** As an Admin, I want the Website to transparently communicate budget estimates and entry fee rationale, so that teams trust the financial structure of the tournament.

#### Acceptance Criteria

1. THE Contact_Page SHALL display the entry fee range of $100–$125 per team and state that 8 registered teams will collectively cover the estimated total tournament budget of approximately $1,000.
2. THE About_Page OR a dedicated FAQ section SHALL list the budget breakdown: Trophies & medals ~$300, Balls & tape ~$250, Water/snacks ~$200, Printing ~$150, Miscellaneous ~$100, Total ~$1,000.
3. THE About_Page SHALL note that tapballs (Bratla Pro or AAProTools brand) and cricket tape (AAProTools White Tape) will be sourced from Amazon or CricketBestBuy, with an estimated ball budget of $150–$200 (30–40 balls at ~$4–5 each) and tape budget of $60–$80 (3–4 packs of 10 rolls at ~$15–20 per pack).
4. THE Sponsors_Page SHALL note that sponsor contributions reduce or eliminate the team entry fee burden.

---

### Requirement 21: Print CSS for Printable Sections

**User Story:** As an Admin or Team captain, I want to print the rulebook, invitation letters, and brochure as clean documents, so that I have professional physical copies for distribution and ceremonies.

#### Acceptance Criteria

1. THE Website SHALL include a dedicated print stylesheet (or `@media print` block) that, when any printable Page (Rules, Invitation Letters, Brochure) is printed, hides the navigation bar, footer, countdown timer, and all interactive elements.
2. WHEN the Rules_Page is printed, THE Print_CSS SHALL render the rulebook content in a single-column, black-and-white-friendly layout on US Letter paper with legible font size (minimum 11pt).
3. WHEN the Invitation_Page is printed, THE Print_CSS SHALL render only the selected letter template content, formatted as a standard business letter with margins of at least 1 inch on all sides.
4. WHEN the Brochure_Page is printed, THE Print_CSS SHALL render the brochure content within a single US Letter portrait page, with the event logo, key details, and sponsor section clearly visible.
5. THE Website SHALL include a visible "Print" button on each printable Page that calls `window.print()` via an inline JavaScript event handler.

---

### Requirement 22: Countdown Timer Correctness

**User Story:** As a Visitor, I want the Countdown Timer on the Home page to always show an accurate remaining time, so that I can track how long until the tournament begins.

#### Acceptance Criteria

1. THE Countdown_Timer SHALL calculate the remaining time by subtracting the current client local time (converted to Eastern Time) from the target datetime of 2026-07-04T09:00:00-04:00 (9:00 AM EDT).
2. THE Countdown_Timer SHALL update its displayed days, hours, minutes, and seconds values once per second using a JavaScript `setInterval` call.
3. WHEN the current datetime equals or exceeds the target datetime, THE Countdown_Timer SHALL stop counting and display a static message (e.g., "The Tournament Has Begun!") instead of negative values.
4. FOR ALL valid current datetimes before the target, THE Countdown_Timer SHALL display non-negative integer values for days, hours (0–23), minutes (0–59), and seconds (0–59).
5. WHEN a Visitor reloads the Home_Page, THE Countdown_Timer SHALL re-initialize from the correct current time without displaying a flash of incorrect values.

---

### Requirement 23: Points Table Calculation Correctness

**User Story:** As a Visitor, I want the Points Table to correctly reflect pool standings, so that I know which teams qualify for the knockout stage.

#### Acceptance Criteria

1. THE Points_Table SHALL assign 2 points for a Win, 1 point each for a No Result, and 0 points for a Loss for every completed pool match.
2. THE Points_Table SHALL calculate Net Run Rate (NRR) as: (total runs scored by the team across all pool matches ÷ total overs faced) minus (total runs conceded ÷ total overs bowled against).
3. WHEN two or more teams are tied on points in the same Pool, THE Points_Table SHALL rank the tied teams first by NRR (higher NRR = higher position), then by head-to-head match result, then by coin toss (noted as manual tiebreaker by Admin).
4. THE Points_Table SHALL always display exactly 4 team rows per Pool, sorted by descending points then descending NRR.
5. WHEN all 6 pool matches in a Pool are completed, THE Points_Table SHALL visually identify the top 2 teams as qualified for Semi-finals.

---

### Requirement 24: Form Validation Correctness

**User Story:** As a Team captain, I want the registration form to validate my input before submission, so that I do not accidentally send incomplete or malformed data.

#### Acceptance Criteria

1. THE Registration_Form SHALL validate that the Team Name field is non-empty and contains at least 2 characters before submission.
2. THE Registration_Form SHALL validate that the Captain Email field matches a standard email pattern (contains `@` and a valid domain segment) before submission.
3. THE Registration_Form SHALL validate that the Number of Players field contains an integer value between 9 and 11 inclusive before submission.
4. IF any required field fails validation, THEN THE Registration_Form SHALL display a specific error message adjacent to the failing field without clearing other already-valid field values.
5. WHEN all required fields pass validation, THE Registration_Form SHALL enable the submit action and direct the submission to a configured mailto link or Formspree endpoint.
6. FOR ALL combinations of valid inputs across all required fields, THE Registration_Form SHALL accept the submission without displaying any validation error.

---

### Requirement 25: Sponsorship Tier Display Correctness

**User Story:** As a potential Sponsor, I want the sponsorship information to be clearly structured and accurate, so that I can make an informed commitment.

#### Acceptance Criteria

1. THE Sponsors_Page SHALL display sponsorship tiers in strict descending order of contribution level: Title ($500+) first, then Gold ($250+), then Silver ($100+), then Community (in-kind).
2. THE Sponsors_Page SHALL display each tier's minimum contribution threshold and benefit list without mixing benefits between tiers.
3. WHEN a Title Sponsor is confirmed, THE Home_Page hero section SHALL display the Title Sponsor's logo or name prominently within the hero banner area.
4. THE Sponsors_Page SHALL ensure the total of all displayed benefit items for a lower tier is a subset of (or equal to) the benefit items for all higher tiers where applicable.

---

### Requirement 26: Schedule Round-Robin Completeness

**User Story:** As a tournament organizer, I want the schedule to include the correct and complete set of round-robin fixtures, so that no team is accidentally scheduled for more or fewer matches than intended.

#### Acceptance Criteria

1. THE Schedule_Page SHALL display exactly 6 pool matches per Pool (Pool A: 6 fixtures, Pool B: 6 fixtures, total 12 fixtures) for a 4-team round-robin where each pair of teams meets exactly once.
2. THE Schedule_Page SHALL ensure each of the 4 teams in a Pool appears in exactly 3 fixtures within that Pool's round-robin draw.
3. THE Schedule_Page SHALL organize the 12 pool matches across exactly 4 rounds, with each round containing at most 3 simultaneous matches (one per pitch), such that no team plays more than once per round.
4. THE Schedule_Page SHALL display exactly 2 Semi-final matches and 1 Final match in the Day 2 knockout schedule.

---

## Non-Functional Requirements Summary

| Category | Requirement |
|---|---|
| Hosting | GitHub Pages compatible, no server-side code |
| Technology | HTML5, Bootstrap 5, CSS3, vanilla JS only |
| Responsiveness | Mobile-first, 320px minimum viewport support |
| Accessibility | WCAG 2.1 Level AA color contrast, semantic HTML, keyboard nav |
| Performance | Images ≤200 KB, scripts deferred, FCP within 3s on broadband |
| Print Support | @media print CSS for Rules, Invitation Letters, Brochure |
| Independence Day Theme | Red (#BF0A30), White (#FFFFFF), Blue (#002868) palette |
| Browsers | Chrome 110+, Firefox 110+, Safari 15+, Edge 110+ |
| Pages | 12 HTML pages (Home, About, Schedule, Teams, Rules, Standings, Awards, Sponsors, Gallery, Contact, Invitation, Brochure) |
| Content State | Pre-event placeholders; Admin-updated post-event for standings, photos, award winners |
