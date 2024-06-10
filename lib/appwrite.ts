import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";
import { UserType } from "./types";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.miyushan.aora",
  projectId: "aora-mobile-app",
  databaseId: "rn_aora",
  userCollectionId: "6665caa7003835b05aa5",
  videoCollectionId: "6665cad3003717d50def",
  storageId: "6665ccc100140af4faa6",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw Error("Failed to create account");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create user");
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create session");
  }
};

export const getCurrentUser = async (): Promise<UserType | undefined> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw Error("Failed to get current user");
    }

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) {
      throw Error("Failed to get current user");
    }

    return currentUser.documents[0] as unknown as UserType;
  } catch (error) {
    console.log(error);
  }
};
