import Container from "@/components/Shop/Layout/Container";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Profile } from "../components/Profile";
import { db } from "@/db/db";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userData = await db.user.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      addresses: true,
    },
  });

  return (
    <Container className="mt-5">
      {userData && <Profile user={userData} profileImageUrl={user.imageUrl} />}
      {!userData && (
        <div className="text-center mt-10 font-bold text-red-500">
          User not found
        </div>
      )}
    </Container>
  );
}
