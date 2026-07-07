-- Rate-limit answers the same way posts are limited (0001): max 30/day/user.
-- ponytail: simple count-in-window guard, same ceiling note as posts.
create function enforce_answer_rate_limit() returns trigger
  language plpgsql security definer set search_path = public as $$
declare recent int;
begin
  select count(*) into recent from answers
   where author_id = new.author_id and created_at > now() - interval '1 day';
  if recent >= 30 then
    raise exception 'Rate limit reached: max 30 answers per day.';
  end if;
  return new;
end;
$$;
create trigger answers_rate_limit before insert on answers
  for each row execute function enforce_answer_rate_limit();
