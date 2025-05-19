import Logo from "./Logo";

const Header = () => {
  return (
    <header className="bg-[#161b22] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
          <h1 className="text-xl font-semibold ml-3 font-space-grotesk">
            VeriStream
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
