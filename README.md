# ¡Habla! — building the APK entirely in the cloud (no computer/Android Studio needed)

This uses GitHub Actions: a free service that runs a full Linux computer in
the cloud for you, installs everything, builds the APK, and hands you the
file to download. Everything below can be done from your phone's browser.

---

## Step 1 — Create a GitHub account

1. Go to https://github.com in your phone's browser.
2. Tap "Sign up," create a free account (email + password).

## Step 2 — Create a new repository

1. Once logged in, tap the **+** icon (top right) then **New repository**.
2. Name it `habla-apk`.
3. Leave it Public (Private also works, doesn't matter).
4. Do NOT check "Add a README" — leave everything else default.
5. Tap **Create repository**.

## Step 3 — Upload the project files

1. On your new repo's page, tap "uploading an existing file" (a link
   shown on the empty repo page).
2. From the `habla-apk.zip` I gave you: unzip it first. On most phones,
   your Files app can long-press the zip and choose "Extract" / "Unzip" —
   this gives you a `habla-apk` folder.
3. Back in GitHub's upload page, browse and select ALL files and folders
   inside `habla-apk` (not the zip itself, and not a wrapping outer
   folder) — including the hidden `.github` folder, which contains the
   build instructions. If your phone's file picker hides folders starting
   with a dot, see the note at the very bottom of this file.
4. Scroll down, tap **Commit changes**.

This uploads everything: `src/`, `package.json`, `capacitor.config.json`,
and importantly `.github/workflows/build-apk.yml` — the file that tells
GitHub how to build the APK.

## Step 4 — Watch it build

1. As soon as your files are uploaded, GitHub automatically starts the
   build. Tap the **Actions** tab at the top of your repo.
2. You'll see a run in progress called "Build Android APK" — tap it.
3. It takes about 4 to 7 minutes. Refresh occasionally; a green checkmark
   means success, a red X means something failed (see Troubleshooting
   below).

## Step 5 — Download the APK

1. Once the run finishes with a green checkmark, scroll to the bottom of
   that run's page.
2. Under Artifacts, tap **habla-debug-apk** to download it — it comes down
   as a `.zip`.
3. Unzip it (same long-press-and-extract trick) to get `app-debug.apk`.

## Step 6 — Install it on your phone

1. Tap the `app-debug.apk` file directly in your Files app.
2. Android will ask permission to "install unknown apps" the first time —
   allow it for your Files/browser app. This is normal for any app not
   from the Play Store; it's just how sideloading works, not a red flag.
3. Tap Install. Done — it's on your home screen.

---

## What works immediately vs. what needs extra setup

| Feature | Status |
|---|---|
| Streak tracking, learned-word counts | Works, and only advances the streak when you actually practice (send a chat message, learn a flashcard, translate, generate a deck, or tap the alphabet) — not just from opening the app |
| Alphabet + flashcards + their audio | Works fully offline |
| Chat, Translate, generating a vocab deck | Needs a backend proxy first (see `server/proxy-example.js` and the setup notes in `App.jsx` near `CLAUDE_ENDPOINT`) — otherwise these three show a connection error |
| Speaking into the mic | Needs a native plugin — currently shows an explanatory message instead of pretending to work |

## Troubleshooting a red X in Actions

- Tap the failed run, tap the red step, read the error text near the
  bottom of the log. The two most common causes:
  - A file got missed during upload — go back to Step 3 and compare
    against the zip's contents.
  - A transient network hiccup on GitHub's side — tap "Re-run all jobs"
    (top right of the run page) to try again.

## Making changes later

Edit files directly on GitHub (open the file, tap the pencil/edit icon,
save) — any commit automatically re-triggers a new build. Then repeat
Steps 4 to 6 to get the updated APK.

## Note on the hidden `.github` folder

Some phone file pickers hide folders starting with a dot. If `.github`
doesn't appear when picking files to upload:
1. In your Files app, rename the folder from `.github` to `github` before
   uploading.
2. After uploading, open the file at `github/workflows/build-apk.yml` on
   GitHub's website, use its rename option to move it to
   `.github/workflows/build-apk.yml`, and commit the change.
