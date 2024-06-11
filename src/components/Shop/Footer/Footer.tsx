import Container from "../Layout/Container";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <Container>
        <div className="mx-auto py-10 flex items-center justify-between">
          <p className="text-[#1d1d1d] text-base">
            <span>&copy;2023 by </span>
            <a
              href="https://tahazzot.me"
              title="my portfolio"
              className="underline"
              target="_blank"
            >
              Tahazzot
            </a>
            <span>. All rights reserved.</span>
          </p>
          <p>English (United States)</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
