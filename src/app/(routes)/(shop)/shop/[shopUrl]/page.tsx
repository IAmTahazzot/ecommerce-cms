import Billboards from "@/components/Shop/Billboards/Billboards";
import Container from "@/components/Shop/Layout/Container";
import Product from "@/components/Shop/Products/Product";

export default async function Shop({
  params,
}: {
  params: { shopUrl: string };
}) {
  return (
    <div>
      <Billboards />

      <Container>
        <Product />
      </Container>
    </div>
  );
}
