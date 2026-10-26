# Browser regression checks

Run the app and use a test plan. The automated Node tests use a mocked model; separately verify a real Ollama generation. Use a separate browser profile or local test port when testing storage failures so personal records stay intact.

## Keyboard focus

1. Generate a plan. Tab to the first step's completion button and press Enter.
2. The progress changes and focus stays on that button. In the browser console, this assertion must pass:

```js
console.assert(document.activeElement.id === 'step-check-0', 'Completion must preserve keyboard focus');
```

3. Tab to another unfinished step's focus button and press Enter. For step 2:

```js
console.assert(document.activeElement.id === 'step-focus-1', 'Selecting a focus step must preserve keyboard focus');
```

4. Create a second plan, select the first plan with the keyboard, and confirm focus remains on its history button.

## Clock, storage, errors and layout

- Start a timer, reload after a few seconds and confirm it continues from the deadline. Pause it and confirm the display stays fixed. Reset restores the selected step's duration.
- Complete a step, reload and confirm it stays complete. Complete all steps and then undo one.
- With the model unavailable or returning invalid JSON, the previous plan and form input remain, the error is visible and the generate button becomes usable again.
- Model text containing HTML must be displayed as text; it must not create elements inside the step list.
- Compare desktop and 390px layouts before and after a CSS cleanup. At 320px, 760px and 1000px, check for horizontal overflow. Hover/focus states and reduced-motion settings must remain usable.
- Verify the normal screen contains no technical-status copy; a real connection error must still be visible.
