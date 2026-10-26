# Devpost working draft

Project name: NextStep

Tagline: Turn overwhelming tasks into small, actionable steps that fit your available time. Start a focus session, take the next step, and keep your progress.

## What it does
NextStep is a local-first task planning and focus app. Enter a goal and the time you have, generate a short plan with a real local language model, then focus on one step at a time. Mark completed steps and return to saved progress in the same browser.

## How it was built
The app uses HTML, CSS, JavaScript and a small Node.js server with no third-party npm dependencies. Ollama runs llama3.2 locally. The server validates user input and model output and allocates the plan's step durations within the chosen time budget. The browser stores plans and timer state locally. The interface uses an electric blue and violet theme.

The Devpost Learn Skill Pack was installed in the new project folder. The conversation established the chosen idea, real AI generation, local operation, and electric visual direction. Scope, product requirements, technical specification, and a build checklist were written before implementation and reviewed with the participant.

## Engineering challenges
The small local model can return weak phrasing or invalid content. The app uses structured output, explicit validation and visible errors instead of pretending a failed request succeeded. A timer based on a deadline, rather than decrementing a counter, handles background-tab throttling. Browser storage failures are surfaced without silently overwriting unreadable data.

## Current limitations
This proof of concept runs locally and keeps data in one browser. It does not sync devices. The local model may mix languages or offer imperfect advice; users should review the suggested steps.

## Participant-authored context still needed
Personal inspiration, what the participant learned, and the exit-survey answers must reflect their own experience. Public code, license and video URLs are not yet available. Do not submit fabricated links or unconfirmed eligibility declarations.
