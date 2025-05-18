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

        <div className="flex">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-[#8b949e] text-sm">
              https://
            </div>
            <input
              type="text"
              className="bg-[#0d1117] border border-[#30363d] rounded-md pl-16 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-[#2563eb]"
              placeholder="website.com"
            />
            <button className="bg-[#2563eb] text-white rounded-md px-4 py-2 ml-2 text-sm">
              Check
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
