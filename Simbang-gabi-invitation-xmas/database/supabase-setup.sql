-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- Wishes arrive already locked (encrypted in the browser), so the length limit is generous.

create extension if not exists pgcrypto;

create table invitations (
  id uuid primary key default gen_random_uuid(),
  sender_token uuid not null default gen_random_uuid(),
  receiver_token uuid not null default gen_random_uuid(),
  sender_name text not null check (char_length(sender_name) between 1 and 60),
  receiver_name text not null check (char_length(receiver_name) between 1 and 60),
  event_date text not null check (char_length(event_date) <= 120),
  event_time text not null check (char_length(event_time) <= 120),
  church text not null check (char_length(church) <= 160),
  meeting_point text not null check (char_length(meeting_point) <= 160),
  message text not null check (char_length(message) <= 3000),
  reveal_at timestamptz not null default '2027-01-01 00:00:00+08',
  created_at timestamptz not null default now()
);

create table wishes (
  invitation_id uuid not null references invitations(id) on delete cascade,
  author text not null check (author in ('sender', 'receiver')),
  wish text not null check (char_length(wish) between 20 and 4000),
  created_at timestamptz not null default now(),
  primary key (invitation_id, author)
);

alter table invitations enable row level security;
alter table wishes enable row level security;

create or replace function create_invitation(
  p_sender text, p_receiver text, p_date text, p_time text,
  p_church text, p_meeting text, p_message text
) returns json language plpgsql security definer set search_path = public as $$
declare inv invitations;
begin
  insert into invitations (sender_name, receiver_name, event_date, event_time, church, meeting_point, message)
  values (trim(p_sender), trim(p_receiver), trim(p_date), trim(p_time), trim(p_church), trim(p_meeting), trim(p_message))
  returning * into inv;
  return json_build_object('sender_token', inv.sender_token, 'receiver_token', inv.receiver_token);
end $$;

create or replace function get_invitation(p_token uuid)
returns json language plpgsql security definer set search_path = public as $$
declare inv invitations; r text; revealed boolean;
begin
  select * into inv from invitations
   where sender_token = p_token or receiver_token = p_token;
  if not found then return null; end if;
  r := case when inv.sender_token = p_token then 'sender' else 'receiver' end;
  revealed := now() >= inv.reveal_at;
  return json_build_object(
    'role', r,
    'sender_name', inv.sender_name,
    'receiver_name', inv.receiver_name,
    'event_date', inv.event_date,
    'event_time', inv.event_time,
    'church', inv.church,
    'meeting_point', inv.meeting_point,
    'message', inv.message,
    'reveal_at', inv.reveal_at,
    'revealed', revealed,
    'receiver_token', case when r = 'sender' then inv.receiver_token end,
    'my_wish_sent', exists (select 1 from wishes w where w.invitation_id = inv.id and w.author = r),
    'other_wish_sent', exists (select 1 from wishes w where w.invitation_id = inv.id and w.author <> r),
    'my_wish', case when revealed then (select w.wish from wishes w where w.invitation_id = inv.id and w.author = r) end,
    'other_wish', case when revealed then (select w.wish from wishes w where w.invitation_id = inv.id and w.author <> r) end
  );
end $$;

create or replace function submit_wish(p_token uuid, p_wish text)
returns void language plpgsql security definer set search_path = public as $$
declare inv invitations; r text;
begin
  select * into inv from invitations
   where sender_token = p_token or receiver_token = p_token;
  if not found then raise exception 'Invalid link'; end if;
  if now() >= inv.reveal_at then raise exception 'Wishes are already revealed'; end if;
  r := case when inv.sender_token = p_token then 'sender' else 'receiver' end;
  insert into wishes (invitation_id, author, wish)
  values (inv.id, r, trim(p_wish))
  on conflict (invitation_id, author) do update set wish = excluded.wish;
end $$;

grant execute on function create_invitation(text, text, text, text, text, text, text) to anon;
grant execute on function get_invitation(uuid) to anon;
grant execute on function submit_wish(uuid, text) to anon;
