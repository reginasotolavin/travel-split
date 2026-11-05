CREATE TABLE IF NOT EXISTS public.chat_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  destination text,
  group_size int,
  budget text,
  message_count int,
  guardrail_triggered boolean,
  used_fallback boolean,
  rating int CHECK (rating BETWEEN 1 AND 5),
  comment text
);

ALTER TABLE public.chat_tests ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.chat_tests FROM anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.chat_tests TO anon, authenticated;

DROP POLICY IF EXISTS "Allow select chat_tests" ON public.chat_tests;
CREATE POLICY "Allow select chat_tests"
ON public.chat_tests
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow insert chat_tests" ON public.chat_tests;
CREATE POLICY "Allow insert chat_tests"
ON public.chat_tests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
