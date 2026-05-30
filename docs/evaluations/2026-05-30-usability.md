# Usability study — moderated walkthrough, 3 personas

Date: 2026-05-30 · Build: v0.10.1 (production) · Method: think-aloud intro + task flow
as each persona, analyzed through a B2C / behavioral-design lens (Nielsen heuristics +
cognitive load, anchoring, self-reference, loss-aversion, peak-end, social proof,
affordances). Personas: [personas.md](../personas.md).

**One-line verdict:** the product is *comprehensible and credible* — the hard parts —
but the first screen doesn't yet feel like it's about *me*, and that relevance gap is
the biggest leak across the largest audience.

---

## P1 — Arjun, the Builder-Optimizer

**Intro (first 5s).** Header tells him what it is; the sticky "$1,630,690" is concrete.
His reflex: *"says who? how is this computed?"* He finds the ⓘ on the headline and the
per-row **"show the math"** — and visibly relaxes when the ledger reconciles to the dollar.

**Flow.** Switches to **Advanced**, notices **per-geography salary** ("good — a US
salary isn't an India salary") and approves. Tweaks SWR and real return, watches the
re-rank. Tries to stress-test the *inputs he doesn't control* — FX, home prices — and
can't. Wants to know how fragile the number is.

✅ **Worked**
- Transparency: show-the-math + sourced, dated caveats = real credibility.
- Per-geo salary and Advanced mode give him the control he expects.
- URL-as-state: he can save and share an exact scenario.

⚠️ **Friction**
- **No uncertainty.** A single point estimate *over-claims precision*. For an engineer,
  precision without error bars reads as naïve — paradoxically *less* trustworthy. He
  wants a band ("±15% on prices → $1.4M–$1.9M").
- **Can't audit the assumptions he most doubts** (FX, local prices). The math is visible
  but its *inputs* aren't editable.
- The default "neither working" + a $1.6M number is a jarring anchor before he's set
  anything.

*Behavioral read:* trust for an analytical user comes from **falsifiability** —
ranges, editable assumptions — not just a visible formula.

---

## P2 — Devang, the Settled Engineer

**Intro (mobile, from a WhatsApp link).** Lands on a city + big number. First thought:
*"whose situation is this?"* The default assumes **neither partner works** and \$1M net
worth — he's employed. The number feels like it's for a retiree, not him.

**Flow.** He wants a 20-second "could we even afford to move back?" Sets **Who works →
Both**, types his salary (the **editable number** field is fast), sets net worth. India
options appear. He never opens Advanced (good — low load). Skims the plain-English
summary for the takeaway.

✅ **Worked**
- **Quick mode** keeps cognitive load low (Hick's law respected).
- **Editable numbers** = fast, precise entry on mobile.
- Instant re-rank; the summary gives a takeaway without reading every control.

⚠️ **Friction**
- **Default mismatch = relevance failure.** "Neither working" makes the first, anchoring
  number look wrong for an employed person. Highest bounce risk for the *largest* arriving
  audience (share recipients).
- **No anchor to his life.** It never asks "where are you now?", so he can't see the
  one thing he actually wants — *"you spend ~\$X in SF; Hyderabad is \$Y"* — the **delta**,
  not the absolute.
- Summary is a dense paragraph; he skims and could miss the point.

*Behavioral read:* the **self-reference effect** — people engage when the scenario looks
like *their* life. A default that mirrors "employed couple," or one onboarding question,
flips relevance.

---

## P3 — Meera, the Determined Returner

**Intro.** She's already chosen India. The default list is **India + US mixed** — the US
rows are noise to her. She doesn't immediately realize she can remove them.

**Flow.** She wants *"where in India can we afford, and are we ready?"* She eventually
finds the **India** filter (top-right of the table) and the clutter clears. She looks for
*life* signals — schools, air, family proximity — and finds only the **AQI** flag. She
lowers SWR / raises net worth and hits **"Already funded"** — a genuine delight moment.

✅ **Worked**
- The **India filter** (once found) gives her the focused view.
- **"Funded by age 42"** is a concrete readiness anchor; the AQI flag is a life signal
  she values.
- The green **"Already funded"** state is an emotional peak.

⚠️ **Friction**
- **Filter discoverability.** Default "Both" buries her intent; the filter is easy to miss.
- **Money-only.** Her decision is ≥50% non-financial (school quality, air, family,
  healthcare); only AQI exists. She wants more lived-life context.
- **Her hometown may be missing** — only 4 India cities. If "her" city isn't listed, the
  personalization breaks and trust drops.
- No *readiness narrative* tuned to her ("you're 80% there — ~3 years to go!"); the data
  exists but isn't emotionally framed.

*Behavioral read:* she's emotionally **committed** and seeks *validation + a milestone*,
plus non-financial reassurance. A missing hometown is a personalization cliff.

---

## Synthesis — what a B2C designer takes from this

Patterns, ranked by leverage:

1. **The relevance gap (the big one).** P2 and P3 — the largest, share-arriving audience —
   don't see *their* life on the first screen. The default scenario anchors a number for
   the wrong person, and there's no tie to the visitor's current city. *Self-reference +
   anchoring* say this is the #1 engagement leak.
2. **Trust needs uncertainty, not just transparency (P1).** Show-the-math is necessary but
   not sufficient; a sensitivity band would *raise* perceived rigor.
3. **The stay-or-go delta is unbuilt.** Everyone (P1 delta, P2 relevance, P3 contrast)
   implicitly wants *"moving from A to B frees \$X / N years sooner"* — the literal
   decision — yet we only show absolutes.
4. **Peak-end design is half-done.** "Already funded" is a great peak (lean in); "out of
   reach" is a dead end (needs a gentle, forward-looking frame). The end-feeling is what
   gets remembered and shared.
5. **Discoverability + affordances.** The India/US filter hides; the funded meter still
   risks reading as a control.
6. **Social proof is absent.** B2C trust usually wants a "others are figuring this out
   too" signal — none yet.

## Prioritized recommendations

**P0 — close the relevance gap (largest TAM unlock)**
- Smarter first scenario: default to an *employed couple* (or a one-question intro: "Are
  you still working?"), so the first anchor fits the arriving majority.
- Add a lightweight **"Where are you now?"** (current city + rough spend), which unlocks…
- …the **stay-or-go delta**: *"Hyderabad vs your SF: frees ~\$X, ~N years sooner."* This
  is the single highest-impact feature — it turns a generic calculator into "this is about
  *me*," which drives both engagement and sharing.

**P1 — deepen trust & emotion**
- **Sensitivity band** on the total (±15% prices / FX) — rigor for P1.
- **Filter discoverability** — make India/US/Both more prominent (or infer intent).
- **Peak-end polish** — celebrate "already funded"; reframe "out of reach" as *"here's
  what closes the gap."*

**P2 — breadth & proof**
- More **sourced** India cities (hometowns) and the no-tax US door.
- Funded-meter redesign (unmistakably a read-out).
- A light **social-proof** element once there's real usage.

## The one thing to fix first
**Make the first screen reflect the visitor's real life** — a default that fits an
employed couple plus a "your current city" anchor that yields the stay-or-go delta.
Relevance is the lever that converts curiosity into engagement and a share.
