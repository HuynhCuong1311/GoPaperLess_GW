import { useParams, useSearchParams } from "react-router-dom";
import { ReactComponent as EditorSubmitted } from "@/assets/images/participant/editor-submitted.svg";
import { ReactComponent as EditorWait } from "@/assets/images/participant/editor-wait.svg";
import { ReactComponent as OnlyView } from "@/assets/images/participant/only-view.svg";
import { ReactComponent as SignerReviewerSigned } from "@/assets/images/participant/signer-reviewer-signed.svg";
import { ReactComponent as SignerReviewerWait } from "@/assets/images/participant/signer-reviewer-wait.svg";

export const useCommonHook = () => {
  const { signing_token: signingToken } = useParams();
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");
  return { signingToken, signerToken };
};

useCommonHook.propTypes = {};

export default useCommonHook;

export const renderIcon = (signerType, signerStatus, size = 24) => {
  if (signerStatus === 1) {
    switch (signerType) {
      case 1:
      case 2:
        return <SignerReviewerWait width={size} height={size} />;
      case 3:
        return <EditorWait width={size} height={size} />;
      case 5:
        return <OnlyView width={size} height={size} />;
    }
  } else {
    switch (signerType) {
      case 1:
      case 2:
        return <SignerReviewerSigned width={size} height={size} />;
      case 3:
        return <EditorSubmitted width={size} height={size} />;
      case 5:
        return <OnlyView width={size} height={size} />;
    }
  }
};
