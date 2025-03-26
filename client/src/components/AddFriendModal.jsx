import { X, SearchIcon } from "lucide-react";

export const AddFriendModal = ({ toggleModal }) => {
  return (
    <div className="w-full h-screen relative flex justify-center">
      <div className="mt-5 top-[20%] absolute  ">
        <div className="relative ">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="size-5 text-base-content/40" />
          </div>
          <input
            type="text"
            placeholder="username"
            className="input input-bordered w-full sm:w-[450px] pl-10"
          />
        </div>
      </div>
      <button
        className={`btn btn-sm gap-2 absolute top-8 right-7`}
        onClick={() => toggleModal()}
      >
        <X className="size-5 text-white" />
      </button>
    </div>
  );
};
