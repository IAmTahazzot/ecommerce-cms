import { VscColorMode } from "react-icons/vsc";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function StoreManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <header className="flex items-center justify-between">
        <h1 className='font-semibold'>Store Management</h1>

        <Button variant={"ghost"} size={"icon"}>
          <VscColorMode className="cursor-pointer" size={16} />
        </Button>
      </header>
      <div className="flex items-center justify-center mt-24">{children}</div>
    </Container>
  );
}
