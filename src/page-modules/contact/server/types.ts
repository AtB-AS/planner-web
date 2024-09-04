export type ContactApiInputType = {
  body: {};
};
export type ContactApiReturnType = {
  message: string;
};

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phonenumber?: string;
  bankAccount?: string;
};

export type TicketData = {
  user: User;
  subject: string;
  description: string;
};
