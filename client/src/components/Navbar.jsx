import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, Gamepad2, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { AddFriendModal } from "./AddFriendModal";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isModal, setIsModal] = useState(false);

  const toggleModal = () => {
    setIsModal(!isModal)
  }

  if (isModal){
    return (
      <div className='w-full h-full absolute  bg-black sm:opacity-80 z-10 '>
      
      <AddFriendModal toggleModal={toggleModal} />

      </div>
        
    )
  }

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Rock, Paper && scissors</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <button className={`btn btn-sm gap-2`} onClick={toggleModal}>
                  <UserRoundPlus className="size-5" />
                  <span className="hidden sm:inline">Add friend</span>
                </button>

                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>

              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;