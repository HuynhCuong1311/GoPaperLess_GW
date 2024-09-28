import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const usePending = () => {
  const isFetching = useIsFetching();

  const isMutating = useIsMutating();

  const isPending = isFetching + isMutating > 0;
  return isPending;
};

usePending.propTypes = {};

export default usePending;
