/**
 * Resilient linguistic and spam rule engine in JavaScript.
 * Ensures accurate misinformation, phishing, and scam detection even if the Python AI microservice is offline.
 */

const spamAndSensationalPatterns = [
  // 1. Phishing & Brand Impersonation Scams
  { regex: /\b(your\s+account\s+(has\s+been\s+)?(temporarily\s+)?(suspended|locked|restricted|flagged|closed|compromised|disabled)|unauthorized\s+(login|access|transaction)\s+(detected|attempt)|unusual\s+sign-?in\s+activity)\b/gi, cat: 'Phishing & Account Suspension', sev: 'critical', desc: 'Employs fabricated urgent security alerts to induce panic and credential surrender.', weight: 46 },
  { regex: /\b(verify\s+your\s+(account|identity|billing|card|password|ssn|credentials|details)|(reactivate|unlock)\s+your\s+account|update\s+your\s+(billing|payment|security)\s+(information|details))\b/gi, cat: 'Credential Harvesting', sev: 'critical', desc: 'Direct directive demanding verification of sensitive account or payment credentials.', weight: 45 },
  { regex: /\b(bank(\s+of\s+\w+)?|chase|wells\s+fargo|paypal|apple(\s+id)?|netflix|amazon|usps|fedex|dhl|ups|irs|tax\s+refund|social\s+security|binance|coinbase)\b.*(suspended|verify|locked|unauthorized|click\s+here|urgent|security\s+alert|claim\s+refund)/gi, cat: 'Brand Impersonation & Phishing', sev: 'critical', desc: 'Impersonates a major banking, delivery, or tech brand alongside urgent verification demands.', weight: 48 },

  // 2. Delivery & Parcel Scams
  { regex: /\b(package|parcel|shipment|delivery)\s+(could\s+not|cannot|was\s+unable\s+to)\s+be\s+delivered\s*(due\s+to|because\s+of)?\s*(an?\s+)?(incomplete|incorrect|wrong|invalid)\s+(address|zip|information)\b/gi, cat: 'Parcel Delivery Scam', sev: 'critical', desc: 'Classic delivery scam falsely claiming incomplete address to solicit payment or personal info.', weight: 46 },
  { regex: /\b(reschedule\s+your\s+delivery|pay\s+(\$|£|€)?\s*\d+(\.\d+)?\s*(redelivery|customs|shipping)\s+fee|package\s+(is\s+)?held\s+at\s+(the\s+)?(warehouse|customs))\b/gi, cat: 'Delivery Fee Scam', sev: 'critical', desc: 'Bogus courier redelivery fee notice designed to harvest credit card details.', weight: 45 },

  // 3. Lottery, Winner, Giveaway & Advance-Fee Scams
  { regex: /\b(congratulations\s*!*.*(you\s+(have\s+been\s+selected|won|are\s+the\s+winner)|claim\s+(your\s+)?(prize|reward|gift\s+card|cash|grant|reward)))\b/gi, cat: 'Lottery & Prize Scam', sev: 'critical', desc: 'Unsolicited notification asserting reader won an unentered lottery or prize.', weight: 46 },
  { regex: /\b(you\s+(have\s+)?won\s+(\$|£|€)?\s*[\d,]+\s*(dollars|pounds|euros|in\s+the\s+lottery|in\s+the\s+draw|sweepstakes)|free\s+(\$|£|€)?\s*[\d,]+\s*(gift\s+card|walmart\s+gift|amazon\s+gift|voucher))\b/gi, cat: 'Bogus Cash Giveaway', sev: 'critical', desc: 'Bogus prize or gift card lure designed to capture personal details.', weight: 45 },
  { regex: /\b(dear\s+beneficiary|next\s+of\s+kin|abandoned\s+(consignment|funds|sum|fortune)|barrister\s+\w+|diplomatic\s+courier\s+service|transfer\s+of\s+(\$|£|€)?\s*[\d,]+)\b/gi, cat: 'Advance-Fee / 419 Scam', sev: 'critical', desc: 'Classic 419 advance-fee fraud offering multi-million dollar inheritances or abandoned funds.', weight: 48 },

  // 4. Predatory Loans & Employment/Task Scams
  { regex: /\b(pre[- ]approved\s+for\s+(\$|£|€)?\s*[\d,]+\s*(personal\s+loan|business\s+loan)|instant\s+loan\s+approval|no\s+credit\s+check\s+needed|reply\s+yes\s+to\s+receive\s+funds)\b/gi, cat: 'Predatory Loan Solicitation', sev: 'critical', desc: 'Unsolicited high-value loan approval claims indicative of advance-fee loan scams.', weight: 42 },
  { regex: /\b(earn\s+(\$|£|€)?\s*\d+[\d,]*\s*[-–to]*\s*(\$|£|€)?\s*\d+[\d,]*\s*(daily|per\s+day|a\s+day|an\s+hour|per\s+hour)|daily\s+income\s+(\$|£|€)?\s*\d+)\b/gi, cat: 'Unrealistic Income Guarantee', sev: 'high', desc: 'Unrealistic daily income claims frequent in task scams and recruitment fraud.', weight: 38 },
  { regex: /\b(contact\s+(our\s+)?(manager|recruiter|hr)\s+on\s+(whatsapp|telegram)|message\s+us\s+on\s+whatsapp\s+to\s+start)\b/gi, cat: 'Off-Platform Solicitation', sev: 'high', desc: 'Redirects target to private messaging platforms to evade platform protections.', weight: 38 },

  // 5. Coercive Link Manipulation & Shortened URLs
  { regex: /\b(click\s+(here|this\s+link|below|on\s+the\s+link)\s+to\s+(claim|verify|unlock|activate|receive|get\s+started|confirm|collect|update))\b/gi, cat: 'Coercive Call-To-Action Link', sev: 'high', desc: 'Aggressive directive instructing user to follow an external hyperlink.', weight: 36 },
  { regex: /\b(https?:\/\/(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|goo\.gl|cutt\.ly|shorturl\.at|ow\.ly|rb\.gy|t\.me\/)\S+)\b/gi, cat: 'Obfuscated / Shortened Link', sev: 'high', desc: 'Contains a shortened or masked URL concealing the actual destination domain.', weight: 36 },

  // 6. Chain Letters & Carrier Giveaways
  { regex: /\b(forward\s+(this\s+)?(message|to|text)\s+to\s+\d+\s+(people|friends|groups|contacts)|send\s+to\s+\d+\s+(people|groups)|whatsapp\s+(will\s+start\s+charging|closing\s+down))\b/gi, cat: 'Viral Chain-Letter Spam', sev: 'high', desc: 'Manipulative chain forwarding instruction exploiting fear of service loss or penalties.', weight: 40 },
  { regex: /\b(free\s+recharge|free\s+\d+\s*gb\s+(data|internet)|government\s+giving\s+free\s+(laptops?|tablets?|smartphones?|recharge))\b/gi, cat: 'Government Giveaway Scam', sev: 'critical', desc: 'Bogus state or telecom giveaway scam targeting personal details.', weight: 45 },

  // 7. Sensationalism & Disinformation Tropes
  { regex: /\b(shocking|unbelievable|mind[- ]blowing|miracle cure|secret remedy)\b/gi, cat: 'Sensationalism', sev: 'high', desc: 'High-arousal sensationalist vocabulary designed to provoke emotional reaction.', weight: 18 },
  { regex: /\b(they don'?t want you to know|what they are hiding|banned by doctors|suppressed by government)\b/gi, cat: 'Conspiracy / Suppression Cue', sev: 'high', desc: 'Conspiracy or suppression framing implying an orchestrated cover-up.', weight: 22 },
  { regex: /\b(100% (guaranteed|proven|effective|safe)|undeniable proof|miracle breakthrough)\b/gi, cat: 'Absolutist Certainty', sev: 'high', desc: 'Absolute certainty claims lacking scientific nuance or error margins.', weight: 20 },
  { regex: /\b(share before (it'?s )?(deleted|taken down|censored)|spread this everywhere|viral alert|wake up sheeple)\b/gi, cat: 'Artificial Urgency & Virality Call', sev: 'high', desc: 'Artificial urgency cues prompting unverified immediate sharing.', weight: 20 },
  { regex: /\b(bombshell revelation|massive scandal exposed|explosive leak)\b/gi, cat: 'Hyperbolic Framing', sev: 'medium', desc: 'Hyperbolic phrasing commonly employed in clickbait commentary.', weight: 14 },
  { regex: /\b(guaranteed returns|get rich quick|instant wealth|secret crypto code|free money glitch|500%\s+roi)\b/gi, cat: 'Financial Hype', sev: 'high', desc: 'Unrealistic financial claims indicative of speculative campaigns.', weight: 22 },
  { regex: /\b(mainstream media is lying|fake news media won'?t show)\b/gi, cat: 'Media Delegitimization', sev: 'medium', desc: 'Broad delegitimization rhetoric aimed at discouraging cross-verification.', weight: 16 },
  { regex: /\b(poisoning our|toxic agenda|deadly conspiracy|bioweapon hoax)\b/gi, cat: 'Fear-Mongering', sev: 'high', desc: 'Fear-mongering terminology intended to induce acute anxiety.', weight: 20 }
];

const anonymousPatterns = [
  { regex: /\b(experts say|sources reveal|insiders confirm|anonymous scientists report|people are saying|everyone knows)\b/gi, cat: 'Vague / Anonymous Attribution', sev: 'medium', desc: 'Vague attribution without named experts or peer-reviewed citations.', weight: 12 },
  { regex: /\b(studies show|research proves)\b(?!\s+(that\s+)?(published in|by the university|by dr\.|in nature|in the lancet))/gi, cat: 'Uncited Scientific Claim', sev: 'medium', desc: 'Claims scientific backing without identifying the publication or dataset.', weight: 10 }
];

const crediblePatterns = [
  { regex: /\b(according to (dr\.|professor|the report|official data|the associated press|reuters|the department|the ministry|the study published in))\b/gi, cat: 'Explicit Sourcing', desc: 'Direct attribution referencing a verifiable organization or official researcher.' },
  { regex: /\b(peer[- ]reviewed|published in the journal|randomized controlled trial|clinical trial)\b/gi, cat: 'Methodological Reference', desc: 'References standard scientific peer review or empirical methodologies.' },
  { regex: /\b(preliminary findings suggest|further research is needed|the authors noted|correlat(ed|ion) does not imply causation|uncertainty remains)\b/gi, cat: 'Epistemic Hedging', desc: 'Appropriate scientific hedging acknowledging nuance and limitations.' },
  { regex: /\b(on the other hand|critics pointed out|independent researchers remarked|conversely|in contrast to)\b/gi, cat: 'Balanced Multi-Perspective', desc: 'Presents multiple viewpoints or provides counter-arguments rather than one-sided assertion.' }
];

export const analyzeTextFallback = (content, title = '', sourceUrl = '') => {
  const fullText = (title ? `${title}\n${content}` : content).trim();
  const words = fullText.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);

  const capsWords = words.filter(w => w.length > 2 && w === w.toUpperCase());
  const capsRatio = Number((capsWords.length / Math.max(wordCount, 1)).toFixed(3));
  const exclamationCount = (fullText.match(/!/g) || []).length;
  const exclamationRatio = Number((exclamationCount / sentenceCount).toFixed(2));

  let rawRiskScore = 18;
  const warningSignals = [];
  const positiveSignals = [];
  let criticalHits = 0;
  let highHits = 0;
  let mediumHits = 0;

  spamAndSensationalPatterns.forEach(pat => {
    const matches = fullText.match(pat.regex);
    if (matches && matches.length > 0) {
      if (pat.sev === 'critical') {
        criticalHits += matches.length;
      } else if (pat.sev === 'high') {
        highHits += matches.length;
      } else {
        mediumHits += matches.length;
      }

      warningSignals.push({
        signal: `${pat.cat}: "${matches[0]}"`,
        severity: pat.sev,
        category: pat.cat,
        description: pat.desc,
        example: matches[0]
      });
    }
  });

  anonymousPatterns.forEach(pat => {
    const matches = fullText.match(pat.regex);
    if (matches && matches.length > 0) {
      mediumHits += matches.length;
      warningSignals.push({
        signal: `${pat.cat}: "${matches[0]}"`,
        severity: pat.sev,
        category: pat.cat,
        description: pat.desc,
        example: matches[0]
      });
    }
  });

  if (capsRatio > 0.12 && wordCount > 10) {
    highHits += 1;
    warningSignals.push({
      signal: 'Excessive Capitalization (Aggressive Emphasis)',
      severity: 'medium',
      category: 'Punctuation & Syntax',
      description: `Approximately ${Math.round(capsRatio * 100)}% of words are uppercase, signaling rhetorical escalation.`,
      example: 'ALL-CAPS phrasing detected'
    });
  }

  if (exclamationRatio > 0.5) {
    highHits += 1;
    warningSignals.push({
      signal: 'Punctuation Escalation (Multiple Exclamations)',
      severity: 'medium',
      category: 'Punctuation & Syntax',
      description: 'High density of exclamation marks indicates persuasive pressure and emotional arousal.',
      example: `${exclamationCount} exclamation marks found`
    });
  }

  let credibilityHits = 0;
  const hasSevereAlert = criticalHits > 0 || highHits >= 2;

  if (!hasSevereAlert) {
    crediblePatterns.forEach(pat => {
      const matches = fullText.match(pat.regex);
      if (matches && matches.length > 0) {
        credibilityHits += matches.length;
        positiveSignals.push({
          signal: `${pat.cat}: "${matches[0]}"`,
          category: pat.cat,
          description: pat.desc
        });
      }
    });
  }

  // Score computation
  if (criticalHits > 0) {
    rawRiskScore = Math.max(rawRiskScore, 75) + (15 * criticalHits) + (6 * highHits);
  } else if (highHits > 0) {
    rawRiskScore = Math.max(rawRiskScore, 50) + (10 * highHits) + (4 * mediumHits);
  } else if (mediumHits > 0) {
    rawRiskScore = Math.max(rawRiskScore, 32) + (8 * mediumHits);
  } else {
    rawRiskScore = credibilityHits > 0 ? Math.max(10, 22 - (6 * credibilityHits)) : 22;
  }

  const finalScore = Math.max(5, Math.min(95, Math.round(rawRiskScore)));
  let riskLevel = 'Low Risk';
  if (finalScore >= 70) riskLevel = 'High Risk';
  else if (finalScore >= 35) riskLevel = 'Moderate Risk';

  let primaryCategory = 'Unverified General Claim';
  if (warningSignals.some(s => s.category.includes('Phishing') || s.category.includes('Credential') || s.category.includes('Suspension'))) {
    primaryCategory = 'Phishing & Credential Theft Scam';
  } else if (warningSignals.some(s => s.category.includes('Delivery') || s.category.includes('Parcel'))) {
    primaryCategory = 'Parcel Delivery Scam';
  } else if (warningSignals.some(s => s.category.includes('Lottery') || s.category.includes('Prize') || s.category.includes('Advance-Fee'))) {
    primaryCategory = 'Lottery & Advance-Fee Fraud';
  } else if (warningSignals.some(s => s.category.includes('Loan') || s.category.includes('Financial'))) {
    primaryCategory = 'Financial / Predatory Scam';
  } else if (warningSignals.some(s => s.category.includes('Income') || s.category.includes('Off-Platform'))) {
    primaryCategory = 'Employment & Task Recruitment Scam';
  } else if (warningSignals.some(s => s.category.includes('Health') || s.category.includes('Cure'))) {
    primaryCategory = 'Health Misinformation Risk';
  } else if (warningSignals.some(s => s.category.includes('Conspiracy'))) {
    primaryCategory = 'Conspiracy Rhetoric';
  } else if (warningSignals.some(s => s.category.includes('Chain-Letter') || s.category.includes('Giveaway') || s.category.includes('Link'))) {
    primaryCategory = 'Digital Spam & Viral Fraud';
  } else if (highHits > 0) {
    primaryCategory = 'Sensationalism & Clickbait';
  } else if (credibilityHits >= 2 && finalScore < 35) {
    primaryCategory = 'Credible Journalistic Reporting';
  }

  const sensationalismSubscore = Math.min(100, (criticalHits * 40) + (highHits * 25) + Math.round(capsRatio * 100));
  const attributionSubscore = Math.max(0, 100 - (criticalHits * 45) - (mediumHits * 20) - (credibilityHits > 0 ? 0 : 30));
  const urgencySubscore = Math.min(100, (exclamationRatio > 0.4 ? 40 : 0) + (warningSignals.some(s => s.signal.includes('Urgency') || s.signal.includes('Suspension') || s.signal.includes('Action')) ? 45 : 0));

  let explanation = '';
  if (riskLevel === 'High Risk') {
    explanation = `Flagged as High Risk (${finalScore}/100) due to ${warningSignals.length} prominent warning pattern(s) characteristic of ${primaryCategory.toLowerCase()}, manipulative urgency, or unauthorized solicitations.`;
  } else if (riskLevel === 'Moderate Risk') {
    explanation = `Moderate risk identified (${finalScore}/100). The prose exhibits ${warningSignals.length} ambiguous pattern(s) or unverified claims.`;
  } else {
    explanation = `Low risk profile (${finalScore}/100). The text maintains structured, measured prose without overt clickbait, spam solicitation, or panic cues.`;
  }

  let verificationSteps = [
    'Cross-reference the central claim across independent news wires (AP, Reuters, BBC).',
    'Verify primary attribution: check whether quoted figures or institutions officially published the statement.',
    'Examine publishing domain history and author credentials.'
  ];

  if (primaryCategory.includes('Phishing') || primaryCategory.includes('Scam') || primaryCategory.includes('Delivery') || primaryCategory.includes('Lottery')) {
    verificationSteps = [
      'NEVER click links, provide passwords, or enter payment details from unsolicited text messages or emails.',
      'Verify independently by navigating directly to the official organization website or calling the verified customer service number on your bank card or official bill.',
      'Check the sender address and link target carefully for subtle misspellings (typosquatting) or unofficial domain extensions.',
      'Report suspicious messages to your carrier (forward SMS to 7726) and mark the message as phishing/spam.'
    ];
  }

  return {
    title: title || (content.slice(0, 60) + (content.length > 60 ? '...' : '')),
    sourceUrl,
    riskScore: finalScore,
    riskLevel,
    category: primaryCategory,
    summary: `Evaluated as ${riskLevel} (${finalScore}/100) under '${primaryCategory}'. Found ${warningSignals.length} alert(s) and ${positiveSignals.length} credibility marker(s).`,
    explanation,
    warningSignals,
    positiveSignals,
    metrics: {
      wordCount,
      sentenceCount,
      avgSentenceLength: Number((wordCount / sentenceCount).toFixed(1)),
      capsRatio,
      exclamationCount,
      sensationalismScore: sensationalismSubscore,
      attributionScore: attributionSubscore,
      urgencyScore: urgencySubscore,
      readingTimeSeconds: Math.max(Math.ceil(wordCount / 3.5), 10)
    },
    verificationSteps,
    limitations: 'IMPORTANT NOTICE: The TruthLens Risk Index measures linguistic, stylistic, and rhetorical risk markers. It does NOT verify real-world facts or assess physical truth.',
    providerInfo: {
      providerId: 'node-fallback-nlp-v1',
      providerName: 'TruthLens Node.js Fallback Engine',
      providerMode: 'demo_heuristic',
      disclaimer: 'Engine running via Node.js fallback analyzer.'
    }
  };
};
