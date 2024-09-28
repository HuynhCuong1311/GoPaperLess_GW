import { api } from "@/utils/api";

export const documentsService = {
  updateDocumentsSetting: (workFlow, activeStep, deadlineAt) => {
    const deadline = deadlineAt === "Invalid Date" ? null : deadlineAt;
    const data = {
      signingToken: workFlow.signingToken,
      signatureLevels: activeStep,
      deadlineAt: deadline,
    };
    return api.post("/documents/updateDocumentsSetting", data);
  },
};
