import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { userType } from "../types/fetchTypes";

export const KEY = "addFriend";
const LIMIT = 10;

export type searchFriendTypes = Omit<
  userType,
  "password" | "superuser_pass"
> & {
  friend_status: "none" | "friend" | "requested" | "blocked" | "requested_by";
};

export default function useAddFriendQuery(type: string, search: string) {
  const api = useAxios();

  return useInfiniteQuery({
    queryKey: [KEY, type, search],
    queryFn: async ({ queryKey, pageParam }): Promise<searchFriendTypes[]> => {
      const [_, type, search] = queryKey;
      const fetch = await api.get(
        `/django/api/v1/user/?${type}=${search}&limit=${LIMIT}&offset=${pageParam}`
      );
      return fetch.data.results;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) return undefined;
      return lastPageParam + LIMIT;
    },
    staleTime: 60 * 1000,
    retry: 0,
  });
}

export function useAddFriendMutation() {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [KEY, "mutation"],
    mutationFn: async ({ id, type }: { id: number; type: relationType }) => {
      const res = await api.patch(`/django/api/v1/relation/`, {
        requested_user_id: id,
        relation: type,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
      queryClient.invalidateQueries({ queryKey: ["getRelation"] });
    },
  });
}

export type relationType =
  | "request"
  | "accept"
  | "block"
  | "cancel_request"
  | "reject"
  | "unfriend"
  | "unblock";
