---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: one9founders
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Apply Web Interface Guidelines from this skill and related Next.js rules
2. Read the specified files (or prompt user for files/pattern)
3. Check against accessibility, focus, and interaction best practices
4. Output findings in the terse `file:line` format

## Guidelines Source

Apply the Web Interface Guidelines rules when reviewing UI. Prefer the latest
public Web Interface Guidelines document if one is available in context;
otherwise use the accessibility, focus, and interaction checks already covered
in this skill and the Next.js best-practice rules alongside it.

## Usage

When a user provides a file or pattern argument:
1. Read the specified files
2. Apply the guidelines from this skill
3. Output findings using a terse `file:line` format

If no files specified, ask the user which files to review.
