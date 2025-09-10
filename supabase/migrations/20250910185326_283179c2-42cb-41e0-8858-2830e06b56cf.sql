-- Drop and recreate views without SECURITY DEFINER to fix security issues

-- Drop existing views
DROP VIEW IF EXISTS public.rating_trends;
DROP VIEW IF EXISTS public.findings_summary;
DROP VIEW IF EXISTS public.project_summaries;

-- Recreate rating_trends view without SECURITY DEFINER
CREATE VIEW public.rating_trends AS
SELECT ratings.pillar_title,
    ratings.practice_name,
    ratings.rating,
    count(*) AS rating_count,
    avg(
        CASE
            WHEN ((ratings.rating)::text = 'Largely in Place'::text) THEN 3
            WHEN ((ratings.rating)::text = 'Somewhat in Place'::text) THEN 2
            WHEN ((ratings.rating)::text = 'Not in Place'::text) THEN 1
            ELSE 0
        END) AS rating_score
   FROM ratings
  GROUP BY ratings.pillar_title, ratings.practice_name, ratings.rating;

-- Recreate findings_summary view without SECURITY DEFINER
CREATE VIEW public.findings_summary AS
SELECT ratings.project_name,
    ratings.assessment_date,
    ratings.pillar_title,
    count(
        CASE
            WHEN ((ratings.findings IS NOT NULL) AND (ratings.findings <> ''::text)) THEN 1
            ELSE NULL::integer
        END) AS practices_with_findings,
    count(*) AS total_practices
   FROM ratings
  GROUP BY ratings.project_name, ratings.assessment_date, ratings.pillar_title;

-- Recreate project_summaries view without SECURITY DEFINER
CREATE VIEW public.project_summaries AS
SELECT ratings.project_name,
    ratings.assessment_date,
    ratings.pillar_title,
    count(*) AS total_practices,
    count(
        CASE
            WHEN ((ratings.rating)::text = 'Largely in Place'::text) THEN 1
            ELSE NULL::integer
        END) AS largely_in_place,
    count(
        CASE
            WHEN ((ratings.rating)::text = 'Somewhat in Place'::text) THEN 1
            ELSE NULL::integer
        END) AS somewhat_in_place,
    count(
        CASE
            WHEN ((ratings.rating)::text = 'Not in Place'::text) THEN 1
            ELSE NULL::integer
        END) AS not_in_place,
    count(
        CASE
            WHEN (ratings.rating IS NULL) THEN 1
            ELSE NULL::integer
        END) AS not_rated
   FROM ratings
  GROUP BY ratings.project_name, ratings.assessment_date, ratings.pillar_title;