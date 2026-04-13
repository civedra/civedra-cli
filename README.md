```markdown
# CIVEDRA CLI

Evaluate any AI model's trust and safety status
in under 2 seconds from your terminal.

```bash
civedra check deepseek-r1
civedra check claude-3-5-sonnet
civedra check gpt-4o
```

## Installation

```bash
npm install -g @civedra/cli
```

Requires Node.js 14 or higher.

## Usage

```bash
# Check any AI model
civedra check <model-name>

# Examples
civedra check deepseek-r1
civedra check claude-3-5-sonnet
civedra check llama-3-70b
civedra check gpt-4o
```

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CIVEDRA TRUST CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Model:     DeepSeek-R1
Developer: DeepSeek (China)
CTI Score: 12/100
Verdict:   ⛔ PROHIBITED

!! DEPLOYMENT PROHIBITED !!
NDAA FY2026 §1532 — Covered Nation: China
This model cannot be deployed in any
DoD or IC environment under current law.

Full evaluation: civedra.com/model/deepseek-r1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Exit Codes

For CI/CD pipeline integration:

| Code | Meaning |
|------|---------|
| 0 | AUTHORIZED — safe to proceed |
| 1 | PROHIBITED or CONDITIONAL — block deployment |
| 2 | Model not found in registry |
| 3 | API error |

## GitHub Actions Integration

```yaml
- name: CIVEDRA AI Model Check
  run: |
    npm install -g @civedra/cli
    civedra check ${{ env.AI_MODEL }}
```

## About

CIVEDRA is an AI Integrity and Trust Intelligence
Platform built for national security environments.
ARBITER continuously evaluates AI models for
provenance, covered-nation origin, behavioral
integrity, and NDAA §1532 compliance.

[civedra.com](https://civedra.com) |
[Trust Index](https://civedra.com/index) |
[API Docs](https://civedra.com/api)

## License

MIT — see LICENSE file.
