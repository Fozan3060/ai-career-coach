import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Welcome, {user?.firstName}!</h1>
    </div>
  );
}