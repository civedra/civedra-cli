#!/usr/bin/env node

const https = require('https')
const model = process.argv[3]

if (!model) {
  console.log('Usage: civedra check <model-name>')
  console.log('Example: civedra check deepseek-r1')
  process.exit(0)
}

const slug = model.toLowerCase().replace(/\s+/g, '-')

const SUPABASE_HOST = 'rhlmkjdojhjetsjjvehk.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobG1ramRvamhqZXRzamp2ZWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NTM3MzUsImV4cCI6MjA5MTUyOTczNX0.UPJ1RRGWD5GoOKg4ulzmvCEMv-BSQrt-KzC76p31yZ4'

const options = {
  hostname: SUPABASE_HOST,
  path: `/functions/v1/civedra-check?model=${encodeURIComponent(slug)}`,
  method: 'GET',
  headers: {
    'User-Agent': 'civedra-cli/1.0.0',
    'Accept': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON}`
  }
}

const req = https.request(options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    try {
      const result = JSON.parse(data)
      formatOutput(result)
    } catch (e) {
      console.error('Error parsing response')
      process.exit(3)
    }
  })
})

req.on('error', (e) => {
  console.error('CIVEDRA API error:', e.message)
  process.exit(3)
})

req.end()

function formatOutput(result) {
  const line = '━'.repeat(50)
  
  if (!result.found) {
    console.log('\nCIVEDRA: Model not found in registry.')
    console.log(`\nQueried: ${result.model_queried}`)
    console.log('\nRequest evaluation: civedra.com/certify')
    console.log('Submit via API:     civedra.com/api\n')
    process.exit(2)
  }

  const verdictIcon = {
    'AUTHORIZED': '✓',
    'CONDITIONAL': '⚠',
    'PROHIBITED': '⛔',
    'UNDER_EVALUATION': '◌',
    'RESTRICTED': '⚡'
  }[result.verdict] || '?'

  console.log(`\n${line}`)
  console.log('CIVEDRA TRUST CHECK')
  console.log(line)
  console.log(`Model:     ${result.model}`)
  console.log(`Developer: ${result.developer}`)
  console.log(`CTI Score: ${result.cti_score}/100`)
  console.log(`Verdict:   ${verdictIcon} ${result.verdict}`)
  
  if (result.verdict === 'PROHIBITED') {
    console.log(`\n!! DEPLOYMENT PROHIBITED !!`)
    console.log(`${result.ndaa_citation}`)
    console.log(`Covered nation: ${result.covered_nation_country}`)
  }

  if (result.conditions && result.conditions.length > 0) {
    console.log('\nConditions:')
    result.conditions.forEach(c => console.log(`  • ${c}`))
  }

  console.log(`\nSENTINEL (24h): ${result.sentinel_alerts_24h} alerts`)
  console.log(`Known CVEs:     ${result.known_cves}`)
  console.log(`Last evaluated: ${result.last_evaluated}`)
  console.log(`\nFull evaluation: ${result.evaluation_url}`)
  console.log(`${line}\n`)

  // Exit codes for CI/CD
  if (result.verdict === 'PROHIBITED') process.exit(1)
  if (result.verdict === 'CONDITIONAL') process.exit(1)
  if (result.verdict === 'RESTRICTED') process.exit(1)
  process.exit(0)
}
