#!/usr/bin/env python3
"""Classify remaining open-source 'other' tools via OpenAI. Key from env only."""
from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.request
from collections import Counter

API = os.environ.get("NEXT_PUBLIC_API_URL", "https://api.one9founders.com")
MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
OUT = "src/data/openSourceLaneOverrides.json"
OTHERS_CACHE = "/tmp/other-tools.json"

ALLOWED = [
    "local-models",
    "agents",
    "rag",
    "chat-ui",
    "coding",
    "image-media",
    "training",
    "prompts-workflows",
    "llm-apis",
    "frameworks",
    "eval",
    "security",
    "writing-docs",
    "data-ops",
    "infra",
    "research",
    "experiments",
    "hardware",
    "directories",
]

LANE_GUIDE = """
local-models: run/serve LLMs locally (ollama, gguf, inference engines)
agents: autonomous agents, computer-use, multi-agent orchestration
rag: retrieval, embeddings, vector DBs, knowledge bases
chat-ui: chat frontends, messaging bots, conversational clients
coding: coding assistants, CLIs, IDEs, repo/git developer tools
image-media: image/video/audio/voice/vision/diffusion
training: fine-tuning, training frameworks, datasets for training
prompts-workflows: prompt packs, templates, automation workflows
llm-apis: API gateways, proxies, routers, MCP tooling, multi-provider APIs
frameworks: SDKs/libraries/frameworks to build GenAI apps
eval: benchmarks, evals, observability, tracing, testing quality
security: AI security, privacy, guardrails, jailbreak defense
writing-docs: writing, docs, papers, contracts, authoring
data-ops: scraping, ETL, analytics, data cleaning, browser automation
infra: databases, deploy, self-host platforms, server tooling
research: papers, tutorials, educational implementations, learning
hardware: physical devices, wearables, robots, edge hardware
directories: awesome lists, catalogs, registries, indexes of tools/models
experiments: demos, toys, games, unclear AI experiments, Show HN curiosities
""".strip()


def openai_chat(messages: list[dict], temperature: float = 0) -> str:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise SystemExit("OPENAI_API_KEY missing")
    body = json.dumps(
        {
            "model": MODEL,
            "temperature": temperature,
            "response_format": {"type": "json_object"},
            "messages": messages,
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.load(resp)
    return data["choices"][0]["message"]["content"]


def classify_batch(batch: list[dict]) -> dict[str, str]:
    payload = [
        {
            "slug": t["slug"],
            "name": t["name"],
            "short": (t.get("short") or "")[:220],
        }
        for t in batch
    ]
    prompt = f"""Classify each open-source repo into exactly one founder job lane.

LANES:
{LANE_GUIDE}

Rules:
- Pick the single best lane for what a founder would use this repo to do.
- Prefer a specific lane over experiments.
- Use experiments only for demos/toys/games/unclear curiosities.
- Use directories for awesome-lists / catalogs / registries.
- Use hardware for physical devices / robots / wearables.
- Non-AI unix utilities/languages → coding if developer tooling, else experiments.
- Return ONLY JSON object mapping slug → lane-id.
- Every input slug must appear exactly once.
- lane-id must be one of: {", ".join(ALLOWED)}

INPUT:
{json.dumps(payload, ensure_ascii=False)}"""

    text = openai_chat(
        [
            {
                "role": "system",
                "content": "You classify open-source AI repos into job lanes. Reply with JSON only.",
            },
            {"role": "user", "content": prompt},
        ]
    )
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise RuntimeError(f"No JSON: {text[:400]}")
    parsed = json.loads(match.group(0))
    out: dict[str, str] = {}
    for item in payload:
        lane = parsed.get(item["slug"])
        out[item["slug"]] = lane if lane in ALLOWED else "experiments"
    return out


def main() -> None:
    with open(OTHERS_CACHE) as f:
        others = json.load(f)
    print(f"to classify {len(others)} model {MODEL}")
    overrides: dict[str, str] = {}
    batch_size = 30
    batches = [others[i : i + batch_size] for i in range(0, len(others), batch_size)]
    for i, batch in enumerate(batches, 1):
        print(f"batch {i}/{len(batches)} ({len(batch)})...", end=" ", flush=True)
        ok = False
        for attempt in range(1, 5):
            try:
                part = classify_batch(batch)
                overrides.update(part)
                print("ok")
                ok = True
                break
            except urllib.error.HTTPError as e:
                detail = e.read().decode("utf-8", errors="replace")[:300]
                print(f"fail {attempt} HTTP {e.code} {detail}")
                time.sleep(1.5 * attempt)
            except Exception as e:
                print(f"fail {attempt} {type(e).__name__}: {e}")
                time.sleep(1.5 * attempt)
        if not ok:
            for t in batch:
                overrides[t["slug"]] = "experiments"
        time.sleep(0.15)

    counts = Counter(overrides.values())
    print("counts", dict(counts.most_common()))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(overrides, f, separators=(",", ":"))
        f.write("\n")
    print(f"wrote {OUT} {len(overrides)}")


if __name__ == "__main__":
    main()
