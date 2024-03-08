import { setupUser } from "@/lib/users";
import { redirect } from "next/navigation";
import { StoreList } from "./components/StoreList";

export default async function SelectStore() {
  const user = await setupUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!user.stores || user.stores.length === 0) {
    return redirect("/create-store");
  }

  return (
    <div>
      <StoreList stores={user.stores} />
    </div>
  );
}
