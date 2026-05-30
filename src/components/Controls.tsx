/**
 * Controls.tsx — every input from spec §4, bound to URL state.
 * Each control carries an ⓘ explaining what it means and what it assumes.
 */
import {
  FX,
  INDIA_SCHOOL_LAKH,
  LIFESTYLE_MULT,
  REAL_RETURN_MAX,
  REAL_RETURN_MIN,
  RENT_YIELD,
  SWR_MAX,
  SWR_MIN,
  US_SCHOOL_USD,
} from "../data/assumptions";
import { inrCompact, pct, usdCompact, usdFull } from "../lib/format";
import type { Inputs } from "../lib/model";
import { LabeledSlider, Segmented } from "./ui";

export function Controls({
  inputs,
  patch,
}: {
  inputs: Inputs;
  patch: (p: Partial<Inputs>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Segmented
        label="Buy or rent"
        value={inputs.tenure}
        onChange={(v) => patch({ tenure: v })}
        options={[
          { value: "buy", label: "Buy" },
          { value: "rent", label: "Rent" },
        ]}
        info={
          <>
            <b>Buy</b> puts the home price + transaction costs into your{" "}
            <i>upfront</i> number. <b>Rent</b> drops the purchase and instead adds
            annual rent (at {RENT_YIELD.india}% of value in India, {RENT_YIELD.us}% in
            the US) to spending, which grows the invested corpus instead.
          </>
        }
      />

      <Segmented
        label="Home type"
        value={inputs.homeType}
        onChange={(v) => patch({ homeType: v })}
        options={[
          { value: "3bhk", label: "3 BHK" },
          { value: "4bhk", label: "4 BHK" },
          { value: "5bhk", label: "5 BHK" },
          { value: "penthouse", label: "Penthouse" },
          { value: "bungalow", label: "Bungalow" },
        ]}
        info={
          <>
            Built-up size. In India this drives price via ₹/sqft. In the US it scales
            the metro's family-home anchor relative to a 4&nbsp;BHK / 4BR baseline.
          </>
        }
      />

      <Segmented
        label="Segment"
        value={inputs.segment}
        onChange={(v) => patch({ segment: v })}
        options={[
          { value: "mid", label: "Mid" },
          { value: "premium", label: "Premium" },
          { value: "luxury", label: "Luxury" },
        ]}
        info={
          <>
            Build/finish quality. India uses a per-city rate card; the US scales the
            home anchor (Mid 0.7×, Premium 1.0×, Luxury 1.6×).
          </>
        }
      />

      <Segmented
        label="Lifestyle"
        value={inputs.lifestyle}
        onChange={(v) => patch({ lifestyle: v })}
        options={[
          { value: "comfortable", label: `Comfortable ${LIFESTYLE_MULT.comfortable}×` },
          { value: "affluent", label: `Affluent ${LIFESTYLE_MULT.affluent}×` },
          { value: "luxury", label: `Luxury ${LIFESTYLE_MULT.luxury}×` },
        ]}
        info={
          <>
            Scales each city's <i>own</i> base spending, so "Affluent" means
            locally-equivalent comfort — <b>not</b> equal dollars. $2M in Bengaluru is
            not a $2M lifestyle in SF, and the model doesn't pretend it is.
          </>
        }
      />

      <Segmented<0 | 1 | 2>
        label="Kids"
        value={inputs.kids}
        onChange={(v) => patch({ kids: v })}
        options={[
          { value: 0, label: "0" },
          { value: 1, label: "1" },
          { value: 2, label: "2" },
        ]}
        info={<>Number of children in school — drives the schooling line below.</>}
      />

      {inputs.kids > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Segmented
            label="School · India"
            value={inputs.indiaSchool}
            onChange={(v) => patch({ indiaSchool: v })}
            options={[
              { value: "good", label: "Good" },
              { value: "premium", label: "Premium" },
              { value: "elite", label: "Elite" },
            ]}
            info={
              <>
                ICSE fee tier, per child per year (₹{INDIA_SCHOOL_LAKH.good}L / ₹
                {INDIA_SCHOOL_LAKH.premium}L / ₹{INDIA_SCHOOL_LAKH.elite}L). CBSE & IB
                tiers arrive in v6.1.
              </>
            }
          />
          <Segmented
            label="School · US"
            value={inputs.usSchool}
            onChange={(v) => patch({ usSchool: v })}
            options={[
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
            ]}
            info={
              <>
                Public is $0 marginal (you already paid for it in the
                good-district home). Private is ${US_SCHOOL_USD.private / 1000}k per
                child per year.
              </>
            }
          />
          <p className="-mt-1 text-[12px] text-paper-muted dark:text-night-muted sm:col-span-2">
            Keep both: the India tier is used for Indian cities and the US tier for US
            cities, since the table ranks them together.
          </p>
        </div>
      )}

      <Segmented<0 | 1 | 2>
        label="Who works"
        value={inputs.workers}
        onChange={(v) => patch({ workers: v })}
        options={[
          { value: 0, label: "Neither" },
          { value: 1, label: "One" },
          { value: 2, label: "Both" },
        ]}
        info={
          <>
            Ongoing earners. Their after-tax income covers part of annual spending, so
            only the <i>uncovered</i> remainder needs an invested corpus. Salary is
            taxed where you live.
          </>
        }
      />

      {inputs.workers > 0 && (
        <div className="flex flex-col gap-5">
          <LabeledSlider
            label="Salary per earner · US"
            min={0}
            max={1_000_000}
            step={10_000}
            value={inputs.salaryUsdPerEarner}
            onChange={(v) => patch({ salaryUsdPerEarner: v })}
            format={(v) => usdCompact(v)}
            info={
              <>
                Gross $/earner if you're working in a <b>US</b> city. Taxed federal +
                state where you live.
              </>
            }
          />
          <LabeledSlider
            label="Salary per earner · India"
            min={0}
            max={50_000_000}
            step={500_000}
            value={inputs.salaryInrPerEarner}
            onChange={(v) => patch({ salaryInrPerEarner: v })}
            format={(v) => inrCompact(v)}
            info={
              <>
                Gross ₹/earner if you're working in an <b>India</b> city. Taxed under the
                new regime. Kept separate from the US figure on purpose — earning power
                really differs by country, so the same person usually earns a different
                amount in each.
              </>
            }
          />
          <p className="-mt-1 text-[12px] text-paper-muted dark:text-night-muted">
            Each salary applies only to its own country's cities.
          </p>
        </div>
      )}

      <LabeledSlider
        label="Net worth today"
        min={0}
        max={10_000_000}
        step={50_000}
        value={inputs.netWorthUsd}
        onChange={(v) => patch({ netWorthUsd: v })}
        format={(v) => (
          <span>
            {usdCompact(v)}{" "}
            <span className="text-paper-muted dark:text-night-muted">
              · {inrCompact(v * FX)}
            </span>
          </span>
        )}
        info={<>Investable liquid net worth today, in USD (₹ shown alongside).</>}
      />

      <LabeledSlider
        label="Real return"
        min={REAL_RETURN_MIN}
        max={REAL_RETURN_MAX}
        step={0.5}
        value={inputs.realReturnPct}
        onChange={(v) => patch({ realReturnPct: v })}
        format={(v) => pct(v, 1)}
        info={
          <>
            Expected annual return <i>after inflation</i>. Used to grow your net worth
            toward the target for the years-to-fund estimate.
          </>
        }
      />

      <LabeledSlider
        label="Withdrawal rate (SWR)"
        min={SWR_MIN}
        max={SWR_MAX}
        step={0.1}
        value={inputs.swrPct}
        onChange={(v) => patch({ swrPct: v })}
        format={(v) => pct(v, 1)}
        info={
          <>
            Lower is safer. We apply one rate to every city so the comparison is
            apples-to-apples. India retirements are often modeled near 2.5% (longer
            horizons); the US near 3.5%. Drag it down to stress-test.
          </>
        }
      />

      <div className="grid grid-cols-2 gap-5">
        <LabeledSlider
          label="Current age"
          min={25}
          max={55}
          step={1}
          value={inputs.currentAge}
          onChange={(v) => patch({ currentAge: v })}
          format={(v) => `${v}`}
          info={<>Your age today — the start point for years-to-fund.</>}
        />
        <LabeledSlider
          label="Plan until"
          min={80}
          max={100}
          step={1}
          value={inputs.planUntilAge}
          onChange={(v) => patch({ planUntilAge: v })}
          format={(v) => `${v}`}
          info={<>The age your money must last to. Funding past this shows a flag.</>}
        />
      </div>

      <LabeledSlider
        label="One-time move-in costs"
        min={0}
        max={200_000}
        step={5_000}
        value={inputs.setupUsd}
        onChange={(v) => patch({ setupUsd: v })}
        format={(v) => (
          <span>
            {usdFull(v)}{" "}
            <span className="text-paper-muted dark:text-night-muted">
              · {inrCompact(v * FX)}
            </span>
          </span>
        )}
        info={
          <>
            A single up-front cost for getting settled — furniture, a car, deposits, the
            move itself. You set the amount; it's added to your upfront total (not a
            recurring cost). ₹/$ converted at {FX}/$.
          </>
        }
      />
    </div>
  );
}
