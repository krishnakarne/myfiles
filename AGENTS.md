# Portfolio Site Agent Context

This repository hosts Krishna Karne's personal portfolio site.

## Project purpose
- Public personal portfolio for recruiters, hiring managers, and professional networking.
- Primary goal: present Krishna Karne as a strong senior-level engineer with modern frontend and platform experience.
- Hosted on Vercel and connected to a custom domain.

## Current stack
- Static HTML/CSS/JS site.
- Deployed from the `main` branch through Vercel.
- Resume PDF is stored in the repo and linked from the homepage.

## Domain and deployment
- Main domain: `karnekrishna.com` or the currently configured production custom domain in Vercel.
- Redirect domain: `karnekrishna6.com` should redirect to the main production domain.
- Preserve `vercel.json` unless intentionally updating redirect logic.
- Any push to `main` triggers production deploy in Vercel.

## Required content positioning
- Present Krishna as **Senior Engineer**, not just Senior Frontend Engineer.
- Keep React, TypeScript, .NET, Java, Angular, Node.js, UI architecture, Micro Frontends, and CI/CD represented naturally.
- GEICO is the current role and should remain first in the timeline.
- Capital One should remain below GEICO in the timeline.
- Resume download button should remain available and point to `Sai_Krishna_Karne_Resume.pdf`.

## UI and design direction
- Theme: futuristic, elegant, spaceship / control-panel inspired.
- Keep the left side navigation.
- Existing sections should generally be preserved unless explicitly requested.
- Do not remove major sections without asking.
- The radar section is intentionally decorative but now also acts as a visual role-match panel.

## Radar section rules
- Keep the radar section in place.
- Do not replace it with a separate section unless explicitly requested.
- Radar should show blinking detected targets / objects.
- Current intent: display role matches for Krishna's profile, not generic system-only text.
- Good examples: Senior Frontend Engineer, Senior Full Stack Engineer, Senior Engineer (.NET/React), Micro Frontend Engineer, UI Platform Engineer, Java/React Product Engineer.
- Future enhancements may include real live jobs, but current implementation is curated visual role matching.

## Editing rules
- Make minimal, careful edits.
- Preserve the existing visual identity unless Krishna asks for a redesign.
- Keep mobile responsiveness intact.
- Avoid breaking the download button, resume asset, or Vercel config.
- When updating copy, keep it recruiter-friendly, senior-level, and concise.

## Good future enhancements
- Real company/job matching radar targets backed by a small API or Vercel function.
- Better recruiter-focused summary.
- Projects section.
- LinkedIn-aligned professional branding updates.

## Important repo files
- `index.html` — main site.
- `Sai_Krishna_Karne_Resume.pdf` — downloadable resume.
- `vercel.json` — redirect config.
- `portfolio-notes.txt` — short deployment notes.
- `SITE_CONTEXT.md` — structured human-readable project context.

## Instruction for future agents
Before making edits:
1. Read this file.
2. Read `SITE_CONTEXT.md`.
3. Preserve the current production behavior.
4. Prefer small safe commits.
5. Keep Krishna's branding as Senior Engineer with modern frontend + platform + some backend exposure.
