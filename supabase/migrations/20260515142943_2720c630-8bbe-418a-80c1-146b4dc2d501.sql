
drop policy "Anyone can submit leads" on public.leads;
create policy "Anyone can submit leads"
on public.leads
for insert
to anon, authenticated
with check (
  length(name) between 1 and 200
  and length(contact) between 1 and 200
  and (variant is null or variant in ('top','bottom'))
);

drop policy "Anyone can record visits" on public.page_visits;
create policy "Anyone can record visits"
on public.page_visits
for insert
to anon, authenticated
with check (
  (path is null or length(path) <= 500)
  and (session_id is null or length(session_id) <= 100)
);
