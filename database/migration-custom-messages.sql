-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- Adds custom NO messages, a final message and reminders to each invitation.

alter table invitations
  add column if not exists no_messages text check (char_length(no_messages) <= 1500),
  add column if not exists reminders text check (char_length(reminders) <= 1100),
  add column if not exists final_message text check (char_length(final_message) <= 200);

drop function if exists create_invitation(text, text, text, text, text, text, text);

create or replace function create_invitation(
  p_sender text, p_receiver text, p_date text, p_time text,
  p_church text, p_meeting text, p_message text,
  p_no_messages text, p_reminders text, p_final text
) returns json language plpgsql security definer set search_path = public as $$
declare inv invitations;
begin
  insert into invitations (sender_name, receiver_name, event_date, event_time, church, meeting_point, message,
                           no_messages, reminders, final_message)
  values (trim(p_sender), trim(p_receiver), trim(p_date), trim(p_time), trim(p_church), trim(p_meeting), trim(p_message),
          trim(p_no_messages), trim(p_reminders), trim(p_final))
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
    'no_messages', inv.no_messages,
    'reminders', inv.reminders,
    'final_message', inv.final_message,
    'reveal_at', inv.reveal_at,
    'revealed', revealed,
    'receiver_token', case when r = 'sender' then inv.receiver_token end,
    'my_wish_sent', exists (select 1 from wishes w where w.invitation_id = inv.id and w.author = r),
    'other_wish_sent', exists (select 1 from wishes w where w.invitation_id = inv.id and w.author <> r),
    'my_wish', case when revealed then (select w.wish from wishes w where w.invitation_id = inv.id and w.author = r) end,
    'other_wish', case when revealed then (select w.wish from wishes w where w.invitation_id = inv.id and w.author <> r) end
  );
end $$;

grant execute on function create_invitation(text, text, text, text, text, text, text, text, text, text) to anon;
grant execute on function get_invitation(uuid) to anon;
