import { auth, currentUser } from "@clerk/nextjs/server";

export const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
};
