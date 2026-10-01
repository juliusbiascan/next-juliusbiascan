import { db } from "@repo/db";
export default async function Page() {

  const users = await db.orm.public.User.select("id", "email", "name", "bio").all();

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        Admin

        {users.length === 0 ? (
          <p>No users added yet</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name ?? "Anonymous"} ({user.email}) {user.bio ?? "No bio available"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
