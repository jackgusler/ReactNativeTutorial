import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.JackGusler.Aora",
  projectId: "669a8c200013311bf514",
  databaseId: "669a8d29003a11fedd4f",
  userCollectionId: "669a8d4500106eaf7e32",
  videoCollectionId: "669a8d5c00122fab6cda",
  storageId: "669a8e490005f09553a9",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw error;
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
    console.error(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentUser = await account.get();

    if (!currentUser) {
      throw Error
    }

    const user = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentUser.$id)]
    );

    if (!user) {
      throw Error
    }

    return user.documents[0];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
