-- Clean stored China GDP compare leftovers that the IMF/SIPRI scorecard
-- does not replace: a second "Expected Growth Rate 2026" row, and stale
-- dollar / life / HDI / population figures in pros, descriptions, and analysis.
--
-- Figures written here are the ones already on the official scorecard
-- (IMF WEO April 2026, SIPRI 2024, World Bank 2024 life expectancy,
-- UNDP HDR 2025 HDI). Population 1.417 billion is aligned to the 1.42 billion
-- figure already stored on the same page. No new source URL is added.
-- is_human_reviewed is not changed.
--
-- `prisma migrate deploy` runs only when VERCEL_ENV=production
-- (scripts/vercel-build.mjs). Preview builds skip it.
--
-- Each statement is guarded by the old text. A second run matches zero rows.

CREATE FUNCTION pg_temp.map_items(items text[], swaps jsonb)
RETURNS text[]
LANGUAGE sql
AS $$
  SELECT COALESCE(
    array_agg(COALESCE(swaps ->> u.item, u.item) ORDER BY u.ord),
    ARRAY[]::text[]
  )
  FROM unnest(items) WITH ORDINALITY AS u(item, ord);
$$;

-- us-vs-china-gdp: drop the stale growth row. The scorecard already has
-- 2026 real GDP growth at 2.3% / 4.4%.
UPDATE "comparisons"
SET
  "key_differences" = (
    SELECT COALESCE(jsonb_agg(elem ORDER BY ord), '[]'::jsonb)
    FROM jsonb_array_elements("key_differences") WITH ORDINALITY AS t(elem, ord)
    WHERE lower(elem ->> 'label') NOT LIKE '%expected growth%'
  ),
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'us-vs-china-gdp'
  AND "key_differences"::text ILIKE '%expected growth%';

DELETE FROM "attribute_values" AS av
USING "attributes" AS a, "entities" AS e, "comparison_entities" AS ce, "comparisons" AS c
WHERE av."attribute_id" = a."id"
  AND av."entity_id" = e."id"
  AND ce."entity_id" = e."id"
  AND ce."comparison_id" = c."id"
  AND c."slug" = 'us-vs-china-gdp'
  AND a."name" ILIKE '%expected growth rate%';

UPDATE "entities"
SET
  "short_desc" = $n$World's largest advanced economy with 2026 nominal GDP of $32.38 trillion (IMF WEO April 2026) and 335 million population$n$,
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'united-states-economy'
  AND "short_desc" = $o$World's largest advanced economy with $27.4 trillion nominal GDP and 335 million population$o$;

UPDATE "entities"
SET
  "short_desc" = $n$World's largest economy ($32.38 trillion nominal GDP, IMF WEO April 2026), led by technology, finance, and consumer spending.$n$,
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'us-economy'
  AND "short_desc" = $o$World's largest economy ($27.4T nominal GDP) led by technology, finance, and consumer spending.$o$;

UPDATE "entities"
SET
  "short_desc" = $n$World's second-largest economy with 2026 nominal GDP of $20.85 trillion (IMF WEO April 2026) and 1.43 billion population$n$,
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'china-economy'
  AND "short_desc" = $o$World's second-largest economy with $17.9 trillion nominal GDP and 1.43 billion population$o$;

UPDATE "entities"
SET
  "short_desc" = $n$World's largest economy with output per person of $94,430 (IMF WEO April 2026) and an advanced service sector$n$,
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'united-states'
  AND "short_desc" = $o$World's largest economy with $76,398 GDP per capita and advanced service sector$o$;

UPDATE "comparison_entities" AS ce
SET
  "pros" = pg_temp.map_items(ce."pros", jsonb_build_object(
    $o1$Highest nominal GDP at $30+ trillion globally$o1$,
    $n1$Largest nominal GDP at $32.38 trillion, IMF WEO April 2026$n1$,
    $o2$Highest per capita GDP at $89,000+, indicating strong productivity$o2$,
    $n2$Output per person of $94,430, IMF WEO April 2026$n2$
  )),
  "cons" = pg_temp.map_items(ce."cons", jsonb_build_object(
    $o3$Slower GDP growth rate (2-2.5%) compared to China's 4.5-5%$o3$,
    $n3$Real GDP growth of 2.3% in 2026, slower than China's 4.4% (IMF WEO April 2026)$n3$
  ))
FROM "comparisons" AS c, "entities" AS e
WHERE ce."comparison_id" = c."id"
  AND ce."entity_id" = e."id"
  AND c."slug" = 'us-vs-china-gdp'
  AND e."slug" = 'united-states-economy'
  AND (
    $o1$Highest nominal GDP at $30+ trillion globally$o1$ = ANY (ce."pros")
    OR $o3$Slower GDP growth rate (2-2.5%) compared to China's 4.5-5%$o3$ = ANY (ce."cons")
  );

UPDATE "comparison_entities" AS ce
SET
  "pros" = pg_temp.map_items(ce."pros", jsonb_build_object(
    $o1$Fastest-growing major economy at 4.5-5% target growth for 2026$o1$,
    $n1$Real GDP growth of 4.4% in 2026, IMF WEO April 2026$n1$
  )),
  "cons" = pg_temp.map_items(ce."cons", jsonb_build_object(
    $o2$Significantly lower nominal GDP at $19 trillion versus US $30+ trillion$o2$,
    $n2$Nominal GDP of $20.85 trillion, below the United States at $32.38 trillion (IMF WEO April 2026)$n2$,
    $o3$Per capita GDP around $13,500, reflecting lower average living standards$o3$,
    $n3$Output per person of $14,874, IMF WEO April 2026$n3$
  ))
FROM "comparisons" AS c, "entities" AS e
WHERE ce."comparison_id" = c."id"
  AND ce."entity_id" = e."id"
  AND c."slug" = 'us-vs-china-gdp'
  AND e."slug" = 'china-economy'
  AND (
    $o1$Fastest-growing major economy at 4.5-5% target growth for 2026$o1$ = ANY (ce."pros")
    OR $o2$Significantly lower nominal GDP at $19 trillion versus US $30+ trillion$o2$ = ANY (ce."cons")
  );

UPDATE "comparisons"
SET
  "content" = jsonb_set(
    "content",
    '{expertAnalysis}',
    to_jsonb(
      replace(
        replace(
          replace(
            "content" ->> 'expertAnalysis',
            $o1$As of 2026, the US nominal GDP stands at approximately $30.3 trillion, while China's sits near $19.5 trillion — a gap of roughly $10.8 trillion (IMF World Economic Outlook, 2026). That spread sounds comfortable until you factor in growth trajectories. The US is expanding at around 2.6% annually, while China, despite post-pandemic structural headwinds in its property sector, is still clocking 4.8% to 5.0% growth.$o1$,
            $n1$The IMF World Economic Outlook of April 2026 puts 2026 nominal GDP at $32.38 trillion for the United States and $20.85 trillion for China. Real GDP growth in 2026 is 2.3% in the United States and 4.4% in China.$n1$
          ),
          $o2$When adjusted for purchasing power parity, China already surpassed the US in 2016 and continues to widen that lead, with its PPP-adjusted GDP now estimated at approximately $36.1 trillion (World Bank, 2026).$o2$,
          $n2$When adjusted for purchasing power parity, China is larger.$n2$
        ),
        $o3$US GDP per capita is approximately $89,000 versus China's $13,800$o3$,
        $n3$output per person is $94,430 in the United States and $14,874 in China$n3$
      )
    )
  ),
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'us-vs-china-gdp'
  AND "content" ->> 'expertAnalysis' LIKE '%$30.3 trillion%';

-- us-economy-vs-china-economy
UPDATE "comparison_entities" AS ce
SET "pros" = pg_temp.map_items(ce."pros", jsonb_build_object(
  $o1$$25.5T GDP$o1$, $n1$$32.38 trillion nominal GDP, IMF WEO April 2026$n1$,
  $o2$$76,300 GDP per capita$o2$, $n2$$94,430 GDP per capita, IMF WEO April 2026$n2$
))
FROM "comparisons" AS c, "entities" AS e
WHERE ce."comparison_id" = c."id"
  AND ce."entity_id" = e."id"
  AND c."slug" = 'us-economy-vs-china-economy'
  AND e."slug" = 'us-economy'
  AND $o1$$25.5T GDP$o1$ = ANY (ce."pros");

UPDATE "comparison_entities" AS ce
SET "cons" = pg_temp.map_items(ce."cons", jsonb_build_object(
  $o1$$12,500 GDP per capita$o1$, $n1$$14,874 GDP per capita, IMF WEO April 2026$n1$
))
FROM "comparisons" AS c, "entities" AS e
WHERE ce."comparison_id" = c."id"
  AND ce."entity_id" = e."id"
  AND c."slug" = 'us-economy-vs-china-economy'
  AND e."slug" = 'china-economy'
  AND $o1$$12,500 GDP per capita$o1$ = ANY (ce."cons");

UPDATE "comparisons"
SET
  "content" = jsonb_set(
    "content",
    '{expertAnalysis}',
    to_jsonb(replace(
      "content" ->> 'expertAnalysis',
      $o1$US nominal GDP reached approximately $30.76 trillion in 2025, representing continued strong growth. China's nominal GDP of approximately $17.7 trillion in 2023 has grown but at a more moderate pace than the pre-pandemic trajectory suggested.$o1$,
      $n1$The IMF World Economic Outlook of April 2026 puts 2026 nominal GDP at $32.38 trillion for the United States and $20.85 trillion for China.$n1$
    ))
  ),
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'us-economy-vs-china-economy'
  AND "content" ->> 'expertAnalysis' LIKE '%$17.7 trillion%';

-- usa-vs-china
UPDATE "comparison_entities" AS ce
SET "pros" = pg_temp.map_items(ce."pros", jsonb_build_object(
  $o1$Largest economy ($25.5T)$o1$,
  $n1$Largest nominal economy ($32.38 trillion, IMF WEO April 2026)$n1$
))
FROM "comparisons" AS c, "entities" AS e
WHERE ce."comparison_id" = c."id"
  AND ce."entity_id" = e."id"
  AND c."slug" = 'usa-vs-china'
  AND e."slug" = 'united-states'
  AND $o1$Largest economy ($25.5T)$o1$ = ANY (ce."pros");

UPDATE "comparisons"
SET
  "content" = jsonb_set(
    "content",
    '{expertAnalysis}',
    to_jsonb(
      replace(
        replace(
          "content" ->> 'expertAnalysis',
          $o1$by nominal GDP, reaching approximately $30.7 trillion in 2025. China's nominal GDP of $17.7 trillion is the world's second largest$o1$,
          $n1$by nominal GDP. The IMF World Economic Outlook of April 2026 puts 2026 nominal GDP at $32.38 trillion for the United States and $20.85 trillion for China. China's total is the world's second largest$n1$
        ),
        $o2$The US defense budget of approximately $886 billion annually dwarfs China's official figure of $246 billion$o2$,
        $n2$SIPRI 2024 military expenditure is $997 billion for the United States and an estimated $314 billion for China$n2$
      )
    )
  ),
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'usa-vs-china'
  AND "content" ->> 'expertAnalysis' LIKE '%$17.7 trillion%';

-- japan-vs-china: one figure per metric, using the scorecard values.
UPDATE "comparisons"
SET
  "key_differences" = (
    SELECT COALESCE(jsonb_agg(
      CASE
        WHEN elem ->> 'label' = 'Population' AND elem ->> 'entityBValue' = '1.417 billion'
          THEN jsonb_set(elem, '{entityBValue}', '"1.42 billion"')
        ELSE elem
      END
      ORDER BY ord
    ), '[]'::jsonb)
    FROM jsonb_array_elements("key_differences") WITH ORDINALITY AS t(elem, ord)
  ),
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'japan-vs-china'
  AND "key_differences"::text LIKE '%1.417 billion%';

UPDATE "comparison_entities" AS ce
SET
  "pros" = pg_temp.map_items(ce."pros", jsonb_build_object(
    $o1$Highest per capita GDP ($39,285) in comparison—living standards among world's best$o1$,
    $n1$Highest per capita GDP ($35,703, IMF WEO April 2026) in comparison—living standards among world's best$n1$,
    $o2$Life expectancy of 84.6 years—highest in Asia and among world's longest$o2$,
    $n2$Life expectancy of 84.04 years (World Bank 2024)—highest in Asia and among world's longest$n2$,
    $o3$HDI of 0.920 (Very High)—excellent healthcare, education, and social services$o3$,
    $n3$HDI of 0.925 (Very high, UNDP HDR 2025)—excellent healthcare, education, and social services$n3$
  )),
  "cons" = pg_temp.map_items(ce."cons", jsonb_build_object(
    $o4$Lower total GDP ($4.2T) makes less global economic influence than China or USA$o4$,
    $n4$Smaller nominal GDP ($4.38 trillion, IMF WEO April 2026) than China or the United States$n4$
  ))
FROM "comparisons" AS c, "entities" AS e
WHERE ce."comparison_id" = c."id"
  AND ce."entity_id" = e."id"
  AND c."slug" = 'japan-vs-china'
  AND e."slug" = 'japan'
  AND (
    $o1$Highest per capita GDP ($39,285) in comparison—living standards among world's best$o1$ = ANY (ce."pros")
    OR $o4$Lower total GDP ($4.2T) makes less global economic influence than China or USA$o4$ = ANY (ce."cons")
  );

UPDATE "comparison_entities" AS ce
SET
  "pros" = pg_temp.map_items(ce."pros", jsonb_build_object(
    $o1$Nominal GDP of $17.9 trillion (2024)—second only to USA, commands 18% of global trade$o1$,
    $n1$Nominal GDP of $20.85 trillion (IMF WEO April 2026)—second only to the United States, commands 18% of global trade$n1$,
    $o2$1.417 billion population provides massive consumer market and labor force$o2$,
    $n2$1.42 billion population provides massive consumer market and labor force$n2$
  )),
  "cons" = pg_temp.map_items(ce."cons", jsonb_build_object(
    $o3$Per capita GDP of only $12,720—wealth concentrated, 1/3 of Japan's living standard per person$o3$,
    $n3$Per capita GDP of $14,874 (IMF WEO April 2026)—below Japan's output per person$n3$,
    $o4$HDI of 0.796 (High)—below developed nations; air/water pollution affects 300+ million citizens$o4$,
    $n4$HDI of 0.797 (High, UNDP HDR 2025)—below developed nations; air/water pollution affects 300+ million citizens$n4$
  ))
FROM "comparisons" AS c, "entities" AS e
WHERE ce."comparison_id" = c."id"
  AND ce."entity_id" = e."id"
  AND c."slug" = 'japan-vs-china'
  AND e."slug" = 'china'
  AND (
    $o1$Nominal GDP of $17.9 trillion (2024)—second only to USA, commands 18% of global trade$o1$ = ANY (ce."pros")
    OR $o2$1.417 billion population provides massive consumer market and labor force$o2$ = ANY (ce."pros")
  );

UPDATE "comparisons"
SET
  "content" = jsonb_set(
    "content",
    '{expertAnalysis}',
    to_jsonb(
      replace(
        replace(
          "content" ->> 'expertAnalysis',
          $o1$China's GDP of approximately $17.7 trillion (nominal, 2024) is roughly three times Japan's $4.2 trillion — a gap that reflects China's scale advantage of having four times Japan's population (1.4 billion vs 125 million). However, Japan's GDP per capita ($33,000+ nominal) remains higher than China's ($12,500 nominal)$o1$,
          $n1$The IMF World Economic Outlook of April 2026 puts 2026 nominal GDP at $20.85 trillion for China and $4.38 trillion for Japan. China's population is larger (1.42 billion vs 125 million). Output per person is higher in Japan ($35,703) than in China ($14,874)$n1$
        ),
        $o2$approximately $55 billion in 2024$o2$,
        $n2$$55.3 billion, SIPRI 2024$n2$
      )
    )
  ),
  "updated_at" = TIMESTAMP '2026-10-05 12:00:00'
WHERE "slug" = 'japan-vs-china'
  AND "content" ->> 'expertAnalysis' LIKE '%$17.7 trillion%';
