# Agent Instructions

## After Editing Source Code

After making any source code changes, always verify that the following pass before considering the task complete. Continue fixing until all checks succeed.

```shell
pnpm build
pnpm lint:editorconfig
pnpm lint:eslint
```
