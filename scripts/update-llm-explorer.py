#!/usr/bin/env python3
"""Rebuild public/data/llm-models.json from live OpenRouter + Aug 2026 leaderboards.

Sources (as of 2026-08-15):
  - OpenRouter /api/v1/models (live list prices + context)
  - Artificial Analysis Intelligence Index v4.1.1 (headline max/high only)
  - Arena text leaderboard (arena.ai, 2026-08-12) and WebDev coding ranks
  - Curated open-weight extras (Sarvam, Param2, Gemma 4 12B, Llama 3.1 405B, …)
"""

from __future__ import annotations

import copy
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "data" / "llm-models.json"
OR_CACHE = Path("/tmp/or-models.json")

INR = 95.4
TODAY = "2026-08-15"

US_LAB = {
    "soc2_type2": True,
    "gdpr_compliant": True,
    "hipaa_eligible": True,
    "data_residency": ["US", "EU"],
    "data_used_for_training": "API data not used for training by default (opt-out / ZDR available)",
    "enterprise_sso": True,
    "audit_logs": True,
    "dpdp_act_notes": "No India-resident inference by default. Use DPA + region controls.",
    "security_certifications": ["SOC 2 Type II"],
}
GOOGLE_SEC = {
    **US_LAB,
    "data_residency": ["US", "EU", "Asia (Singapore, Mumbai)"],
    "data_used_for_training": "Free tier may be used for training. Paid API: not used for training.",
}
CN_API = {
    "soc2_type2": False,
    "gdpr_compliant": False,
    "hipaa_eligible": False,
    "data_residency": ["China"],
    "data_used_for_training": "Unclear — Chinese data laws apply. Self-host open weights when possible.",
    "enterprise_sso": False,
    "audit_logs": False,
    "dpdp_act_notes": "Data may be processed in China. Self-host in India for DPDP control.",
    "security_certifications": [],
}
OPEN_W = {
    "soc2_type2": False,
    "gdpr_compliant": False,
    "hipaa_eligible": False,
    "data_residency": ["Self-hosted"],
    "data_used_for_training": "N/A — open weights. Self-host for full control.",
    "enterprise_sso": False,
    "audit_logs": False,
    "dpdp_act_notes": "Self-host in India for full DPDP compliance.",
    "security_certifications": [],
}
XAI_SEC = {
    "soc2_type2": False,
    "gdpr_compliant": False,
    "hipaa_eligible": False,
    "data_residency": ["US"],
    "data_used_for_training": "Check current ToS. Prompts above 200K tokens rebill at 2x on Grok 4.6.",
    "enterprise_sso": False,
    "audit_logs": False,
    "dpdp_act_notes": "US-hosted. Limited public compliance certifications.",
    "security_certifications": [],
}
IN_OPEN = {
    **OPEN_W,
    "data_residency": ["India", "Self-hosted"],
    "dpdp_act_notes": "Trained in India. Self-host or use India-region API for DPDP control.",
}

# Headline AA Intelligence Index v4.1.1 (max/high). Do not mix effort variants.
AA = {
    "claude-opus-5": 63,
    "claude-fable-5": 62,
    "grok-4-6": 61,
    "gpt-5-6-sol": 61,
    "kimi-k3": 60,
    "qwen3-8-max": 58,
    "qwen3-8-2-4t-a95b": 58,
    "muse-spark-1-2": 57,
    "gpt-5-6-terra": 57,
    "gemini-3-7-flash": 56,
    "grok-4-5": 56,
    "claude-sonnet-5": 55,
    "deepseek-v4-pro-0813": 53,
    "glm-5-2": 53,
    "gpt-5-6-luna": 52,
    "deepseek-v4-flash-0731": 52,
    "gemini-3-6-flash": 52,
    "gemini-3-1-pro-preview": 48,
    "gemini-3-5-flash": 47,
    "minimax-m3": 45,
    "deepseek-v4-pro": 45,
    "kimi-k2-7-code": 43,
    "mimo-v2-5-pro": 43,
    "inkling": 42,
    "hy3": 42,
    "nex-n2-pro": 42,
    "solar-pro4": 42,
    "inkling-small": 41,
    "qwen3-7-plus": 39,
    "nemotron-3-ultra-550b-a55b": 38,
    "mimo-v2-5": 38,
    "ling-3-0-flash": 38,
    "qwen3-6-27b": 38,
    "gemini-3-5-flash-lite": 37,
    "grok-4-3": 37,
    "muse-glimmer-30b": 35,
    "glm-5": 35,
    "qwen3-5-397b-a17b": 34,
    "longcat-2-0": 34,
    "qwen3-5-122b-a10b": 33,
    "qwen3-6-35b-a3b": 32,
    "o3": 31,
    "mistral-medium-3-5": 30,
    "claude-haiku-4-5": 30,
    "gemma-4-31b-it": 30,
    "deepseek-v4-flash": 29,
    "gemma-4-26b-a4b-it": 26,
    "nemotron-3-super-120b-a12b": 26,
    "gpt-oss-120b": 24,
    "nemotron-3-5-lightning": 24,
    "command-a": 23,
    "qwen3-coder-next": 21,
    "mistral-small-2603": 20,
    "qwen3-next-80b-a3b-instruct": 17,
    "mistral-large-2512": 16,
    "gpt-oss-20b": 15,
    "llama-4-maverick": 14,
    "llama-4-scout": 10,
    "sarvam-105b": 12,
    "sarvam-30b": 6,
}

# Arena text rank (arena.ai 2026-08-12). Lower is better. Best SKU rank only.
ARENA = {
    "claude-fable-5": 1,
    "claude-opus-4-6": 2,
    "claude-opus-4-7": 3,
    "muse-spark-1-2": 4,
    "claude-opus-5": 7,
    "qwen3-8-max": 8,
    "gemini-3-7-flash": 9,
    "muse-spark-1-1": 11,
    "kimi-k3": 12,
    "gemini-3-1-pro-preview": 14,
    "gemini-3-pro-preview": 15,
    "gemini-3-6-flash": 16,
    "gpt-5-5": 17,
    "claude-opus-4-8": 18,
    "gpt-5-6-sol": 19,
    "gemini-3-5-flash": 20,
    "gpt-5-4": 22,
    "gpt-5-2": 23,
    "grok-4-20": 24,
    "qwen3-7-max": 26,
    "claude-sonnet-4-6": 31,
    "glm-5-2": 33,
    "claude-opus-4-5": 35,
    "grok-4-5": 36,
    "mimo-v2-5-pro": 38,
    "glm-5-1": 39,
    "gpt-5-6-terra": 43,
    "grok-4-6": 44,
    "claude-sonnet-5": 45,
    "kimi-k2-6": 46,
    "qwen3-7-plus": 49,
    "deepseek-v4-pro": 51,
    "gemini-3-5-flash-lite": 52,
    "glm-5": 53,
    "hy3": 54,
    "gemma-4-31b-it": 60,
    "kimi-k2-5": 61,
    "gpt-5-6-luna": 62,
    "claude-opus-4-1": 68,
    "gemini-2-5-pro": 70,
    "minimax-m3": 72,
    "inkling": 75,
    "qwen3-5-397b-a17b": 76,
    "gemma-4-26b-a4b-it": 80,
    "deepseek-v4-flash": 85,
    "mimo-v2-5": 88,
    "o3": 92,
    "mistral-medium-3-5": 96,
    "muse-glimmer-30b": 99,
    "deepseek-v3-2": 101,
    "deepseek-r1-0528": 109,
    "qwen3-5-122b-a10b": 116,
    "minimax-m2-7": 118,
    "mistral-large-2512": 120,
    "claude-haiku-4-5": 125,
    "gemini-2-5-flash": 129,
    "qwen3-next-80b-a3b-instruct": 139,
    "deepseek-r1": 142,
    "minimax-m2-5": 151,
    "o4-mini": 152,
    "qwen3-coder": 157,
    "solar-pro4": 167,
    "qwen3-235b-a22b": 170,
    "gemma-3-27b-it": 178,
    "nemotron-3-super-120b-a12b": 183,
    "gpt-oss-120b": 192,
    "qwen3-32b": 201,
    "command-a": 189,
}

ARENA_CODING = {
    "claude-opus-5": 1,
    "kimi-k3": 2,
    "qwen3-8-max": 3,
    "grok-4-6": 5,
    "claude-fable-5": 6,
    "gpt-5-6-sol": 7,
    "claude-opus-4-8": 11,
}

# Official list prices when they differ from a random OpenRouter route.
PRICE = {
    "claude-opus-5": (5.0, 25.0, 0.5, 2.5, 12.5),
    "claude-fable-5": (10.0, 50.0, 1.0, 5.0, 25.0),
    "claude-sonnet-5": (2.0, 10.0, 0.2, 1.0, 5.0),
    "claude-opus-4-8": (5.0, 25.0, 0.5, 2.5, 12.5),
    "claude-opus-4-7": (5.0, 25.0, 0.5, 2.5, 12.5),
    "claude-opus-4-6": (5.0, 25.0, 0.5, 2.5, 12.5),
    "claude-opus-4-5": (5.0, 25.0, 0.5, 2.5, 12.5),
    "claude-sonnet-4-6": (3.0, 15.0, 0.3, 1.5, 7.5),
    "claude-haiku-4-5": (1.0, 5.0, 0.1, 0.5, 2.5),
    "gpt-5-6-sol": (5.0, 30.0, 0.5, 2.5, 15.0),
    "gpt-5-6-terra": (1.0, 6.0, 0.1, 0.5, 3.0),
    "gpt-5-6-luna": (0.10, 0.60, 0.02, 0.05, 0.30),
    "gpt-5-5": (5.0, 30.0, 0.5, 2.5, 15.0),
    "gpt-5-5-pro": (30.0, 180.0, 3.0, 15.0, 90.0),
    "grok-4-6": (2.0, 6.0, 0.50, None, None),
    "grok-4-5": (2.0, 6.0, 0.50, None, None),
    "gemini-3-7-flash": (0.375, 1.875, None, 0.188, 0.938),
    "kimi-k3": (3.0, 15.0, 0.30, None, None),
}

PROVIDER = {
    "anthropic": ("Anthropic", "US", "anthropic"),
    "openai": ("OpenAI", "US", "openai"),
    "google": ("Google", "US", "google"),
    "x-ai": ("xAI", "US", "xai"),
    "meta-llama": ("Meta", "US", "meta"),
    "meta": ("Meta", "US", "meta"),
    "deepseek": ("DeepSeek", "CN", "deepseek"),
    "qwen": ("Alibaba", "CN", "alibaba"),
    "moonshotai": ("Kimi", "CN", "kimi"),
    "z-ai": ("Z AI", "CN", "z-ai"),
    "mistralai": ("Mistral", "FR", "mistral"),
    "nvidia": ("NVIDIA", "US", "nvidia"),
    "amazon": ("Amazon", "US", "amazon"),
    "cohere": ("Cohere", "CA", "cohere"),
    "minimax": ("MiniMax", "CN", "minimax"),
    "bytedance-seed": ("ByteDance", "CN", "bytedance"),
    "thinkingmachines": ("Thinking Machines", "US", "thinking-machines"),
    "upstage": ("Upstage", "KR", "upstage"),
    "inclusionai": ("InclusionAI", "CN", "inclusionai"),
    "meituan": ("Meituan", "CN", "meituan"),
    "liquid": ("Liquid AI", "US", "liquid"),
    "poolside": ("Poolside", "US", "poolside"),
    "sakana": ("Sakana", "JP", "sakana"),
    "kwaipilot": ("KwaiKAT", "CN", "kwaikat"),
    "xiaomi": ("Xiaomi", "CN", "xiaomi"),
    "tencent": ("Tencent", "CN", "tencent"),
    "stepfun": ("StepFun", "CN", "stepfun"),
    "ibm-granite": ("IBM", "US", "ibm"),
    "arcee-ai": ("Arcee AI", "US", "arcee"),
    "nousresearch": ("Nous Research", "US", "nous"),
    "perplexity": ("Perplexity", "US", "perplexity"),
    "aion-labs": ("Aion Labs", "US", "aion"),
    "nex-agi": ("Nex AGI", "CN", "nex-agi"),
    "rekaai": ("Reka", "US", "reka"),
    "microsoft": ("Microsoft", "US", "microsoft"),
    "allenai": ("Allen AI", "US", "allenai"),
    "ai21": ("AI21", "IL", "ai21"),
    "baidu": ("Baidu", "CN", "baidu"),
    "deepcogito": ("Deep Cogito", "US", "deepcogito"),
    "relace": ("Relace", "US", "relace"),
    "morph": ("Morph", "US", "morph"),
    "inception": ("Inception", "US", "inception"),
    "sarvam": ("Sarvam", "IN", "sarvam"),
    "bharatgen": ("BharatGen", "IN", "bharatgen"),
}

OPEN_PROVIDERS = {
    "meta-llama",
    "deepseek",
    "qwen",
    "moonshotai",
    "z-ai",
    "nvidia",
    "mistralai",
    "nousresearch",
    "allenai",
    "ibm-granite",
    "inclusionai",
    "xiaomi",
    "tencent",
    "stepfun",
    "arcee-ai",
    "liquid",
    "ai21",
    "deepcogito",
    "sarvam",
    "bharatgen",
}

OPEN_ID_RE = re.compile(
    r"gpt-oss|gemma-|llama-|qwen3|qwen2|glm-|kimi-|deepseek-|nemotron|"
    r"olmo-|phi-|granite-|hermes-|command-a|mistral-nemo|mixtral|"
    r"ministral|mistral-small|mistral-large-2512|devstral|ling-|ring-|"
    r"hy3|mimo-|longcat|trinity|intellect|apertus|exaone|sarvam|param2|"
    r"minimax-m",
    re.I,
)

SKIP_PREFIX = {"openrouter", "thedrummer", "sao10k"}
SKIP_ID = re.compile(
    r":free|:batch|:thinking|~|/auto|gpt-chat-latest|safeguard|"
    r"-image(?:-|$)|lyria|gpt-audio|voxtral|llama-guard|"
    r"customtools|aion-rp|embedding|whisper|moderation|"
    r"gpt-3\.5|gpt-4-turbo|gpt-4$|o1-pro|o1$|o3-mini|"
    r"gemini-2\.5-pro-preview|gemini-3-flash-preview|"
    r"gemini-3\.1-flash-lite-preview|gemini-3\.1-pro-preview-custom|"
    r"qwen3\.5-plus-202|qwen3\.5-plus-02|qwen3\.5-flash-02|"
    r"qwen-plus-2025|qwen3-max-thinking|"
    r"-fast$|gpt-5\.6-.*-pro$|gpt-5\.2-chat|gpt-5\.2-pro|"
    r"gpt-4o-2024|gpt-4o-mini-2024|"
    r"claude-3-haiku|relace-|morph-|mercury-2",
    re.I,
)

FAMILY_HINTS = [
    (r"claude", "Claude"),
    (r"gpt-5\.6|gpt-5-6", "GPT-5.6"),
    (r"gpt-5\.5|gpt-5-5", "GPT-5.5"),
    (r"gpt-5\.4|gpt-5-4", "GPT-5.4"),
    (r"gpt-5\.3|gpt-5-3", "GPT-5.3"),
    (r"gpt-5\.2|gpt-5-2", "GPT-5.2"),
    (r"gpt-5\.1|gpt-5-1", "GPT-5.1"),
    (r"gpt-oss", "gpt-oss"),
    (r"gpt-4o", "GPT-4o"),
    (r"gpt-4\.1", "GPT-4.1"),
    (r"^o3|^o4", "o-series"),
    (r"gemini", "Gemini"),
    (r"gemma", "Gemma"),
    (r"grok", "Grok"),
    (r"llama", "Llama"),
    (r"muse", "Muse"),
    (r"qwen", "Qwen"),
    (r"deepseek", "DeepSeek"),
    (r"kimi", "Kimi"),
    (r"glm", "GLM"),
    (r"mistral|ministral|mixtral|codestral|devstral", "Mistral"),
    (r"nemotron", "Nemotron"),
    (r"minimax", "MiniMax"),
    (r"command", "Command"),
    (r"nova", "Nova"),
    (r"sarvam", "Sarvam"),
    (r"olmo", "OLMo"),
    (r"phi-", "Phi"),
]


def blended(inp, out):
    if inp is None or out is None:
        return None
    return round(inp * 0.75 + out * 0.25, 4)


def budget(inp):
    if inp is None:
        return "self_host"
    if inp <= 0.5:
        return "bootstrapped"
    if inp <= 1.5:
        return "seed"
    if inp <= 4:
        return "series_a"
    return "enterprise"


def value_score(aa, blend):
    if not aa or not blend or blend <= 0:
        return None
    return round(aa / blend, 2)


def completeness(m):
    keys = [
        "input_price_per_mtok",
        "output_price_per_mtok",
        "context_window",
        "aa_intelligence_index",
        "arena_elo_overall",
        "one9_summary",
        "release_date",
    ]
    n = sum(1 for k in keys if m.get(k) not in (None, "", []))
    return round(100.0 * n / len(keys), 1)


def slugify(or_id: str) -> str:
    last = or_id.split("/")[-1]
    last = last.split(":")[0]
    return last.replace(".", "-").lower()


NAME_FIX = {
    "R1": "DeepSeek R1",
    "R1 0528": "DeepSeek R1 0528",
    "R1 Distill Llama 70B": "DeepSeek R1 Distill Llama 70B",
    "GLM 5.2": "GLM-5.2",
    "GLM 5.1": "GLM-5.1",
    "GLM 5": "GLM-5",
}


def clean_name(name: str) -> str:
    if ": " in name:
        name = name.split(": ", 1)[1]
    name = re.sub(r"\s*\((batch|free|preview)\)\s*$", "", name, flags=re.I)
    name = name.strip()
    return NAME_FIX.get(name, name)


def family_of(slug: str, name: str) -> str:
    blob = f"{slug} {name}".lower()
    for pat, fam in FAMILY_HINTS:
        if re.search(pat, blob):
            return fam
    return name.split()[0]


def is_open(or_id: str, hf: str | None, license_hint: str | None) -> bool:
    org = or_id.split("/")[0]
    if org in OPEN_PROVIDERS and "muse-spark" not in or_id:
        if org == "qwen" and re.search(r"max(?!-)|plus|flash", or_id) and "qwen3.8-2.4t" not in or_id:
            # Qwen Max/Plus/Flash API SKUs are usually proprietary; open siblings have HF ids.
            return bool(hf) and "Qwen/" in (hf or "")
        if org == "mistralai" and re.search(r"medium|saba|large-2407|large$", or_id):
            return False
        if org == "google" and "gemma" not in or_id:
            return False
        if org == "meta" and "muse-spark" in or_id:
            return False
        return True
    if hf:
        return True
    if OPEN_ID_RE.search(or_id):
        if "muse-spark" in or_id:
            return False
        if re.search(r"qwen3\.[5-8]-(max|plus|flash)", or_id):
            return False
        return True
    return False


def security_for(country: str, open_w: bool, provider: str):
    if country == "IN":
        return copy.deepcopy(IN_OPEN)
    if open_w:
        return copy.deepcopy(OPEN_W if country != "US" else {**OPEN_W, "data_residency": ["Self-hosted"]})
    if provider == "Google":
        return copy.deepcopy(GOOGLE_SEC)
    if provider == "xAI":
        return copy.deepcopy(XAI_SEC)
    if country == "CN":
        return copy.deepcopy(CN_API)
    return copy.deepcopy(US_LAB)


def caps_from_or(row: dict) -> dict:
    params = set(row.get("supported_parameters") or [])
    arch = row.get("architecture") or {}
    ins = [x.lower() for x in (arch.get("input_modalities") or [])]
    reasoning = row.get("reasoning") or {}
    return {
        "function_calling": "tools" in params,
        "structured_output": "structured_outputs" in params or "response_format" in params,
        "vision": "image" in ins,
        "web_search": None,
        "code_execution": None,
        "mcp": None,
        "audio_input": "audio" in ins,
        "video_input": "video" in ins,
        "reasoning": bool(reasoning) or "reasoning" in params or "include_reasoning" in params,
        "streaming": True,
        "batch_api": None,
        "computer_use": None,
    }


def should_skip(or_id: str, row: dict) -> bool:
    org = or_id.split("/")[0]
    if org in SKIP_PREFIX or org.startswith("~"):
        return True
    if SKIP_ID.search(or_id):
        return True
    arch = row.get("architecture") or {}
    outs = [x.lower() for x in (arch.get("output_modalities") or ["text"])]
    if "text" not in outs:
        return True
    if outs == ["image", "text"] or outs == ["text", "image"]:
        # image generators that also emit text captions
        if re.search(r"image|lyria|flux|dall", or_id, re.I):
            return True
    pricing = row.get("pricing") or {}
    try:
        if float(pricing.get("prompt") or 0) < 0:
            return True
    except (TypeError, ValueError):
        pass
    return False


def load_openrouter() -> list[dict]:
    if not OR_CACHE.exists():
        req = urllib.request.Request(
            "https://openrouter.ai/api/v1/models",
            headers={"User-Agent": "one9founders-llm-explorer/1.0"},
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            OR_CACHE.write_bytes(resp.read())
    data = json.loads(OR_CACHE.read_text())
    return data.get("data") or []


def param_display(name: str, slug: str, hf: str | None) -> tuple[int | None, str]:
    blob = f"{name} {slug} {hf or ''}"
    moe = re.search(r"(\d+(?:\.\d+)?)[Tt]\s*(?:MoE|A\d+)?|(\d+)b-a(\d+)b", blob, re.I)
    if re.search(r"2\.8t|2-8t|2\.4t|2-4t", blob, re.I):
        if "2.8" in blob or "2-8" in blob:
            return None, "2.8T MoE"
        return None, "2.4T MoE"
    m = re.search(r"(\d+(?:\.\d+)?)[Bb](?:-a(\d+)[Bb])?", blob)
    if m:
        total = float(m.group(1))
        active = m.group(2)
        count = int(total) if total >= 1 else None
        if active:
            return count, f"{int(total)}B MoE ({active}B active)"
        if total >= 1:
            return int(total), f"{int(total)}B" if total == int(total) else f"{total}B"
        return None, f"{total}B"
    return None, "Unknown"


EDITORIAL = {
    "claude-opus-5": {
        "one9_summary": "Anthropic's July 2026 flagship. Artificial Analysis #1 (Intelligence 63). Same $5/$25 as Opus 4.8, with a Fast mode at 2×. Leads Arena WebDev. Best default for serious coding agents if you can afford frontier rates.",
        "one9_best_for": ["autonomous coding agents", "computer use", "complex knowledge work"],
        "one9_not_great_for": ["high-volume cheap inference", "bootstrapped token budgets"],
        "one9_verdict": "The model to beat in August 2026 — if budget allows.",
        "one9_value_rating": "good",
        "startup_recommendation": "Use for agentic coding and hard reasoning; route routine tokens to Sonnet 5 or Luna.",
        "tags": ["frontier", "coding", "agents", "mcp"],
        "use_cases": ["coding", "agents", "research"],
        "pricing_notes": "Fast mode is ~2.5× quicker at 2× the base price.",
        "tier": "frontier",
    },
    "claude-fable-5": {
        "one9_summary": "Anthropic's writing and knowledge-work ceiling at $10/$50. #1 on Arena text (Aug 12). Worth it for long-form and research; too expensive as a default workhorse.",
        "one9_best_for": ["long-form writing", "research synthesis", "knowledge work"],
        "one9_not_great_for": ["production inference at scale", "latency-sensitive chat"],
        "one9_verdict": "Best writer on the board. Not the value pick.",
        "one9_value_rating": "fair",
        "startup_recommendation": "Reserve for writing/research; use Opus 5 or Sonnet 5 for volume.",
        "tags": ["frontier", "writing", "expensive"],
        "use_cases": ["writing", "research"],
        "tier": "frontier",
    },
    "claude-sonnet-5": {
        "one9_summary": "The Claude workhorse for 2026. Intelligence 55 at $2/$10 — a third of Opus 5 — with 1M context. Default production Claude for most startups.",
        "one9_best_for": ["production chat", "coding copilots", "document workflows"],
        "one9_not_great_for": ["absolute frontier reasoning", "ultra-cheap batch jobs"],
        "one9_verdict": "Best Claude for day-to-day product work.",
        "one9_value_rating": "good",
        "startup_recommendation": "Default Claude SKU for most Indian series-A stacks.",
        "tags": ["workhorse", "coding"],
        "use_cases": ["coding", "chat", "agents"],
        "tier": "frontier",
    },
    "gpt-5-6-sol": {
        "one9_summary": "OpenAI's July 2026 flagship. Intelligence 61, tied with Grok 4.6, at $5/$30. Strongest LiveBench math/reasoning crown. Prompts above ~272K input bill at 2×.",
        "one9_best_for": ["hard reasoning", "math/science", "ChatGPT-aligned UX"],
        "one9_not_great_for": ["cost-sensitive volume", "long prompts without watching the surcharge"],
        "one9_verdict": "OpenAI's current frontier. Pricey vs Grok 4.6 for the same AA score.",
        "one9_value_rating": "fair",
        "startup_recommendation": "Use Sol for hard tasks; Terra/Luna for volume.",
        "tags": ["frontier", "reasoning", "chatgpt"],
        "use_cases": ["reasoning", "chat", "coding"],
        "pricing_notes": ">272K input tokens billed at 2× input and 1.5× output.",
        "tier": "frontier",
    },
    "gpt-5-6-terra": {
        "one9_summary": "Mid GPT-5.6 tier. Intelligence 57 at $1/$6 — the practical OpenAI production model. Faster than Sol, much cheaper, still agent-capable.",
        "one9_best_for": ["production agents", "coding copilots", "high-throughput OpenAI stacks"],
        "one9_not_great_for": ["absolute hardest reasoning"],
        "one9_verdict": "Best OpenAI SKU for most startups.",
        "one9_value_rating": "excellent",
        "startup_recommendation": "Default OpenAI model unless you need Sol's ceiling.",
        "tags": ["workhorse", "value"],
        "use_cases": ["coding", "agents", "chat"],
        "tier": "near-frontier",
    },
    "gpt-5-6-luna": {
        "one9_summary": "Cheapest GPT-5.6. ~$0.10/$0.60 with Intelligence ~52 — Gemini Flash / DeepSeek Flash band at OpenAI-shaped tooling.",
        "one9_best_for": ["high-volume classification", "cheap tool calling", "bootstrapped OpenAI stacks"],
        "one9_not_great_for": ["frontier coding agents", "long agentic jobs"],
        "one9_verdict": "The OpenAI bargain bin, still actually smart.",
        "one9_value_rating": "excellent",
        "startup_recommendation": "Best OpenAI option for bootstrapped volume.",
        "tags": ["budget", "fast", "india-affordable"],
        "use_cases": ["classification", "extraction", "chat"],
        "has_free_tier": True,
        "tier": "strong",
    },
    "grok-4-6": {
        "one9_summary": "August 12 post-training refresh of Grok 4.5. Intelligence 61, tying GPT-5.6 Sol, at $2/$6. Watch the 200K-token 2× rebill trap.",
        "one9_best_for": ["agentic jobs on a budget", "frontier quality without Sol prices"],
        "one9_not_great_for": ["prompts over 200K tokens", "enterprise compliance-heavy workloads"],
        "one9_verdict": "Best frontier value in August 2026.",
        "one9_value_rating": "excellent",
        "startup_recommendation": "Serious alternative to Opus 5 / Sol when compliance allows.",
        "tags": ["frontier", "value", "new"],
        "use_cases": ["agents", "chat", "coding"],
        "pricing_notes": "Prompts ≥200K tokens rebill the entire request at $4/$12.",
        "tier": "frontier",
    },
    "gemini-3-7-flash": {
        "one9_summary": "Fastest frontier-adjacent Flash. Intelligence 56 at $0.375/$1.875 and ~300 tok/s. Mumbai residency available. Google default for speed + multimodal.",
        "one9_best_for": ["low-latency chat", "multimodal apps", "India-region Google stacks"],
        "one9_not_great_for": ["max intelligence", "strict US-only data residency"],
        "one9_verdict": "Best speed/intelligence blend on Google right now.",
        "one9_value_rating": "excellent",
        "startup_recommendation": "Strong default for Indian startups already on GCP.",
        "tags": ["fast", "multimodal", "value", "india-affordable"],
        "use_cases": ["chat", "multimodal", "agents"],
        "has_free_tier": True,
        "tier": "near-frontier",
    },
    "kimi-k3": {
        "one9_summary": "Largest open-weight model released (2.8T MoE). Highest open-weight AA score (60). #2 Arena WebDev. API $3/$15; self-host is a multi-node job under the Kimi K3 License, not MIT.",
        "one9_best_for": ["open-weight coding frontier", "agentic coding", "self-host when you can afford the cluster"],
        "one9_not_great_for": ["laptop inference", "simple MIT licensing", "DPDP-sensitive SaaS without self-hosting"],
        "one9_verdict": "Open-weight king on quality. Operationally heavy.",
        "one9_value_rating": "good",
        "startup_recommendation": "Use the API for experiments; only self-host if you already run multi-node GPUs.",
        "tags": ["open-weights", "coding", "frontier", "moe"],
        "use_cases": ["coding", "agents"],
        "tier": "frontier",
        "parameter_display": "2.8T MoE (104B active)",
        "license": "Kimi K3 License",
    },
    "deepseek-v4-flash-0731": {
        "one9_summary": "July 31 post-train of V4-Flash. MIT 284B/13B MoE at $0.14/$0.28, Intelligence ~52. Artificial Analysis's cheapest $ per index task among current models.",
        "one9_best_for": ["bootstrapped production inference", "high-volume MIT self-host", "price/performance"],
        "one9_not_great_for": ["enterprise certifications", "DPDP without self-hosting"],
        "one9_verdict": "The August 2026 price-performance pick.",
        "one9_value_rating": "excellent",
        "startup_recommendation": "Best default for Indian bootstrapped backends if China-hosted API is acceptable, else self-host.",
        "tags": ["open-weights", "budget", "moe", "india-affordable"],
        "use_cases": ["coding", "chat", "batch"],
        "tier": "near-frontier",
        "license": "MIT",
        "parameter_display": "284B MoE (13B active)",
    },
    "deepseek-v4-pro-0813": {
        "one9_summary": "August 13 DeepSeek V4 Pro snapshot. Intelligence 53 at $0.44/$0.87 on OpenRouter — cheaper than the base Pro card for the same band.",
        "one9_best_for": ["latest DeepSeek Pro via OpenRouter", "open-weight production"],
        "one9_not_great_for": ["floating 'latest' without evals"],
        "one9_verdict": "Use if you want the newest Pro weights cheaply.",
        "one9_value_rating": "excellent",
        "startup_recommendation": "Pin a snapshot in prod; don't float latest without evals.",
        "tags": ["open-weights", "coding", "snapshot"],
        "use_cases": ["coding", "chat"],
        "license": "MIT",
        "tier": "near-frontier",
    },
    "glm-5-2": {
        "one9_summary": "MIT open-weight, Intelligence 53, Arena ~#33. Strong SWE-Pro reporting. $0.63–$1.19 / $1.98–$3.74 depending on route. Top-tier open coder beside Kimi K3 and DeepSeek.",
        "one9_best_for": ["open-weight coding", "MIT self-host", "SWE agents"],
        "one9_not_great_for": ["Western enterprise procurement"],
        "one9_verdict": "Top-tier open coder at a fair API price.",
        "one9_value_rating": "excellent",
        "startup_recommendation": "Shortlist with DeepSeek V4 and Kimi K3 for open stacks.",
        "tags": ["open-weights", "coding", "mit"],
        "use_cases": ["coding", "agents"],
        "license": "MIT",
        "tier": "near-frontier",
    },
    "qwen3-8-max": {
        "one9_summary": "Alibaba's 2.4T multimodal flagship, GA August 3. Intelligence 58, Arena text #8. Flat $2/$6 across 1M context. Open weights for the A95B sibling; Max itself is the API SKU.",
        "one9_best_for": ["multimodal at frontier-adjacent quality", "long context at flat price"],
        "one9_not_great_for": ["DPDP without Alibaba Cloud region review"],
        "one9_verdict": "Serious multimodal frontier from Alibaba.",
        "one9_value_rating": "good",
        "startup_recommendation": "Use if you already run on Alibaba Cloud; otherwise Grok 4.6 is simpler globally.",
        "tags": ["frontier", "multimodal", "moe"],
        "use_cases": ["multimodal", "chat", "agents"],
        "tier": "frontier",
        "parameter_display": "2.4T MoE (~95B active)",
    },
    "qwen3-8-2-4t-a95b": {
        "one9_summary": "Open-weight Qwen3.8 2.4T A95B. Same Intelligence 58 as Max at $2/$6. The weights NVIDIA documented for GB300 NVL72 serving.",
        "one9_best_for": ["open-weight Qwen3.8 self-host", "high-throughput Qwen"],
        "one9_not_great_for": ["laptop inference"],
        "one9_verdict": "The open-weight sibling of Qwen3.8 Max.",
        "one9_value_rating": "good",
        "startup_recommendation": "Self-host only with datacenter GPUs; otherwise use the Max API.",
        "tags": ["open-weights", "frontier", "moe"],
        "use_cases": ["chat", "multimodal"],
        "license": "Apache 2.0",
        "tier": "frontier",
        "parameter_display": "2.4T MoE (95B active)",
    },
    "muse-spark-1-2": {
        "one9_summary": "Meta's August 5 API model (not Llama). Intelligence ~57 at $1.25/$4.25. Arena #4 (xHigh). Contributor tier $0.10/$0.20 trains on prompts.",
        "one9_best_for": ["terminal coding agents", "mid-price Meta API"],
        "one9_not_great_for": ["zero-training-data contracts on Contributor tier"],
        "one9_verdict": "Interesting Meta API play; read the Contributor ToS.",
        "one9_value_rating": "good",
        "startup_recommendation": "Use full-price tier unless you explicitly accept training on prompts.",
        "tags": ["coding", "agents", "meta"],
        "use_cases": ["coding", "agents"],
        "pricing_notes": "Contributor tier $0.10/$0.20 trains on prompts.",
        "tier": "near-frontier",
        "license": "Proprietary",
    },
    "sarvam-105b": {
        "one9_summary": "India's flagship open-weight MoE (105B total, 10.3B active), trained from scratch in India under the IndiaAI mission. Apache 2.0. Strong Indic-language coverage (22 official languages). AA ~12 — not a global frontier model, but the sovereign default for Indic + DPDP-sensitive work.",
        "one9_best_for": ["Indic languages", "India-sovereign / DPDP stacks", "government and public-sector apps"],
        "one9_not_great_for": ["frontier English coding agents", "multimodal"],
        "one9_verdict": "The Indian open-weight model to actually evaluate.",
        "one9_value_rating": "good",
        "startup_recommendation": "Shortlist for Hindi/Indic products and any stack that must stay in India.",
        "tags": ["open-weights", "india", "indic", "sovereign", "apache"],
        "use_cases": ["indic", "chat", "government"],
        "tier": "capable",
        "license": "Apache 2.0",
        "parameter_display": "105B MoE (10.3B active)",
    },
    "sarvam-30b": {
        "one9_summary": "Sarvam's smaller India-trained MoE (30B / 2.4B active). Powers Samvaad. Apache 2.0, 32K context. The laptop-to-single-GPU Indic option.",
        "one9_best_for": ["on-device / single-GPU Indic chat", "low-latency India deployments"],
        "one9_not_great_for": ["long-context agents (use 105B)", "frontier English coding"],
        "one9_verdict": "Practical Indic workhorse if 105B is too big.",
        "one9_value_rating": "good",
        "startup_recommendation": "Start here for Indic chat; step up to 105B for harder reasoning.",
        "tags": ["open-weights", "india", "indic", "apache"],
        "use_cases": ["indic", "chat"],
        "tier": "capable",
        "license": "Apache 2.0",
        "parameter_display": "30B MoE (2.4B active)",
    },
    "llama-4-maverick": {
        "one9_summary": "Meta's 2025 Llama 4 flagship MoE (400B / 17B active). Intelligence 14 — no longer frontier, still a widely deployed open-weight production model with a Llama Community license.",
        "one9_best_for": ["existing Llama 4 stacks", "self-host multimodal"],
        "one9_not_great_for": ["new greenfield vs Kimi K3 / DeepSeek V4 / Qwen3.8"],
        "one9_verdict": "Still useful; superseded on quality by 2026 open-weight labs.",
        "one9_value_rating": "fair",
        "startup_recommendation": "Keep if already integrated; evaluate Kimi K3 or DeepSeek V4 for new work.",
        "tags": ["open-weights", "llama", "moe"],
        "use_cases": ["chat", "multimodal"],
        "license": "Llama Community",
        "tier": "capable",
        "parameter_display": "400B MoE (17B active)",
    },
    "gpt-oss-120b": {
        "one9_summary": "OpenAI's Apache-2.0 open weights (Aug 2025). Intelligence 24, very cheap API (~$0.03/$0.17) and permissive license. Fast, not frontier.",
        "one9_best_for": ["permissive-license self-host", "high-throughput bounded tasks"],
        "one9_not_great_for": ["hard reasoning", "agentic coding"],
        "one9_verdict": "The Western Apache open-weight default.",
        "one9_value_rating": "good",
        "startup_recommendation": "Use when you need Apache-2.0 and OpenAI-shaped tooling, not max IQ.",
        "tags": ["open-weights", "apache", "budget"],
        "use_cases": ["chat", "batch"],
        "license": "Apache 2.0",
        "tier": "capable",
    },
}


def apply_editorial(m: dict) -> None:
    ed = EDITORIAL.get(m["slug"])
    if not ed:
        return
    for k, v in ed.items():
        if k == "has_free_tier":
            m[k] = v
        else:
            m[k] = v


def apply_price(m: dict) -> None:
    slug = m["slug"]
    if slug in PRICE:
        inp, out, cached, binp, bout = PRICE[slug]
        m["input_price_per_mtok"] = inp
        m["output_price_per_mtok"] = out
        m["cached_input_price"] = cached
        m["batch_input_price"] = binp
        m["batch_output_price"] = bout
    inp, out = m.get("input_price_per_mtok"), m.get("output_price_per_mtok")
    b = blended(inp, out)
    m["blended_price_per_mtok"] = b
    m["price_inr_per_mtok"] = None if b is None else round(b * INR, 2)
    m["india_budget_tier"] = budget(inp)
    m["value_score"] = value_score(m.get("aa_intelligence_index"), b)


def assign_tier(m: dict) -> None:
    if m.get("tier") in {"frontier", "near-frontier"} and m.get("aa_intelligence_index"):
        return
    aa = m.get("aa_intelligence_index") or 0
    arena = m.get("arena_elo_overall")
    if aa >= 58 or (arena is not None and arena <= 8):
        m["tier"] = "frontier"
    elif aa >= 50 or (arena is not None and arena <= 20):
        m["tier"] = "near-frontier"
    elif aa >= 30 or (arena is not None and arena <= 50):
        m["tier"] = "strong"
    elif aa >= 12 or m.get("input_price_per_mtok") is not None:
        m["tier"] = "capable"
    else:
        m["tier"] = "unranked"


def auto_summary(m: dict) -> str:
    bits = [f"{m['name']} from {m['provider']}."]
    if m["model_type"] == "open-weights":
        bits.append(f"Open weights ({m.get('license') or 'see card'}).")
    else:
        bits.append("Proprietary API model.")
    if m.get("context_window"):
        ctx = m["context_window"]
        bits.append(f"{ctx // 1000}K context." if ctx < 1_000_000 else f"{ctx / 1_000_000:.1f}M context.")
    if m.get("input_price_per_mtok") is not None:
        bits.append(f"${m['input_price_per_mtok']}/${m['output_price_per_mtok']} per 1M tokens.")
    if m.get("aa_intelligence_index"):
        bits.append(f"Artificial Analysis Intelligence {m['aa_intelligence_index']}.")
    if m.get("arena_elo_overall"):
        bits.append(f"Arena text #{m['arena_elo_overall']}.")
    return " ".join(bits)


def auto_tags(m: dict) -> list[str]:
    tags = []
    if m["model_type"] == "open-weights":
        tags.append("open-weights")
    if m.get("is_reasoning"):
        tags.append("reasoning")
    if m.get("capabilities", {}).get("vision"):
        tags.append("vision")
    ctx = m.get("context_window") or 0
    if ctx >= 500_000:
        tags.append("long-context")
    if (m.get("input_price_per_mtok") or 99) <= 0.5:
        tags.append("india-affordable")
        tags.append("budget")
    if m.get("country") == "IN":
        tags.append("india")
        tags.append("indic")
    if m.get("aa_intelligence_index") and m["aa_intelligence_index"] >= 55:
        tags.append("frontier")
    if m.get("arena_elo_coding") and m["arena_elo_coding"] <= 10:
        tags.append("top-coder")
    return tags[:6]


LINKS = {
    "Anthropic": {
        "api_docs": "https://docs.anthropic.com/en/docs/about-claude/models",
        "provider": "https://www.anthropic.com/pricing",
        "try_it": "https://console.anthropic.com",
    },
    "OpenAI": {
        "api_docs": "https://platform.openai.com/docs/models",
        "provider": "https://openai.com/api/pricing",
        "try_it": "https://platform.openai.com/playground",
    },
    "Google": {
        "api_docs": "https://ai.google.dev/gemini-api/docs/models",
        "provider": "https://ai.google.dev/pricing",
        "try_it": "https://aistudio.google.com",
    },
    "xAI": {
        "api_docs": "https://docs.x.ai",
        "provider": "https://x.ai",
        "try_it": "https://grok.x.ai",
    },
    "DeepSeek": {
        "api_docs": "https://api-docs.deepseek.com",
        "provider": "https://api-docs.deepseek.com/quick_start/pricing",
        "try_it": "https://chat.deepseek.com",
    },
    "Kimi": {
        "api_docs": "https://platform.moonshot.ai/docs",
        "provider": "https://www.moonshot.ai",
        "try_it": "https://kimi.moonshot.cn",
    },
    "Sarvam": {
        "api_docs": "https://docs.sarvam.ai",
        "provider": "https://www.sarvam.ai",
        "try_it": "https://www.sarvam.ai",
    },
}


def make_base(**kwargs) -> dict:
    inp = kwargs.get("input_price_per_mtok")
    out = kwargs.get("output_price_per_mtok")
    b = blended(inp, out)
    slug = kwargs["slug"]
    open_w = kwargs.get("model_type", "proprietary") == "open-weights"
    m = {
        "slug": slug,
        "name": kwargs["name"],
        "model_family": kwargs.get("model_family") or family_of(slug, kwargs["name"]),
        "provider": kwargs["provider"],
        "provider_slug": kwargs.get("provider_slug", kwargs["provider"].lower().replace(" ", "-")),
        "model_type": kwargs.get("model_type", "proprietary"),
        "is_reasoning": kwargs.get("is_reasoning", False),
        "tier": kwargs.get("tier", "unranked"),
        "parameter_count": kwargs.get("parameter_count"),
        "parameter_display": kwargs.get("parameter_display", "Unknown"),
        "architecture": kwargs.get("architecture", "Transformer"),
        "release_date": kwargs.get("release_date"),
        "country": kwargs.get("country", "US"),
        "license": kwargs.get("license", "Apache 2.0" if open_w else "Proprietary"),
        "context_window": kwargs.get("context_window"),
        "max_output_tokens": kwargs.get("max_output_tokens"),
        "input_price_per_mtok": inp,
        "output_price_per_mtok": out,
        "cached_input_price": kwargs.get("cached_input_price"),
        "batch_input_price": kwargs.get("batch_input_price"),
        "batch_output_price": kwargs.get("batch_output_price"),
        "blended_price_per_mtok": b,
        "price_inr_per_mtok": None if b is None else round(b * INR, 2),
        "has_free_tier": kwargs.get("has_free_tier", False),
        "capabilities": kwargs.get("capabilities")
        or {
            "function_calling": None,
            "structured_output": None,
            "vision": None,
            "web_search": None,
            "code_execution": None,
            "mcp": None,
            "audio_input": None,
            "video_input": None,
            "reasoning": kwargs.get("is_reasoning", False),
            "streaming": True,
            "batch_api": None,
            "computer_use": None,
        },
        "modalities_input": kwargs.get("modalities_input", ["text"]),
        "modalities_output": kwargs.get("modalities_output", ["text"]),
        "aa_intelligence_index": AA.get(slug),
        "arena_elo_overall": ARENA.get(slug),
        "arena_elo_coding": ARENA_CODING.get(slug),
        "arena_elo_math": None,
        "arena_elo_creative": None,
        "benchmarks": {},
        "performance": {
            "output_tokens_per_sec": kwargs.get("tps"),
            "time_to_first_token_sec": kwargs.get("ttft"),
        },
        "value_score": value_score(AA.get(slug), b),
        "openrouter_rank": None,
        "hf_model_id": kwargs.get("hf_model_id"),
        "hf_downloads": kwargs.get("hf_downloads"),
        "links": kwargs.get("links") or {},
        "india_budget_tier": budget(inp),
        "data_completeness": 0,
        "data_sources": kwargs.get("data_sources", ["openrouter", "pricing", "metadata"]),
        "last_updated": TODAY,
        "one9_summary": kwargs.get("one9_summary"),
        "one9_best_for": kwargs.get("one9_best_for", []),
        "one9_not_great_for": kwargs.get("one9_not_great_for", []),
        "one9_verdict": kwargs.get("one9_verdict"),
        "one9_value_rating": kwargs.get("one9_value_rating"),
        "startup_recommendation": kwargs.get("startup_recommendation"),
        "security": kwargs.get("security")
        or security_for(kwargs.get("country", "US"), open_w, kwargs["provider"]),
        "india_availability": kwargs.get(
            "india_availability",
            "Self-host in India" if open_w else "API available globally",
        ),
        "use_cases": kwargs.get("use_cases", []),
        "data_tier": kwargs.get("data_tier", "tier2"),
        "tags": kwargs.get("tags", []),
        "pricing_notes": kwargs.get("pricing_notes"),
    }
    apply_editorial(m)
    apply_price(m)
    if not m.get("one9_summary"):
        m["one9_summary"] = auto_summary(m)
    if not m.get("tags"):
        m["tags"] = auto_tags(m)
    assign_tier(m)
    if m.get("aa_intelligence_index") or m.get("arena_elo_overall") or m.get("one9_verdict"):
        m["data_tier"] = "tier1"
    elif m.get("input_price_per_mtok") is not None:
        m["data_tier"] = "tier2"
    else:
        m["data_tier"] = "tier3"
    m["data_completeness"] = completeness(m)
    if isinstance(m.get("parameter_count"), str):
        m["parameter_count"] = None
    return m


def from_openrouter(row: dict) -> dict | None:
    or_id = row.get("id") or ""
    if should_skip(or_id, row):
        return None
    org = or_id.split("/")[0]
    if org not in PROVIDER:
        return None
    provider, country, pslug = PROVIDER[org]
    slug = slugify(or_id)
    name = clean_name(row.get("name") or slug)
    hf = row.get("hugging_face_id") or None
    open_w = is_open(or_id, hf, None)
    # Muse Spark is Meta proprietary API
    if "muse-spark" in or_id:
        open_w = False
        country = "US"
    pricing = row.get("pricing") or {}
    try:
        inp = round(float(pricing.get("prompt") or 0) * 1e6, 4) or None
        out = round(float(pricing.get("completion") or 0) * 1e6, 4) or None
        cached = pricing.get("input_cache_read")
        cached = round(float(cached) * 1e6, 4) if cached else None
    except (TypeError, ValueError):
        inp = out = cached = None
    if inp == 0:
        inp = None
    if out == 0:
        out = None
    created = row.get("created")
    release = None
    if created:
        release = datetime.fromtimestamp(created, tz=timezone.utc).date().isoformat()
    arch = row.get("architecture") or {}
    ins = [x.lower() for x in (arch.get("input_modalities") or ["text"])]
    outs = [x.lower() for x in (arch.get("output_modalities") or ["text"])]
    pcount, pdisp = param_display(name, slug, hf)
    reasoning = bool(row.get("reasoning")) or "reasoning" in (row.get("supported_parameters") or [])
    links = dict(LINKS.get(provider) or {})
    if hf:
        links["huggingface"] = f"https://huggingface.co/{hf}"
    license_ = "Proprietary"
    if open_w:
        if "llama" in or_id:
            license_ = "Llama Community"
        elif "kimi-k3" in or_id:
            license_ = "Kimi K3 License"
        elif "gemma" in or_id:
            license_ = "Gemma / Apache 2.0"
        elif any(x in or_id for x in ("deepseek", "glm", "gpt-oss", "olmo", "qwen3", "granite")):
            license_ = "Apache 2.0" if "glm" not in or_id and "deepseek" not in or_id else (
                "MIT" if "deepseek" in or_id or "glm" in or_id else "Apache 2.0"
            )
        else:
            license_ = "Open weights"
    top = row.get("top_provider") or {}
    return make_base(
        slug=slug,
        name=name,
        provider=provider,
        provider_slug=pslug,
        model_type="open-weights" if open_w else "proprietary",
        is_reasoning=reasoning,
        parameter_count=pcount,
        parameter_display=pdisp,
        release_date=release,
        country=country,
        license=license_,
        context_window=row.get("context_length"),
        max_output_tokens=top.get("max_completion_tokens"),
        input_price_per_mtok=inp,
        output_price_per_mtok=out,
        cached_input_price=cached,
        capabilities=caps_from_or(row),
        modalities_input=ins,
        modalities_output=outs,
        hf_model_id=hf,
        links=links,
        data_sources=["openrouter", "pricing", "arena", "benchmarks"],
        security=security_for(country, open_w, provider),
    )


EXTRAS = [
    dict(
        slug="sarvam-105b",
        name="Sarvam 105B",
        provider="Sarvam",
        provider_slug="sarvam",
        model_type="open-weights",
        is_reasoning=True,
        parameter_count=105,
        parameter_display="105B MoE (10.3B active)",
        release_date="2026-03-06",
        country="IN",
        license="Apache 2.0",
        context_window=128000,
        hf_model_id="sarvamai/sarvam-105b",
        links={
            "huggingface": "https://huggingface.co/sarvamai/sarvam-105b",
            "provider": "https://www.sarvam.ai",
            "api_docs": "https://docs.sarvam.ai",
            "paper": "https://www.sarvam.ai/blogs/sarvam-30b-105b",
        },
        data_sources=["huggingface", "provider", "benchmarks"],
    ),
    dict(
        slug="sarvam-30b",
        name="Sarvam 30B",
        provider="Sarvam",
        provider_slug="sarvam",
        model_type="open-weights",
        is_reasoning=True,
        parameter_count=30,
        parameter_display="30B MoE (2.4B active)",
        release_date="2026-03-06",
        country="IN",
        license="Apache 2.0",
        context_window=32000,
        hf_model_id="sarvamai/sarvam-30b",
        links={
            "huggingface": "https://huggingface.co/sarvamai/sarvam-30b",
            "provider": "https://www.sarvam.ai",
            "api_docs": "https://docs.sarvam.ai",
        },
        data_sources=["huggingface", "provider"],
    ),
    dict(
        slug="param2",
        name="Param2",
        provider="BharatGen",
        provider_slug="bharatgen",
        model_type="open-weights",
        is_reasoning=False,
        parameter_count=17,
        parameter_display="17B MoE (~2.4B active)",
        release_date="2026-01-15",
        country="IN",
        license="Open weights",
        context_window=32000,
        one9_summary="IndiaAI-supported BharatGen MoE (~17B / 2.4B active). Public-sector Indic model. Limited public English/coding benchmarks versus Sarvam 105B.",
        one9_best_for=["public-sector Indic pilots", "IndiaAI ecosystem"],
        one9_not_great_for=["frontier coding", "production English agents"],
        one9_verdict="Evaluate beside Sarvam; thinner public evals.",
        one9_value_rating="fair",
        startup_recommendation="Prefer Sarvam 105B unless you are already on BharatGen/Param2.",
        tags=["open-weights", "india", "indic", "government"],
        use_cases=["indic", "government"],
        links={"provider": "https://aikosh.indiaai.gov.in"},
        data_sources=["provider"],
    ),
    dict(
        slug="gemma-4-12b-it",
        name="Gemma 4 12B IT",
        provider="Google",
        provider_slug="google",
        model_type="open-weights",
        is_reasoning=True,
        parameter_count=12,
        parameter_display="12B",
        release_date="2026-04-02",
        country="US",
        license="Apache 2.0",
        context_window=262144,
        hf_model_id="google/gemma-4-12b-it",
        one9_summary="Mid-size Gemma 4 instruct. Apache-2.0, 256K context. The practical single-GPU Gemma 4 when 31B is too big.",
        one9_best_for=["local multimodal", "Apache self-host"],
        one9_not_great_for=["frontier agents"],
        one9_verdict="Solid local Gemma. Prefer 31B if you have the VRAM.",
        one9_value_rating="good",
        startup_recommendation="Good on-device / workstation default in the Gemma 4 family.",
        tags=["open-weights", "gemma", "local"],
        use_cases=["chat", "local"],
        links={"huggingface": "https://huggingface.co/google/gemma-4-12b-it", "provider": "https://ai.google.dev"},
        data_sources=["huggingface", "benchmarks"],
    ),
    dict(
        slug="llama-3-1-405b",
        name="Llama 3.1 405B",
        provider="Meta",
        provider_slug="meta",
        model_type="open-weights",
        is_reasoning=False,
        parameter_count=405,
        parameter_display="405B",
        release_date="2024-07-23",
        country="US",
        license="Llama Community",
        context_window=128000,
        hf_model_id="meta-llama/Llama-3.1-405B-Instruct",
        one9_summary="The 2024 open-weight dense giant. Still widely hosted. Superseded on quality by Llama 4 and 2026 MoEs, but the license and ecosystem remain useful.",
        one9_best_for=["existing 405B infra", "dense-model fine-tunes"],
        one9_not_great_for=["new greenfield (use Llama 4 or 2026 MoEs)"],
        one9_verdict="Legacy open giant. Don't start new work here.",
        one9_value_rating="fair",
        startup_recommendation="Migrate new workloads to Llama 4 or a 2026 open MoE.",
        tags=["open-weights", "llama", "legacy"],
        use_cases=["chat"],
        links={"huggingface": "https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct"},
        data_sources=["huggingface"],
        arena_override=219,
    ),
]


def finalize(m: dict) -> dict:
    apply_editorial(m)
    m["aa_intelligence_index"] = AA.get(m["slug"], m.get("aa_intelligence_index"))
    m["arena_elo_overall"] = ARENA.get(m["slug"], m.get("arena_elo_overall"))
    m["arena_elo_coding"] = ARENA_CODING.get(m["slug"], m.get("arena_elo_coding"))
    apply_price(m)
    if not m.get("one9_summary"):
        m["one9_summary"] = auto_summary(m)
    if not m.get("tags"):
        m["tags"] = auto_tags(m)
    assign_tier(m)
    if m.get("aa_intelligence_index") or m.get("arena_elo_overall") or EDITORIAL.get(m["slug"]):
        m["data_tier"] = "tier1"
        m["data_sources"] = sorted(
            set((m.get("data_sources") or []) + ["benchmarks", "arena", "pricing"])
        )
    m["last_updated"] = TODAY
    if isinstance(m.get("parameter_count"), str):
        m["parameter_count"] = None
    for k in (
        "input_price_per_mtok",
        "output_price_per_mtok",
        "cached_input_price",
        "batch_input_price",
        "batch_output_price",
        "blended_price_per_mtok",
    ):
        if isinstance(m.get(k), float):
            m[k] = round(m[k], 4)
    m["data_completeness"] = completeness(m)
    return m


def main() -> None:
    rows = load_openrouter()
    by_slug: dict[str, dict] = {}
    skipped = 0
    for row in rows:
        m = from_openrouter(row)
        if not m:
            skipped += 1
            continue
        # Prefer the earlier (usually canonical) slug if collision
        if m["slug"] in by_slug:
            old = by_slug[m["slug"]]
            if completeness(m) > completeness(old):
                by_slug[m["slug"]] = m
        else:
            by_slug[m["slug"]] = m

    for extra in EXTRAS:
        extra = dict(extra)
        arena_override = extra.pop("arena_override", None)
        m = make_base(**extra)
        if arena_override:
            m["arena_elo_overall"] = arena_override
        if m["slug"] not in by_slug:
            by_slug[m["slug"]] = m

    models = [finalize(m) for m in by_slug.values()]
    models.sort(
        key=lambda m: (
            m.get("arena_elo_overall") or 999,
            -(m.get("aa_intelligence_index") or 0),
            m["name"],
        )
    )

    tier_counts = {"tier1": 0, "tier2": 0, "tier3": 0}
    for m in models:
        tier_counts[m.get("data_tier") or "tier3"] += 1

    open_n = sum(1 for m in models if m["model_type"] == "open-weights")
    data = {
        "metadata": {
            "total_models": len(models),
            "tier1_count": tier_counts["tier1"],
            "tier2_count": tier_counts["tier2"],
            "tier3_count": tier_counts["tier3"],
            "last_updated": TODAY,
            "inr_rate": INR,
            "open_weights_count": open_n,
        },
        "quick_picks": {
            "best_overall": {
                "slug": "claude-opus-5",
                "name": "Claude Opus 5",
                "reason": "AA #1 (63) and Arena WebDev #1",
            },
            "best_value": {
                "slug": "grok-4-6",
                "name": "Grok 4.6",
                "reason": "Intelligence 61 at $2/$6",
            },
            "best_for_code": {
                "slug": "claude-opus-5",
                "name": "Claude Opus 5",
                "reason": "#1 Arena WebDev",
            },
            "best_for_indian_startups": {
                "slug": "deepseek-v4-flash-0731",
                "name": "DeepSeek V4 Flash 0731",
                "reason": "Intelligence ~52 at $0.14/$0.28, MIT",
            },
            "best_open_source": {
                "slug": "kimi-k3",
                "name": "Kimi K3",
                "reason": "Highest open-weight AA (60), 2.8T MoE",
            },
            "cheapest": {
                "slug": "mistral-nemo",
                "name": "Mistral Nemo",
                "reason": "$0.02/$0.03 per 1M — cheapest widely hosted chat model",
            },
        },
        "models": models,
    }
    SRC.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(
        f"wrote {len(models)} models (open={open_n}) "
        f"tier1={tier_counts['tier1']} tier2={tier_counts['tier2']} tier3={tier_counts['tier3']} "
        f"skipped_or={skipped}"
    )


if __name__ == "__main__":
    main()
