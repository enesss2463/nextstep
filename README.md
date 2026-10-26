# NextStep ⚡

A local AI planning and focus app: turn an overwhelming task into achievable steps, focus on one, and keep your progress.

## Run locally

Requires Node.js 22+ and [Ollama](https://ollama.com/). No npm dependencies or API keys.

```sh
ollama pull llama3.2
ollama serve
```

If Ollama is already running, skip `ollama serve`. In a second terminal, in this folder:

```sh
npm start
```

Open **http://127.0.0.1:4173**. To stop NextStep, press Ctrl+C in its terminal. Windows users can also double-click `start.cmd` after starting Ollama.

## What it does

- Real local inference using `llama3.2:latest`, not canned plans.
- Turkish task input and 3–6 actionable steps, constrained to a 5–120 minute budget.
- Focus timer with pause/reset and wall-clock recovery after tab suspension or reload.
- Manual step completion and saved plans in the same browser.
- Electric blue/violet interface, keyboard controls and responsive layout.

Tasks stay on the local machine. The server binds only to 127.0.0.1; it does not expose your model on your network. Plans are stored in this browser's localStorage, not encrypted or synced. Clearing browser data removes them. Use one tab for editing: a second tab detects changed data and pauses saving to avoid overwrites.

The local model's quality and speed depend on hardware. Read and judge suggested steps; they are suggestions, not proof the task is complete. First inference may load the model and take longer. A model failure shows an error and preserves the previous plan. No synthetic success fallback is used.

## Verify

```sh
npm test
```

Tests use Node's built-in runner. They cover input validation, exact time allocation, invalid model output, timer behavior, persisted state and HTTP security/error boundaries. The HTTP integration test uses an explicitly mocked model, separate from live-model/browser verification.

## Demo recording outline (under 3 minutes)

1. Explain the problem: knowing a goal but struggling to start.
2. Enter a task and choose 25 minutes. Generate a real plan.
3. Pick a step and start/pause its focus timer.
4. Mark a step done and reload to show saved progress.
5. Briefly show `devpost/scope.md`, `devpost/prd.md`, and `devpost/spec.md`.

The interface is Turkish; include English narration/subtitles for the Devpost submission. A public source repository and public video link are still required. Local operation does not replace those requirements.

## Project map

- `server.mjs`: local HTTP server and Ollama request.
- `plan.mjs`: input/output validation and minute allocation.
- `public/app.js`: screen interactions, timer and storage.
- `public/core.js`: state validation and clock calculation.
- `public/style.css`: electric visual design.
- `devpost/`: planning documents created with the Devpost Learn Skill Pack.

Created for Build With AI: Basics with Codex assistance. The Devpost curriculum was installed from [challengepost/learn-ai-basics](https://github.com/challengepost/learn-ai-basics); its files retain their original attribution. New application code is MIT licensed.
