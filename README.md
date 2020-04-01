# git-push-no-verify

A simple console tool to bypass husky check on `git push`.

The tool automatically runs `git push` with `--set-upstream` param when needed.

## Installation

```bash
$ npm install --global git-push-no-verify
```

## Usage

Instead of running `git push`, run

```bash
$ gpn
```
