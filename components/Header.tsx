import { AdminLink } from "./AdminLink";
import { HeaderClient } from "./HeaderClient";

// Server component wrapper that fetches user role and passes admin link to client.
export async function Header() {
  const adminLink = await AdminLink();

  return (
    <>
      <HeaderClient adminLink={adminLink} />
    </>
  );
}
