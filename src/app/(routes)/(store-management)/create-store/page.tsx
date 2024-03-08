import { setupUser } from "@/lib/users";
import { NewStoreForm } from "./components/NewStoreForm";

export default async function CreateStore() {
  const user = await setupUser();

  return (
    <div>
      <NewStoreForm user={user} />
    </div>
  );
}