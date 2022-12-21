export type User = {
  email: string;
  password: string;
  name?: string;
  mustChangePassword: boolean;
};

const USERS: User[] = [
  {
    email: "user1@fake.email",
    password: "1234",
    name: "Fake User",
    mustChangePassword: false,
  },
  {
    email: "user2@fake.email",
    password: "abcd",
    name: "Another User",
    mustChangePassword: true,
  },
];

const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));

export const forgotPassword = async (email: string) => {
  await sleep(1000);
  const user = USERS.find((user) => email === user.email);
  if (!user) {
    throw new Error("USER_NOT_EXISTS");
  }
};

export const logIn = async (email: string, password: string) => {
  await sleep(1000);
  const user = USERS.find((user) => email === user.email);
  if (!user) {
    throw new Error("USER_NOT_EXISTS");
  }
  if (user.password !== password) {
    throw new Error("INCORRECT_PASSWORD");
  }
  return user;
};

export const resetPassword = async (email: string, newPassword: string) => {
  await sleep(1000);
  const userIndex = USERS.findIndex((user) => email === user.email);
  if (userIndex === -1) {
    throw new Error("USER_NOT_EXISTS");
  }
  if (!newPassword) {
    throw new Error("INVALID_PASSWORD");
  }
  USERS[userIndex] = {
    ...USERS[userIndex],
    password: newPassword,
  };
};

export const setPassword = async (newPassword: string) => {
  await sleep(1000);
  if (newPassword.length === 0) {
    throw new Error("INVALID_PASSWORD");
  }
};
