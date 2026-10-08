CREATE TABLE IF NOT EXISTS pricing_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  scenario text NOT NULL,
  university_users int,
  organizer_users int,
  annual_share numeric,
  conversion_rate numeric,
  monthly_revenue numeric,
  annual_revenue numeric
);

ALTER TABLE pricing_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select pricing_scenarios"
ON pricing_scenarios
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon insert pricing_scenarios"
ON pricing_scenarios
FOR INSERT
TO anon
WITH CHECK (true);
