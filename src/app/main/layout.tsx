import BottomBar from "../components/Bottombar";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
    return (
        <div className="bg-[#57B492] min-h-screen text-black">
            <div className="md:px-[76vh]">
                <div className="shadow-2xl border-slate-300 border-2">
                    <Navbar />
                    <div className="">
                        {children}
                    </div>
                    <BottomBar />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
