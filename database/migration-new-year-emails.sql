-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- Adds the optional New Year email: a sealed copy of the wish for the email job,
-- and a separate table for the addresses that the website can never read.

alter table wishes
  add column if not exists email_sealed text check (char_length(email_sealed) <= 4000);

create table if not exists wish_emails (
  invitation_id uuid not null references invitations(id) on delete cascade,
  author text not null check (author in ('sender', 'receiver')),
  email text check (email is null or (char_length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (invitation_id, author)
);

-- No policies on purpose: the website cannot read or write this table directly.
alter table wish_emails enable row level security;

drop function if exists submit_wish(uuid, text);
drop function if exists submit_wish(uuid, text, text, text);

create or replace function submit_wish(p_token uuid, p_wish text, p_email text default null, p_sealed text default null)
returns void language plpgsql security definer set search_path = public as $$
declare inv invitations; r text; e text := nullif(trim(coalesce(p_email, '')), '');
begin
  select * into inv from invitations
   where sender_token = p_token or receiver_token = p_token;
  if not found then raise exception 'Invalid link'; end if;
  if now() >= inv.reveal_at then raise exception 'Wishes are already revealed'; end if;
  if e is not null and p_sealed is null then raise exception 'Missing sealed copy'; end if;
  r := case when inv.sender_token = p_token then 'sender' else 'receiver' end;

  insert into wishes (invitation_id, author, wish, email_sealed)
  values (inv.id, r, trim(p_wish), case when e is not null then p_sealed end)
  on conflict (invitation_id, author)
  do update set wish = excluded.wish, email_sealed = excluded.email_sealed;

  if e is not null then
    insert into wish_emails (invitation_id, author, email, sent_at)
    values (inv.id, r, e, null)
    on conflict (invitation_id, author) do update set email = excluded.email, sent_at = null;
  else
    delete from wish_emails where invitation_id = inv.id and author = r;
  end if;
end $$;

grant execute on function submit_wish(uuid, text, text, text) to anon;
