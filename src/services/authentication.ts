import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";

export type User = {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  mustChangePassword: boolean;
};

export type CognitoUserWithAttributes = CognitoUser & {
  attributes?: {
    [key: string]: string;
  };
};

const USERS: User[] = [
  {
    id: 1,
    email: "user1@fake.email",
    password: "1234",
    name: "Fake User",
    mustChangePassword: false,
  },
  {
    id: 2,
    email: "user2@fake.email",
    password: "abcd",
    name: "Another User",
    mustChangePassword: true,
  },
  {
    id: 3,
    email: "user3@fake.email",
    password: "abcd",
    name: "Some rando",
    mustChangePassword: true,
  },
];

const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));

export const createUser = async (email: string, password: string) => {
  await sleep(1000);
  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("DUPLICATED_USER");
  }
  const user: User = {
    id: USERS.length + 1,
    email,
    password,
    mustChangePassword: true,
  };
  USERS.push(user);
  return user;
};

export const forgotPassword = async (email: string) => {
  try {
    await Auth.forgotPassword(email, {
      redirectTo: process.env.REACT_APP_HOST || "",
    });
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getAuthenticatedUser =
  async (): Promise<CognitoUserWithAttributes | null> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      return null;
    }
  };

export const getUsers = async () => {
  await sleep(1000);
  return USERS;
};

const hasCode = (
  value: unknown
): value is {
  message: string;
  code: string;
} =>
  typeof value === "object" &&
  (value as Record<string, unknown>).code !== undefined;

export const logIn = async (email: string, password: string) => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
      if (error.code === "NotAuthorizedException") {
        if (error.message === "Password attempts exceeded") {
          throw new Error("TOO_MANY_TRIES");
        }
        throw new Error("INCORRECT_PASSWORD");
      }
    }
    console.log("error signing in", error);
    throw new Error("INTERNAL_ERROR");
  }
};

export const logOut = async () => {
  try {
    await Auth.signOut();
  } catch (e) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
      if (error?.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
      if (error?.code === "CodeMismatchException") {
        throw new Error("INVALID_RESET_PASSWORD_LINK");
      }
      if (error?.code === "LimitExceededException") {
        throw new Error("TOO_MANY_TRIES");
      }
    }

    throw new Error("INTERNAL_ERROR");
  }
};

export const setPassword = async (
  user: CognitoUserWithAttributes,
  newPassword: string
) => {
  try {
    const loggedInUser = await Auth.completeNewPassword(user, newPassword);
    return loggedInUser;
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
    }
    console.log("error signing in", error);
    throw new Error("INTERNAL_ERROR");
  }
};

export const updateName = async (
  user: CognitoUserWithAttributes,
  newName: string
): Promise<CognitoUserWithAttributes> => {
  try {
    await Auth.updateUserAttributes(user, { name: newName });
    const newUser: CognitoUserWithAttributes = user;
    newUser.attributes = {
      ...user.attributes,
      name: newName,
    };
    return newUser;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const updatePassword = async (
  user: CognitoUserWithAttributes,
  oldPassword: string,
  newPassword: string
) => {
  try {
    await Auth.changePassword(user, oldPassword, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "NotAuthorizedException") {
        throw new Error("INCORRECT_PASSWORD");
      }
      if (error.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
      if (error.code === "LimitExceededException") {
        throw new Error("TOO_MANY_TRIES");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};
