# Hugging Face Workspace

Use this folder as the handoff area for custom AI models that will be uploaded to Hugging Face Hub or used in a Hugging Face Space.

This folder is separate from the app runtime:

- `apps/web` never imports model files.
- `apps/server` calls hosted models through Hugging Face APIs or endpoints.
- Large model files stay out of normal GitHub commits.

## Suggested Layout

```text
huggingface/
  README.md          Model card or Space documentation
  app.py             Optional Space entrypoint
  requirements.txt   Python runtime dependencies for a Space
  artifacts/         Export outputs, ignored by GitHub
  models/            Model weights/checkpoints, ignored by GitHub
```

## Upload Notes

Keep large files in `models/` or `artifacts/`. Those paths are git-ignored in every repo (see `.gitignore`); use Git LFS or the Hugging Face CLI to ship weights.

When a model is ready, upload it through the Hugging Face CLI, Git LFS, or the Hugging Face web UI from this folder.
