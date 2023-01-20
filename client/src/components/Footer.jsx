import logo from "../assets/images/logo-large.png";

function Footer() {
  return (
    <footer className="text-gray-500 bg-white px-4 py-5 max-w-screen-xl mx-auto md:px-8">
      <div className="max-w-lg sm:mx-auto sm:text-center">
        <img src={logo} className="w-32 sm:mx-auto" />
        <p className="leading-relaxed mt-2 text-[15px]">
          The PostDapp uses smart contract technology to ensure that the
          uploaded photos are stored in a decentrialized database.
        </p>
      </div>
      <div className="mt-8 items-center text-center">
        <div className="mt-4 sm:mt-0">
          &copy; 2023 PostDapp All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
