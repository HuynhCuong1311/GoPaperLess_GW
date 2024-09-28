import { api } from "@/utils/api";

export const participantsService = {
  updateParticipant: (data) => {
    // const value = {
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     sequenceNumber: data.sequenceNumber,
    //     customReason: data.customReason,
    //     signingPurpose: data.signingPurpose,
    //     signerToken: data.signerToken,
    data.metaInformation = JSON.stringify(data.metaInformation);

    // }
    return api.post("/participants/updateParticipant", data);
  },
  createParticipant: (participant, workFlow) => {
    participant.signingToken = workFlow.signingToken;
    participant.signerToken = workFlow.signerToken;
    participant.enterpriseId = workFlow.enterpriseId;
    participant.process_type = workFlow.workflowProcessType;
    // const value = {
    //   //     participant: participant,
    //   //     lastName: data.lastName,
    // }
    return api.post("/participants/createParticipant", participant);
  },
};
