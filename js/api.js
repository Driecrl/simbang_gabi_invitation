/* Talks to Supabase. No library needed. */
async function rpc(name, args) {
  const headers = { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY };
  if (SUPABASE_ANON_KEY.startsWith("eyJ")) headers.Authorization = "Bearer " + SUPABASE_ANON_KEY;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST", headers, body: JSON.stringify(args)
  });
  if (!res.ok) {
    let msg = "Something went wrong. Please try again.";
    try { msg = (await res.json()).message || msg; } catch (e) {}
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const createInvitation = (f) => rpc("create_invitation", {
  p_sender: f.sender, p_receiver: f.receiver, p_date: f.date, p_time: f.time,
  p_church: f.church, p_meeting: f.meeting, p_message: f.message,
  p_no_messages: f.nomsgs, p_reminders: f.reminders, p_final: f.final
});
const getInvitation = (token) => rpc("get_invitation", { p_token: token });
const submitWish = (token, wish) => rpc("submit_wish", { p_token: token, p_wish: wish });
