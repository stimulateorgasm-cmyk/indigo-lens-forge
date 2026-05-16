
-- analytics_events
CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  props jsonb,
  session_id text,
  path text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(event_name) BETWEEN 1 AND 100
  AND (session_id IS NULL OR length(session_id) <= 100)
  AND (path IS NULL OR length(path) <= 500)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);

-- leads: status + notes
ALTER TABLE public.leads
  ADD COLUMN status text NOT NULL DEFAULT 'new',
  ADD COLUMN notes text;

CREATE OR REPLACE FUNCTION public.validate_lead_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('new', 'in_progress', 'closed') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 5000 THEN
    RAISE EXCEPTION 'Notes too long';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_lead_status_trigger
BEFORE INSERT OR UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.validate_lead_status();
