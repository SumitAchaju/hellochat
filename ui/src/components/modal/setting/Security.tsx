import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../Button";
import Input from "../../Input";
import Switch from "../../Switch";
import useAxios from "../../../hooks/useAxios";
import notify, { notifyPromise } from "../../toast/MsgToast";
import { useUserStore } from "../../../store/userStore";

type Props = {};

export default function Security({}: Props) {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUserStore();
  const updateUsernameMutation = useMutation({
    mutationKey: ["updateUsername"],
    mutationFn: async (data: FormData) => {
      const res = await api.patch(
        `api/v1/user/${user?.id}/update-username/`,
        data
      );
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });
  const updatePasswordMutation = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: async (data: FormData) => {
      const res = await api.patch(
        `/api/v1/user/${user?.id}/update-password/`,
        data
      );
      return res.data;
    },
  });
  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    notifyPromise({
      promise: updateUsernameMutation.mutateAsync(form),
      msg: "Username Updated",
      loading: "Updating Username...",
    });
  };
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("new_password") !== form.get("confirm_password")) {
      notify("dumb", "Password does not match");
      return;
    }
    notifyPromise({
      promise: updatePasswordMutation.mutateAsync(form),
      msg: "Password Updated",
      loading: "Updating Password...",
    });
  };
  return (
    <div className="flex flex-col px-5 gap-10 w-full">
      <div className="flex flex-col gap-3">
        <h2 className="text-primary-text text-[25px] tracking-[0.64px] font-medium">
          Encryption
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-icon-color text-[18px]">
            Use end to end encryption
          </p>
          <Switch state={false} />
        </div>
      </div>
      <form
        onSubmit={handleUsernameSubmit}
        className="flex flex-col gap-4 items-end"
      >
        <div className="flex gap-5">
          <Input name="username" labelname="New Username" required />
          <Input
            name="password"
            labelname="Authorize Password"
            type="password"
            required
          />
        </div>
        <Button
          type="submit"
          text="Change"
          varient="primary"
          className="w-fit"
        />
      </form>
      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
        <div className="flex gap-5">
          <Input
            name="old_password"
            labelname="Old Password"
            type="password"
            required
          />
          <Input
            name="new_password"
            labelname="New Password"
            type="password"
            required
          />
        </div>
        <div className="flex gap-5 items-end">
          <Input
            name="confirm_password"
            labelname="Confirm Password"
            type="password"
            required
          />
          <Button
            type="submit"
            text="Change"
            varient="primary"
            className="w-fit"
          />
        </div>
      </form>
    </div>
  );
}
