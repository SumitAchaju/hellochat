import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { FriendIcon, SearchIcon } from "../Icons";
import MyModal from "./MyModal";
import ProfilePic from "../ProfilePic";
import useAddFriendQuery, {
  searchFriendTypes,
  useAddFriendMutation,
} from "../../queryHooks/useAddFriendQuery";
import Spinner from "../Spinner";
import { useInView } from "react-intersection-observer";
import { notifyPromise } from "../toast/MsgToast";
import { useUserStore } from "../../store/userStore";
import { relationType } from "../../queryHooks/useAddFriendQuery";
import { relationUserType } from "../../types/fetchTypes";
import _ from "lodash";

type Props = {};
type SearchType = "name" | "uid" | "contact_number";

export default function AddFriend({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MyModal
      trigger={<FriendIcon />}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modal={<AddFriendModal />}
    />
  );
}

const AddFriendModal = () => {
  const [searchT, setSearchT] = useState<SearchType>("name");
  const [search, setSearch] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { inView, ref } = useInView();

  const userQuery = useAddFriendQuery(searchT, search);

  const userStore = useUserStore();

  const handleFriendSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(e.currentTarget.searchInput.value);
  };

  const handleMutation = useAddFriendMutation();

  const handleButtonClick = (type: SearchType) => {
    setSearchT(type);
    setSearch("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (inView && userQuery.hasNextPage) {
      userQuery.fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="py-[50px] flex flex-col gap-[30px] h-full">
      <div className="flex gap-[20px] px-[50px]">
        <Button
          text="Name"
          varient={searchT == "name" ? "primary" : "secondary"}
          onClick={() => handleButtonClick("name")}
          hover={false}
        />
        <Button
          text="UID"
          varient={searchT == "uid" ? "primary" : "secondary"}
          onClick={() => handleButtonClick("uid")}
          hover={false}
        />
        <Button
          text="Contact Number"
          varient={searchT == "contact_number" ? "primary" : "secondary"}
          onClick={() => handleButtonClick("contact_number")}
          hover={false}
        />
      </div>
      <form
        onSubmit={handleFriendSearch}
        className="relative flex items-center gap-5 px-[50px]"
      >
        <input
          ref={inputRef}
          type="text"
          name="searchInput"
          placeholder="Search People..."
          className="rounded-[10px] block py-[15px] ps-[55px] border border-secondary-text pe-5 w-full text-primary-text placeholder:text-primary-text bg-transparent"
        />
        <div className="absolute top-1/2 -translate-y-1/2 left-[75px]">
          <SearchIcon />
        </div>
        <button type="submit" className="bg-red-color rounded-full p-4 block">
          <SearchIcon color="white" />
        </button>
      </form>
      <div className="flex flex-col overflow-y-auto my-scroll grow gap-[20px] px-[50px] w-full">
        {userQuery.isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : userQuery.isError ? (
          <p className="text-red-color text-center">
            Error: {userQuery.error.message}
          </p>
        ) : userQuery.data?.pages.flat().length === 0 ? (
          <p className="text-center text-xl font-medium text-secondary-text">
            No users found
          </p>
        ) : (
          userQuery.data?.pages.flat().map((user, index) => {
            const buttonStyle = extractButtonStyle(user, userStore.relation);
            return (
              <div
                key={user.id}
                className="flex justify-between items-center w-full"
                ref={
                  index === userQuery.data?.pages.flat().length - 1 ? ref : null
                }
              >
                <div className="flex gap-5 justify-between items-center">
                  <ProfilePic size={50} image={user.profile} />
                  <div>
                    <p className="text-primary-text font-medium">
                      {_.capitalize(user.first_name)}{" "}
                      {_.capitalize(user.last_name)}
                    </p>
                    <span className="block text-secondary-text text-[14px]">
                      {user.address}
                    </span>
                  </div>
                </div>
                {userStore.user?.id == user.id ? (
                  <Button varient="secondary" text="MyProfile" />
                ) : (
                  <Button
                    disabled={handleMutation.isPending}
                    varient="secondary"
                    text={_.capitalize(buttonStyle)}
                    onClick={() =>
                      notifyPromise({
                        promise: handleMutation.mutateAsync({
                          id: user.id,
                          type: buttonStyle,
                        }),
                        msg: extractToastMsg(buttonStyle).msg,
                        loading: extractToastMsg(buttonStyle).loading,
                      })
                    }
                  />
                )}
              </div>
            );
          })
        )}
        {userQuery.isFetchingNextPage ? (
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const extractButtonStyle = (
  user: searchFriendTypes,
  relation: relationUserType | undefined
): relationType => {
  if (!relation) return "request";
  if (relation.friends.some((friend) => friend.id === user.id)) {
    return "unfriend";
  }
  if (relation.requested.some((requested) => requested.id === user.id)) {
    return "cancel_request";
  }
  if (relation.requested.some((requested) => requested.id === user.id)) {
    return "accept";
  }
  if (relation.blocked.some((blocked) => blocked.id === user.id)) {
    return "unblock";
  }
  return "request";
};

const extractToastMsg = (buttonType: relationType) => {
  switch (buttonType) {
    case "unfriend":
      return { msg: "Sucessfully Unfriended", loading: "Unfriending..." };
    case "cancel_request":
      return { msg: "Sucessfully Canceled", loading: "Canceling..." };
    case "unblock":
      return { msg: "Sucessfully Unblocked", loading: "Unblocking..." };
    case "request":
      return { msg: "Sucessfully Requested", loading: "Requesting..." };
    case "accept":
      return { msg: "Sucessfully Accepted", loading: "Accepting..." };
    default:
      return { msg: "Sucessfully Unknown", loading: "Unknown..." };
  }
};
