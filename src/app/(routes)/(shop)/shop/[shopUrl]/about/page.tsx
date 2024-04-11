import Container from "@/components/Shop/Layout/Container";

export default function AboutShopPage() {
  return (
    <div className="mt-7">
      <Container>
        <h1 className="text-7xl font-bold mb-4">About us</h1>
        <p>
          This is the about page for the shop. Here you can find information
          about the shop and its owners. For now, it&apos;s not dynamic and just
          a placeholder.
        </p>
        <p className="mt-5">
          <span className="bg-green-500 text-white p-1 rounded"> ADs </span>
          <span>
            To build a large CMS like UnityShop. Contact us here:
            <a
              href="https://tahazzot.me/contact"
              className="text-blue-500 hover:underline"
              target="_blank"
            >
              {" "}
              tahazzot.me/contact
            </a>
          </span>
        </p>
      </Container>
    </div>
  );
}
