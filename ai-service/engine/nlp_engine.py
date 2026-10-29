"""
TruthLens Advanced Modular Heuristic NLP Engine
Analyzes text for linguistic risk markers, attribution clarity, sensationalism,
known disinformation narratives, false institutional authority, and verification cues.
"""

import re
import math
from typing import Dict, Any, List, Tuple
from .base import BaseAnalysisEngine

class HeuristicNLPEngine(BaseAnalysisEngine):
    def __init__(self):
        self._provider_id = "heuristic-nlp-v1"
        self._provider_name = "TruthLens Modular Heuristic NLP Engine"
        self._provider_mode = "demo_heuristic"

        # 1. Critical Concept Co-occurrence Rules (Topic + Extraordinary assertion)
        self.critical_concept_rules = [
            (
                [r"\bnasa\b", r"\bwho\b", r"\bworld\s+health\s+organization\b", r"\bcdc\b", r"\bpentagon\b", r"\bwhite\s+house\b", r"\bun\b", r"\bunesco\b", r"\bfbi\b", r"\bcia\b"],
                [r"\bworld\s+will\s+end\b", r"\bend\s+of\s+the\s+world\b", r"\basteroid\b", r"\btotal\s+darkness\b", r"\b\d+\s+days?\s+of\s+darkness\b", r"\bapocalypse\b", r"\balien(s)?\b", r"\bdoomsday\b", r"\bbest\s+national\s+anthem\b", r"\bnational\s+anthem\s+the\s+best\b", r"\bmicrochips?\b", r"\b5g\b", r"\bdepopulat\w*\b", r"\bsecret\s+cover-?up\b"],
                "False Institutional Authority / Impersonation", "critical",
                "Fabricates or misattributes claims to prominent institutions (NASA, WHO, UNESCO, etc.) to validate an unverified catastrophe or extraordinary narrative.", 48
            ),
            (
                [r"\bbill\s+gates\b", r"\bfauci\b", r"\bwef\b", r"\bklaus\s+schwab\b", r"\brothschild\b", r"\bglobal\s+elites?\b"],
                [r"\bdepopulat\w*\b", r"\bmicrochips?\b", r"\bkill\s+billions\b", r"\bbioweapon\b", r"\bpoison\s+jab\b", r"\bclot\s+shot\b", r"\bpatent(ed)?\s+the\s+virus\b", r"\bleaked\s+video\b", r"\bsecretly\s+admit(s|ted)?\b"],
                "Conspiracy / Depopulation Narrative", "critical",
                "Alleges an orchestrated global depopulation or clandestine bioweapon conspiracy by named public figures.", 46
            ),
            (
                [r"\b5g\b", r"\bcell\s+towers?\b", r"\bradiation\s+towers?\b"],
                [r"\bcovid\b", r"\bcoronavirus\b", r"\bradiation\s+sickness\b", r"\btumors?\b", r"\bactivates?\b", r"\bmicrochips?\b", r"\bspreads?\s+the\s+virus\b", r"\bkills?\s+birds\b", r"\bbiological\s+weapon\b"],
                "5G / Disease Conspiracy", "critical",
                "Promotes the debunked conspiracy linking 5G cellular networks to viral pandemics or acute biological harm.", 46
            ),
            (
                [r"\bvaccine[s]?\b", r"\binjection[s]?\b", r"\bjab[s]?\b", r"\bmrna\b"],
                [r"\bmicrochips?\b", r"\b5g\b", r"\btrackers?\b", r"\bmagnetic\b", r"\balter(s|ing)?\s+(your\s+)?dna\b", r"\bdepopulation\b", r"\bclot\s+shot\b", r"\bautism\b", r"\bturbo\s+cancer\b", r"\bsudden\s+death\b", r"\bpoison\b"],
                "Vaccine Misinformation / Conspiracy", "critical",
                "Makes unverified, medically debunked claims about vaccines containing microchips, altering DNA, or causing catastrophic harm.", 46
            ),
            (
                [r"\bcancer\b", r"\bdiabetes\b", r"\bautism\b", r"\bhiv\b", r"\baids\b", r"\balzheimer\b", r"\btumors?\b", r"\bcoronavirus\b", r"\bcovid\b", r"\bchronic\s+disease\b"],
                [r"\bcure[sd]?\b", r"\bdestroy(s|ed|ing)?\s+all\b", r"\beliminat(es|ed|ing)?\b", r"\bmiracle\b", r"\b100\s*(%|percent)\b", r"\blemon\b", r"\bbaking\s+soda\b", r"\bgarlic\b", r"\bbleach\b", r"\bmms\b", r"\bcolloidal\s+silver\b", r"\bivermectin\b", r"\bovernight\b"],
                "Health Quackery & Miracle Cure", "critical",
                "Promotes unverified or home-remedy cures for life-threatening medical conditions without peer-reviewed scientific proof.", 46
            ),
            (
                [r"\bpope\s+francis\b", r"\bobama\b", r"\bbiden\b", r"\btrump\b", r"\bfauci\b", r"\btom\s+hanks\b", r"\bpelosi\b", r"\bclinton\b", r"\bcelebrity\b", r"\bhollywood\s+star\b", r"\bactor\b"],
                [r"\barrested\b", r"\bexecuted\b", r"\bguantanamo\b", r"\bgitmo\b", r"\btreason\b", r"\bhuman\s+trafficking\b", r"\bcloned\b", r"\bbody\s+double\b", r"\bmilitary\s+tribunal\b", r"\bfound\s+dead\b", r"\bfatal\s+accident\b", r"\bdies\s+today\b"],
                "Fabricated Public Figure Scandal / Hoax", "critical",
                "Fabricates high-profile arrests, secret military executions, clone replacements, or unverified celebrity death announcements.", 45
            ),
            (
                [r"\bworld\s+war\s+(3|three|iii)\b", r"\bww3\b", r"\bnuclear\s+(war|strike|attack)\b", r"\bmartial\s+law\b", r"\bbanks?\s+collapsing\b", r"\bcurrency\s+reset\b"],
                [r"\bdeclared\b", r"\bofficially\b", r"\bstarted\b", r"\bbegun\b", r"\bconfirmed\b", r"\bunderway\b", r"\bwithdraw\s+all\b", r"\batm\b", r"\btomorrow\b", r"\bnationwide\b", r"\bimminent\b"],
                "Fabricated Crisis / War Escalation Alert", "critical",
                "Spreads unverified claims of global warfare, martial law, or nationwide banking collapse designed to provoke public panic.", 46
            ),
            (
                [r"\bflat\s+earth\b", r"\bantarctic\s+ice\s+wall\b", r"\bmoon\s+landing\b", r"\bchemtrails?\b", r"\bhaarp\b", r"\barea\s+51\b", r"\badrenochrome\b", r"\bpizzagate\b", r"\bdominion\b", r"\bweather\s+weapon\b"],
                [r"\bleaked\b", r"\bproven\b", r"\bphotos?\b", r"\bstaged\b", r"\bhollywood\b", r"\bfaked\b", r"\bspraying\b", r"\bweapon\b", r"\bautopsy\b", r"\bcabal\b", r"\bswitching\b", r"\bvotes\b", r"\bearthquake\b", r"\brigged\b"],
                "Coordinated Conspiracy Narrative", "critical",
                "Promotes widely debunked pseudoscientific, historical, or political conspiracy narratives.", 45
            ),
            (
                [r"\bwhatsapp\b", r"\belon\s+musk\b", r"\btelegram\b", r"\bgovernment\s+giving\b"],
                [r"\bforward\s+this\b", r"\bcharges?\s+money\b", r"\bgiving\s+away\b", r"\bbitcoin\b", r"\bfree\s+crypto\b", r"\bclick\s+this\s+link\b", r"\bfree\s+\$?\d+[\d,]*\s*(stimulus|grant|check)\b"],
                "Viral Chain-Letter / Financial Scam", "critical",
                "Exhibits characteristics of viral message scams, bogus financial giveaways, or fraudulent forwarding campaigns.", 42
            ),
            (
                [r"\b(bank(\s+of\s+\w+)?|chase|wells\s+fargo|paypal|apple(\s+id)?|netflix|amazon|usps|fedex|dhl|ups|irs|tax\s+refund|social\s+security|binance|coinbase)\b"],
                [r"\b(account\s+(has\s+been\s+)?(suspended|locked|blocked|compromised|flagged|disabled)|unauthorized\s+(activity|access|transaction)|verify\s+your\s+(identity|account|details|password|billing)|update\s+(your\s+)?(payment|information|details)|package\s+(held|undelivered|pending)|click\s+here\s+to\s+(verify|claim|unlock))\b"],
                "Brand Impersonation & Phishing Lure", "critical",
                "Impersonates a major banking, delivery, or tech brand alongside urgent account suspension or credential verification demands.", 48
            ),
            (
                [r"\b(earn|make|income|salary)\b", r"\b(part[- ]time\s+job|work\s+from\s+home|remote\s+job|online\s+job|task\s+based)\b"],
                [r"\b(\$|£|€)?\s*\d+[\d,]*\s*[-–to]*\s*(\$|£|€)?\s*\d+[\d,]*\s*(daily|per\s+day|a\s+day|an\s+hour|per\s+hour|weekly)\b", r"\b(no\s+experience\s+(needed|required)|daily\s+payouts?|whatsapp\s+hr|contact\s+manager\s+on\s+telegram)\b"],
                "Work-From-Home / Task Recruitment Scam", "critical",
                "Unrealistic employment proposition promising high daily earnings with zero experience, typical of task scams.", 45
            )
        ]

        # 2. Specific Misinformation, Spam & Hoax Direct Patterns
        self.hoax_direct_patterns = [
            # Phishing & Account Verification Scams
            (r"\b(your\s+account\s+(has\s+been\s+)?(temporarily\s+)?(suspended|locked|restricted|flagged|closed|compromised|disabled)|unauthorized\s+(login|access|transaction)\s+(detected|attempt)|unusual\s+sign-?in\s+activity)\b", "Account Suspension Phishing Trigger", "critical", "Employs fabricated urgent security alerts to induce panic and credential surrender.", 46),
            (r"\b(verify\s+your\s+(account|identity|billing|card|password|ssn|credentials|details)|(reactivate|unlock)\s+your\s+account|update\s+your\s+(billing|payment|security)\s+(information|details))\b", "Credential Harvesting Trigger", "critical", "Direct command demanding verification of sensitive account or payment credentials.", 45),
            # Delivery & Parcel Scams
            (r"\b(package|parcel|shipment|delivery)\s+(could\s+not|cannot|was\s+unable\s+to)\s+be\s+delivered\s*(due\s+to|because\s+of)?\s*(an?\s+)?(incomplete|incorrect|wrong|invalid)\s+(address|zip|information)\b", "Parcel Delivery Phishing", "critical", "Classic delivery scam falsely claiming incomplete address to solicit payment or personal info.", 46),
            (r"\b(reschedule\s+your\s+delivery|pay\s+(\$|£|€)?\s*\d+(\.\d+)?\s*(redelivery|customs|shipping)\s+fee|package\s+(is\s+)?held\s+at\s+(the\s+)?(warehouse|customs))\b", "Delivery Fee Scam", "critical", "Bogus courier redelivery fee notice designed to harvest credit card details.", 45),
            # Lottery, Winner, Giveaway & Advance-Fee Scams
            (r"\b(congratulations\s*!*.*(you\s+(have\s+been\s+selected|won|are\s+the\s+winner)|claim\s+(your\s+)?(prize|reward|gift\s+card|cash|grant|reward)))\b", "Lottery / Prize Scam", "critical", "Unsolicited notification asserting reader won an unentered lottery or prize.", 46),
            (r"\b(you\s+(have\s+)?won\s+(\$|£|€)?\s*[\d,]+\s*(dollars|pounds|euros|in\s+the\s+lottery|in\s+the\s+draw|sweepstakes)|free\s+(\$|£|€)?\s*[\d,]+\s*(gift\s+card|walmart\s+gift|amazon\s+gift|voucher))\b", "Bogus Cash / Voucher Giveaway", "critical", "Bogus prize or gift card lure designed to capture personal details.", 45),
            (r"\b(dear\s+beneficiary|next\s+of\s+kin|abandoned\s+(consignment|funds|sum|fortune)|barrister\s+\w+|diplomatic\s+courier\s+service|transfer\s+of\s+(\$|£|€)?\s*[\d,]+)\b", "Advance-Fee / 419 Scam", "critical", "Classic 419 advance-fee fraud offering multi-million dollar inheritances or abandoned funds.", 48),
            # Predatory Loan & Debt Scam
            (r"\b(pre[- ]approved\s+for\s+(\$|£|€)?\s*[\d,]+\s*(personal\s+loan|business\s+loan)|instant\s+loan\s+approval|no\s+credit\s+check\s+needed|reply\s+yes\s+to\s+receive\s+funds)\b", "Fraudulent Loan Solicitation", "critical", "Unsolicited high-value loan approval claims indicative of advance-fee loan scams.", 42),
            # Off-Platform & Task Recruitment
            (r"\b(earn\s+(\$|£|€)?\s*\d+[\d,]*\s*[-–to]*\s*(\$|£|€)?\s*\d+[\d,]*\s*(daily|per\s+day|a\s+day|an\s+hour|per\s+hour)|daily\s+income\s+(\$|£|€)?\s*\d+)\b", "Unrealistic Income Guarantee", "high", "Unrealistic daily income claims frequent in task scams and recruitment fraud.", 38),
            (r"\b(contact\s+(our\s+)?(manager|recruiter|hr)\s+on\s+(whatsapp|telegram)|message\s+us\s+on\s+whatsapp\s+to\s+start)\b", "Off-Platform Solicitation (WhatsApp / Telegram)", "high", "Redirects target to private messaging platforms to evade platform protections.", 38),
            # Call-To-Action Link Manipulation & Obfuscation
            (r"\b(click\s+(here|this\s+link|below|on\s+the\s+link)\s+to\s+(claim|verify|unlock|activate|receive|get\s+started|confirm|collect|update))\b", "Coercive Call-To-Action Link", "high", "Aggressive directive instructing user to follow an external hyperlink.", 36),
            (r"\b(https?:\/\/(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|goo\.gl|cutt\.ly|shorturl\.at|ow\.ly|rb\.gy|t\.me\/)\S+)\b", "Obfuscated / Shortened Link", "high", "Contains a shortened or masked URL concealing the actual destination domain.", 36),
            # Chain Letters & Carrier Giveaways
            (r"\b(forward\s+(this\s+)?(message|to|text)\s+to\s+\d+\s+(people|friends|groups|contacts)|send\s+to\s+\d+\s+(people|groups)|whatsapp\s+(will\s+start\s+charging|closing\s+down))\b", "Viral Chain-Letter Spam", "high", "Manipulative chain forwarding instruction exploiting fear of service loss or penalties.", 40),
            (r"\b(free\s+recharge|free\s+\d+\s*gb\s+(data|internet)|government\s+giving\s+free\s+(laptops?|tablets?|smartphones?|recharge))\b", "Government / Carrier Giveaway Scam", "critical", "Bogus state or telecom giveaway scam targeting personal details.", 45),
            # Standard Misinformation Hoaxes
            (r"\b(earth\s+will\s+(plunge\s+into|experience)\s+(total\s+)?darkness|\d+\s+days?\s+of\s+(total\s+)?darkness)\b", "Apocalyptic Hoax", "critical", "Recurring viral hoax falsely alleging days of worldwide planetary darkness.", 45),
            (r"\b(5g\s+(towers?|networks?|radiation)?\s*(causes?|spreads?)\s*(covid|corona|cancer))\b", "5G Conspiracy", "critical", "Debunked falsehood alleging 5G technology transmits or creates coronavirus.", 45),
            (r"\b(vaccines?\s+contain(s)?\s+(5g|microchips?|trackers?|nanotech))\b", "Vaccine Microchip Hoax", "critical", "Unsubstantiated conspiracy claiming vaccines implant microscopic tracking hardware.", 45),
            (r"\b(cures?\s+all\s+cancer|cures?\s+cancer\s+in\s+\d+\s+(hours?|days?)|cure\s+for\s+cancer\s+discovered\s+in\s+lemon)\b", "Cancer Cure Hoax", "critical", "Baseless claim of a quick or total cancer cure without medical evidence.", 45),
            (r"\b(drinking\s+(bleach|baking\s+soda|lemon\s+water|garlic\s+water|hydrogen\s+peroxide)\s+(cures?|destroys?|kills?)\s+(cancer|covid|viruses?))\b", "Dangerous Ingestion Hoax", "critical", "Hazardous medical disinformation advocating ingestion of household substances as cures.", 48),
            (r"\b(pope\s+francis\s+arrested\s+at\s+(the\s+)?vatican)\b", "Vatican Arrest Hoax", "critical", "Fabricated high-profile arrest claim repeatedly debunked by international fact-checkers.", 45),
            (r"\b(bill\s+gates\s+admits?\s+.*depopulation)\b", "Depopulation Hoax", "critical", "Misquoted speech clipped out of context to promote a global depopulation conspiracy.", 45),
            (r"\b(chemtrails?|toxic\s+spray\s+from\s+airplanes|government\s+poisoning\s+the\s+air)\b", "Chemtrail Conspiracy", "high", "Unscientific attribution of normal aircraft condensation trails to government poison spraying.", 35),
            (r"\b(unesco\s+(declared|named|ranked)\s+.*national\s+anthem\s+the\s+best)\b", "UNESCO Anthem Hoax", "critical", "Classic recurring social media chain-letter hoax falsely citing UNESCO.", 40),
            (r"\b(flat\s+earth|earth\s+is\s+flat|antarctic\s+ice\s+wall)\b", "Flat Earth Theory", "critical", "Scientifically refuted assertion denying planetary spherical geometry.", 45),
            (r"\b(moon\s+landing\s+(was\s+)?(faked|staged|hoax|filmed\s+in\s+hollywood))\b", "Moon Landing Denial", "critical", "Historical conspiracy denying human lunar landings.", 40),
            (r"\b(martial\s+law\s+officially\s+declared\s+nationwide)\b", "Martial Law Panic", "critical", "Fabricated emergency announcement intended to provoke civil unrest.", 45),
            (r"\b(world\s+war\s+(3|three|iii)\s+officially\s+declared)\b", "World War Panic", "critical", "Unverified declaration of global warfare absent from verified wire news.", 45),
        ]

        # 3. High-Arousal Sensational & Manipulative Patterns
        self.sensational_patterns = [
            (r"\b(shocking|unbelievable|mind[- ]blowing|miracle cure|secret remedy)\b", "Sensationalism", "high", "High-arousal sensationalist vocabulary designed to provoke strong emotional reaction rather than neutral reporting.", 18),
            (r"\b(they don'?t want you to know|what they are hiding|banned by doctors|suppressed by government)\b", "Conspiracy / Suppression Cue", "high", "Conspiracy or suppression framing implying an orchestrated cover-up without verifiable evidence.", 22),
            (r"\b(100\s*(%|percent)\s*(guaranteed|proven|effective|safe)|undeniable proof|miracle breakthrough|irrefutable evidence)\b", "Absolutist Certainty", "high", "Absolute certainty claims lacking scientific nuance, epistemic hedging, or error margins.", 20),
            (r"\b(share before (it'?s )?(deleted|taken down|censored)|spread this everywhere|viral alert|wake up sheeple|open your eyes)\b", "Artificial Urgency & Virality Call", "high", "Artificial urgency cues prompting unverified immediate sharing before scrutiny can occur.", 20),
            (r"\b(bombshell revelation|massive scandal exposed|explosive leak|jaw[- ]dropping)\b", "Hyperbolic Framing", "medium", "Hyperbolic phrasing commonly employed in clickbait commentary rather than measured news reporting.", 14),
            (r"\b(big pharma doesn'?t want|hidden truth exposed|covert agenda|globalist puppet)\b", "Conspiracy Rhetoric", "high", "Conspiracy rhetoric characterizing complex systems as single malicious entities.", 20),
            (r"\b(guaranteed returns|get rich quick|instant wealth|secret crypto code|free money glitch|500%\s+roi)\b", "Financial Hype", "high", "Unrealistic financial claims indicative of speculative promotional or deceptive campaigns.", 22),
            (r"\b(mainstream media is lying|fake news media won'?t show|media blackout)\b", "Media Delegitimization", "high", "Broad delegitimization rhetoric aimed at discouraging cross-verification against established news sources.", 16),
            (r"\b(poisoning our|toxic agenda|deadly conspiracy|bioweapon hoax|depopulation tool)\b", "Fear-Mongering", "high", "Fear-mongering terminology intended to induce acute anxiety and preempt critical questioning.", 20)
        ]

        # 4. Attribution Patterns
        self.anonymous_sourcing_patterns = [
            (r"\b(experts say|sources reveal|insiders confirm|anonymous scientists report|people are saying|everyone knows|leaked documents show)\b", "Vague / Anonymous Attribution", "medium", "Vague attribution without named experts, peer-reviewed citations, or institutional accountability.", 12),
            (r"\b(studies show|research proves)\b(?!\s+(that\s+)?(published in|by the university|by dr\.|in nature|in the lancet))", "Uncited Scientific Claim", "medium", "Claims scientific backing without identifying the publication, researchers, or dataset.", 10),
        ]

        # 5. Positive Credibility Patterns (Applied only when text is free of critical hoaxes)
        self.credible_patterns = [
            (r"\b(according to researchers at|data published in the peer[- ]reviewed|clinical trial results published in|in the journal nature|in the lancet)\b", "Peer-Reviewed Citation", "Explicit citation directly anchoring findings to validated scientific literature."),
            (r"\b(reuters reported|the associated press reported|bbc verify|afp fact check)\b", "Reputable Wire Attribution", "References recognized international wire service reporting standards."),
            (r"\b(preliminary findings suggest|further research is needed|the authors noted|correlat(ed|ion) does not imply causation|uncertainty remains)\b", "Epistemic Hedging", "Appropriate scientific hedging acknowledging nuance, limitations, and ongoing inquiry."),
            (r"\b(on the other hand|critics pointed out|independent researchers remarked|conversely|in contrast to)\b", "Balanced Multi-Perspective", "Presents multiple viewpoints or provides counter-arguments rather than one-sided assertion."),
            (r"\b(randomized controlled trial|double[- ]blind study|meta[- ]analysis of)\b", "Methodological Reference", "References standard empirical scientific methodologies.")
        ]

    @property
    def provider_id(self) -> str:
        return self._provider_id

    @property
    def provider_name(self) -> str:
        return self._provider_name

    @property
    def provider_mode(self) -> str:
        return self._provider_mode

    def _extract_lexical_metrics(self, text: str) -> Dict[str, Any]:
        """Calculates basic NLP lexical statistics."""
        words = re.findall(r"\b\w+\b", text)
        word_count = len(words)
        
        sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]
        sentence_count = max(len(sentences), 1)
        
        caps_words = [w for w in words if len(w) > 2 and w.isupper()]
        caps_ratio = len(caps_words) / max(word_count, 1)

        exclamation_count = text.count("!")
        exclamation_ratio = exclamation_count / max(sentence_count, 1)
        question_count = text.count("?")

        quotes = re.findall(r'["\'](.*?)["\']', text)
        quote_count = len(quotes)
        avg_sentence_len = word_count / sentence_count

        return {
            "wordCount": word_count,
            "sentenceCount": sentence_count,
            "avgSentenceLength": round(avg_sentence_len, 1),
            "capsWordsCount": len(caps_words),
            "capsRatio": round(caps_ratio, 3),
            "exclamationCount": exclamation_count,
            "exclamationRatio": round(exclamation_ratio, 2),
            "questionCount": question_count,
            "quoteCount": quote_count,
            "readingTimeSeconds": max(math.ceil(word_count / 3.5), 10)
        }

    def analyze(self, content: str, title: str = "", source_url: str = "") -> Dict[str, Any]:
        cleaned_content = content.strip()
        if not cleaned_content:
            raise ValueError("Analysis content cannot be empty.")

        text_to_analyze = f"{title}\n{cleaned_content}" if title else cleaned_content
        metrics = self._extract_lexical_metrics(text_to_analyze)

        warning_signals = []
        positive_signals = []
        
        raw_risk_score = 18.0
        critical_hits = 0
        high_hits = 0
        medium_hits = 0

        # Layer 1: Check Concept Co-occurrence Rules
        for terms_a, terms_b, cat, sev, desc, weight in self.critical_concept_rules:
            match_a = None
            match_b = None
            for ta in terms_a:
                m = re.search(ta, text_to_analyze, re.IGNORECASE)
                if m:
                    match_a = m.group(0)
                    break
            if match_a:
                for tb in terms_b:
                    m = re.search(tb, text_to_analyze, re.IGNORECASE)
                    if m:
                        match_b = m.group(0)
                        break
            if match_a and match_b:
                critical_hits += 1
                warning_signals.append({
                    "signal": f"{cat}: \"{match_a}\" + \"{match_b}\"",
                    "severity": sev,
                    "category": cat,
                    "description": desc,
                    "example": f"{match_a} ... {match_b}"
                })

        # Layer 2: Check Direct Hoax Patterns
        for pattern, cat, sev, desc, weight in self.hoax_direct_patterns:
            matches = list(re.finditer(pattern, text_to_analyze, re.IGNORECASE))
            if matches:
                critical_hits += len(matches)
                first_match = matches[0].group(0)
                warning_signals.append({
                    "signal": f"{cat}: \"{first_match}\"",
                    "severity": sev,
                    "category": cat,
                    "description": desc,
                    "example": first_match
                })

        # Layer 3: Check Sensational Patterns
        for pattern, cat, sev, desc, weight in self.sensational_patterns:
            matches = list(re.finditer(pattern, text_to_analyze, re.IGNORECASE))
            if matches:
                high_hits += len(matches)
                first_match = matches[0].group(0)
                warning_signals.append({
                    "signal": f"{cat}: \"{first_match}\"",
                    "severity": sev,
                    "category": cat,
                    "description": desc,
                    "example": first_match
                })

        # Layer 4: Check Anonymous Sourcing Patterns
        for pattern, cat, sev, desc, weight in self.anonymous_sourcing_patterns:
            matches = list(re.finditer(pattern, text_to_analyze, re.IGNORECASE))
            if matches:
                medium_hits += len(matches)
                first_match = matches[0].group(0)
                warning_signals.append({
                    "signal": f"{cat}: \"{first_match}\"",
                    "severity": sev,
                    "category": cat,
                    "description": desc,
                    "example": first_match
                })

        # Layer 5: Structural Checks (ALL-CAPS & Punctuation Escalation)
        if metrics["capsRatio"] > 0.12 and metrics["wordCount"] > 10:
            high_hits += 1
            warning_signals.append({
                "signal": "Excessive Capitalization (Aggressive Emphasis)",
                "severity": "medium",
                "category": "Punctuation & Syntax",
                "description": f"Approximately {int(metrics['capsRatio'] * 100)}% of words are uppercase, an emotional rhetorical technique frequent in sensationalist posts.",
                "example": "ALL-CAPS phrasing detected"
            })

        if metrics["exclamationRatio"] > 0.5:
            high_hits += 1
            warning_signals.append({
                "signal": "Punctuation Escalation (Multiple Exclamations)",
                "severity": "medium",
                "category": "Punctuation & Syntax",
                "description": "High density of exclamation marks indicates persuasive pressure and emotional arousal over neutral reporting.",
                "example": f"{metrics['exclamationCount']} exclamation marks found"
            })

        # Deduplicate signals by category & signal name
        seen_signals = set()
        deduped_warnings = []
        for s in warning_signals:
            key = s["signal"]
            if key not in seen_signals:
                seen_signals.add(key)
                deduped_warnings.append(s)
        warning_signals = deduped_warnings

        # Layer 6: Positive Credibility Evaluation
        # Crucial safety rule: Never grant credibility credit if critical hoaxes or multiple high alerts exist!
        credibility_hits = 0
        has_severe_alert = critical_hits > 0 or high_hits >= 2
        
        if not has_severe_alert:
            for pattern, cat, desc in self.credible_patterns:
                matches = list(re.finditer(pattern, text_to_analyze, re.IGNORECASE))
                if matches:
                    credibility_hits += len(matches)
                    first_match = matches[0].group(0)
                    positive_signals.append({
                        "signal": f"{cat}: \"{first_match}\"",
                        "category": cat,
                        "description": desc
                    })

            if metrics["quoteCount"] >= 2 and metrics["avgSentenceLength"] > 14 and credibility_hits > 0:
                positive_signals.append({
                    "signal": "Direct Quotations & Syntactic Balance",
                    "category": "Journalistic Structure",
                    "description": "Text incorporates explicit quoted dialogue or statements with syntactically structured sentence lengths typical of news journalism."
                })
        else:
            # If text had critical alert but attempted to cite generic authority
            if re.search(r"\b(according to (official reports|sources|the report|the data|scientists))\b", text_to_analyze, re.IGNORECASE):
                warning_signals.append({
                    "signal": "Vague / Misappropriated Sourcing",
                    "severity": "high",
                    "category": "False Attribution",
                    "description": "Text invokes generic institutional terms ('according to reports / data') without verifiable links to legitimize an extraordinary claim.",
                    "example": "Generic authority citation detected"
                })

        # Layer 7: Score Computation
        if critical_hits > 0:
            # Automatic High Risk escalation for severe misinformation
            raw_risk_score = max(raw_risk_score, 72.0) + (14 * critical_hits) + (6 * high_hits)
        elif high_hits > 0:
            raw_risk_score = max(raw_risk_score, 50.0) + (10 * high_hits) + (4 * medium_hits)
        elif medium_hits > 0:
            raw_risk_score = max(raw_risk_score, 32.0) + (8 * medium_hits)
        else:
            if credibility_hits > 0:
                raw_risk_score = max(10.0, 22.0 - (6 * credibility_hits))
            else:
                raw_risk_score = 22.0

        if not has_severe_alert and credibility_hits > 0:
            raw_risk_score -= 8 * min(credibility_hits, 3)

        final_score = int(max(5, min(95, round(raw_risk_score))))

        # Determine Risk Level
        if final_score >= 70:
            risk_level = "High Risk"
        elif final_score >= 35:
            risk_level = "Moderate Risk"
        else:
            risk_level = "Low Risk"

        # Determine Primary Category
        categories_found = [s.get("category", "") for s in warning_signals]
        if any("Phishing" in c or "Credential" in c or "Suspension" in c for c in categories_found):
            primary_category = "Phishing & Credential Theft Scam"
        elif any("Delivery" in c or "Parcel" in c for c in categories_found):
            primary_category = "Parcel Delivery Scam"
        elif any("Lottery" in c or "Prize" in c or "Advance-Fee" in c or "Giveaway" in c for c in categories_found):
            primary_category = "Lottery & Advance-Fee Fraud"
        elif any("Employment" in c or "Work-From-Home" in c or "Income Guarantee" in c for c in categories_found):
            primary_category = "Employment & Task Recruitment Scam"
        elif any("Chain-Letter" in c or "Viral Giveaway" in c or "Off-Platform" in c or "Coercive" in c for c in categories_found):
            primary_category = "Digital Spam & Viral Fraud"
        elif any("Health" in c or "Cure" in c or "Quackery" in c for c in categories_found):
            primary_category = "Health & Medical Misinformation"
        elif any("5G" in c or "Vaccine" in c or "Depopulation" in c or "Conspiracy" in c for c in categories_found):
            primary_category = "Conspiracy Theory / Hoax"
        elif any("Apocalyptic" in c or "Crisis" in c or "War Escalation" in c for c in categories_found):
            primary_category = "Fabricated Crisis & Apocalyptic Alert"
        elif any("False Institutional Authority" in c or "Brand Impersonation" in c or "Impersonation" in c for c in categories_found):
            primary_category = "Brand Impersonation & False Authority"
        elif any("Public Figure" in c or "Arrest" in c for c in categories_found):
            primary_category = "Fabricated Public Figure Hoax"
        elif any("Financial" in c or "Scam" in c for c in categories_found):
            primary_category = "Financial Scam / Hype"
        elif any("Virality" in c for c in categories_found):
            primary_category = "Viral Chain-Letter / Forwarded Hoax"
        elif any("Sensationalism" in c for c in categories_found) or high_hits > 1:
            primary_category = "Sensationalism & Clickbait"
        elif credibility_hits >= 1 and final_score < 35:
            primary_category = "Credible Journalistic Reporting"
        else:
            primary_category = "Unverified General Claim"

        # Sub-scores
        sensationalism_subscore = min(100, (critical_hits * 40) + (high_hits * 25) + int(metrics["capsRatio"] * 100))
        attribution_subscore = max(0, 100 - (critical_hits * 45) - (medium_hits * 20) - (0 if credibility_hits > 0 else 30))
        urgency_subscore = min(100, (1 if metrics["exclamationRatio"] > 0.4 else 0) * 35 + (45 if any("Urgency" in s["signal"] or "Crisis" in s.get("category", "") for s in warning_signals) else 0))

        # Generate Human-Readable Explanation
        if risk_level == "High Risk":
            explanation = (
                f"This content was flagged as High Risk ({final_score}/100) due to {len(warning_signals)} prominent linguistic warning pattern(s). "
                f"Our heuristic audit detected high-severity signals including {primary_category.lower()} rhetoric, "
                f"unverifiable absolutist certainty, and emotional pressure tactics. These markers are strongly characteristic of viral disinformation."
            )
        elif risk_level == "Moderate Risk":
            explanation = (
                f"This submission exhibits a moderate risk profile ({final_score}/100). While it may touch on real events, "
                f"the presence of {len(warning_signals)} ambiguous phrasing pattern(s) or vague attribution cues suggests readers should cross-check primary sources "
                f"before accepting the narrative at face value."
            )
        else:
            if credibility_hits > 0:
                explanation = (
                    f"This content displays a low linguistic risk index ({final_score}/100). The prose maintains measured journalistic tone, "
                    f"displays structural nuance, and references verifiable research or wire reporting without sensational clickbait tropes."
                )
            else:
                explanation = (
                    f"This text displays a measured linguistic tone ({final_score}/100) without high-arousal clickbait or recognized conspiracy tropes. "
                    f"However, note that neutral prose alone does not certify real-world factual accuracy; verify specific factual claims with primary sources."
                )

        # Executive Summary
        summary = (
            f"Evaluated as {risk_level} ({final_score}/100) under the '{primary_category}' classification. "
            f"Detected {len(warning_signals)} warning signal(s) and {len(positive_signals)} credibility marker(s)."
        )

        # Practical Verification Steps (tailored based on category and signals)
        verification_steps = [
            "Cross-reference the central claim across independent news wires (Associated Press, Reuters, BBC Verify).",
            "Identify the named primary originator: verify whether the individual, research lab, or organization actually published the statement.",
            "Conduct a targeted domain check on any linked URLs to inspect publishing history, author bylines, and editorial corrections policies."
        ]
        if "Health" in primary_category:
            verification_steps.insert(0, "Consult medical consensus databases (PubMed, World Health Organization, CDC, Cochrane Reviews) for peer-reviewed clinical trials.")
        elif "Authority" in primary_category or "Apocalyptic" in primary_category:
            verification_steps.insert(0, "Check official institutional repositories (e.g. nasa.gov, who.int, un.org) directly rather than secondary social forwards.")
        elif "Conspiracy" in primary_category or "Public Figure" in primary_category:
            verification_steps.insert(0, "Search Google Fact Check Tools, Snopes, or PolitiFact to verify if this specific claim has already been debunked.")
        elif "Financial" in primary_category or "Chain-Letter" in primary_category:
            verification_steps.insert(0, "Check official government portals (FTC, SEC, RBI) before acting on any monetary or giveaway promises.")

        # Explicit limitations note
        limitations = (
            "IMPORTANT NOTICE: The TruthLens Risk Index measures linguistic, stylistic, and rhetorical risk markers. "
            "It does NOT verify real-world facts, prove falsehood, or assess physical truth. "
            "Fabricated narratives may be written in formal language, and authentic urgent reports can use emotional terms. "
            "Always consult primary institutional documentation."
        )

        return {
            "title": title or (cleaned_content[:60] + "..." if len(cleaned_content) > 60 else cleaned_content),
            "sourceUrl": source_url,
            "riskScore": final_score,
            "riskLevel": risk_level,
            "category": primary_category,
            "summary": summary,
            "explanation": explanation,
            "warningSignals": warning_signals,
            "positiveSignals": positive_signals,
            "metrics": {
                **metrics,
                "sensationalismScore": sensationalism_subscore,
                "attributionScore": attribution_subscore,
                "urgencyScore": urgency_subscore,
            },
            "verificationSteps": verification_steps,
            "limitations": limitations,
            "providerInfo": {
                "providerId": self.provider_id,
                "providerName": self.provider_name,
                "providerMode": self.provider_mode,
                "disclaimer": "TruthLens Advanced Heuristic NLP Engine: Multi-layer pattern recognition and misinformation risk detection."
            }
        }
