# Logic Reviewer Generator

A lightweight, offline-first browser app for turning Markdown question banks into a standalone HTML reviewer.

This project lets you:
- paste or import Markdown question banks
- review and edit parsed questions
- validate question content and answer formatting
- export a single-file offline reviewer HTML
- optionally use flashcard-style one-by-one review
- reveal optional additional details after a question is shown

## Features

- Import Markdown from files or paste directly into the app
- Automatically parse question blocks, options, answers, explanations, and topic headings
- Edit question metadata and answer choices in a browser-friendly editor
- Validate duplicate questions, blank choices, missing explanations, and invalid answer indexes
- Export a complete self-contained reviewer as a single HTML file
- Choose offline-friendly review settings like:
  - question shuffling
  - answer choice shuffling
  - explanation visibility
  - previous navigation
  - localStorage progress saving
  - topic display
  - one-by-one flashcard mode
  - optional reveal-after-question details

## Project files

- `index.html` — main app interface
- `styles.css` — interface styling
- `app.js` — parsing, validation, editor logic, and HTML reviewer generation

## Run locally

Because this is a static web app, you can run it in either of these ways:

### Option 1: Open directly

Open `index.html` in a browser.

### Option 2: Serve locally with a simple web server

From this project folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

## How to use

1. In the **Generate Questions with AI** section, click **Copy prompt** and fill in the subject, level, topics, and question count in your AI chat.
2. Copy the Markdown question bank returned by the AI.
3. Paste it into the app or import it as a `.md` / `.markdown` file.
4. Click **Parse Questions**.
5. Review the parsed questions in the editor and validate the bank if needed.
6. Choose your export options.
7. Click **Generate Reviewer HTML** and open the downloaded HTML file to review offline.

## Markdown format

The app expects a simple Markdown structure like this:

```md
# Logic Reviewer

## Topic: Algebra

### Question
Simplify: 2x + 3x
A. 4x
B. 5x
C. 6x
D. 7x
**Answer:** B
**Explanation:** 2x and 3x are like terms, so 2 + 3 = 5.
**Additional details:** In algebra, combining like terms requires adding coefficients.
```

You can also add multiple questions in the same file, and each question block is parsed separately.

## Important notes

- The exported reviewer is fully self-contained; it does not require a backend.
- The generated HTML is designed to run as a single offline file.
- Flashcard mode shows one question at a time and can reveal feedback immediately after an answer is submitted.
- For any question, the `Additional details` field is optional and is displayed only when enabled in the export options.

## Copy-paste prompt for an AI assistant

The app includes this prompt in its **Generate Questions with AI** section, along with a **Copy prompt** button. You can also copy it from here and use it in ChatGPT, Copilot, Claude, or another AI assistant.

```text
Create a Markdown question bank for a quiz reviewer app.

Requirements:
- Use a clean Markdown format that matches this generator.
- Include a title header using # Title.
- Use ## Topic: Topic Name for each topic section.
- Use ### Question for each question block.
- Each question must have answer choices like A. ..., B. ..., C. ..., etc.
- Include a line starting with **Answer:** and the correct answer letter or matching choice text.
- Include a line starting with **Explanation:** with a short reasoning explanation.
- Include a line starting with **Additional details:** only when you want an optional note to appear after the question is revealed.
- Keep the question wording clear and instructional.
- Use 10-20 questions total.
- Mix topic areas if appropriate, but keep the content organized by topic sections.
- Ensure the correct answer letter matches the choices exactly.
- Keep the formatting consistent and copy-paste ready.

Example format:

# Logic Reviewer

## Topic: Boolean Algebra

### Question
Which expression is equivalent to A AND (A OR B)?
A. A
B. B
C. A OR B
D. A AND B
**Answer:** A
**Explanation:** Since A AND (A OR B) simplifies to A by absorption law.
**Additional details:** The absorption law states A AND (A OR B) = A.

---

Generate the full bank now.
```

You can copy the generated Markdown directly into the app’s manual paste box or import it as a `.md` file.

## License

This project is intended for local learning and personal study use.
