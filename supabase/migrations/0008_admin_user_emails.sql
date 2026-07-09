-- Desi GR Hub v8: admin-only email visibility for the /admin user list.
-- Same pattern as find_user_id_by_email (0004): security definer reads
-- auth.users, returns nothing unless the caller is an admin.
create function list_user_emails() returns table (id uuid, email text)
  language sql security definer stable set search_path = public as $$
  select u.id, u.email::text from auth.users u where is_admin();
$$;
