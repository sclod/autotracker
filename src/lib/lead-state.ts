export type LeadFormState = {
  ok: boolean;
  message: string;
  resetKey: number;
};

export const leadInitialState: LeadFormState = {
  ok: false,
  message: "",
  resetKey: 0,
};
