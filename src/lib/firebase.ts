import "server-only";

import { cookies } from "next/headers";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import admin from "firebase-admin";
import { Profile, Reason } from "./types";
import { ProfileForm } from "@/app/(main)/admin/new/ProfileForm";

// src/lib/firebase/firebase-admin.ts

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

export const firebaseApp =
  getApps().find((it) => it.name === "firebase-admin-app") ||
  initializeApp(
    {
      credential: cert(serviceAccount),
    },
    "firebase-admin-app"
  );
export const auth = getAuth(firebaseApp);

export async function isUserAuthenticated(
  session: string | undefined = undefined
) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  return currentUser;
}

async function getSession() {
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) {
  return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}

// const initializeApp = () => {
//   return admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as any),
//   });
// };

// export const getFirebaseAdminApp = () => {
//   if (admin.apps.length > 0) {
//     return admin.apps[0] as admin.app.App;
//   }

//   return initializeApp();
// };

// export const db = admin.firestore(getFirebaseAdminApp());
export const db = getFirestore(firebaseApp);

export async function addProfile({ profileId, reasons, ...profile }: any) {
  console.log("formData", profileId, profile);
  if (!profileId) {
    throw new Error("profile id is required.");
  }
  await db.collection("entity").doc(profileId).set(profile);

  // Add any new reasons to the collection
  reasons
    .filter((reason: Reason) => !reason?.id)
    .forEach(async (reason: Reason) => {
      await db
        .collection("entity")
        .doc(profileId)
        .collection("whyawesome")
        .add(reason);
    });
  console.log(`reasons added.`);
}

export async function fetchProfile(profileId: string, uid?: string) {
  if (!profileId) {
    throw new Error("profile id is required.");
  }
  const profileSnapshot = await db.collection("entity").doc(profileId).get();
  const reasonsSnapshot = await db
    .collection(`entity/${profileId}/whyawesome`)
    .get();
  console.log("UID", uid, profileId);
  let userVotesSnapshot;
  if (uid) {
    userVotesSnapshot = await db
      .collection("entity")
      .doc(profileId)
      .collection("votes")
      .doc(uid)
      .get();
  }

  const reasons: Profile["reasons"] = [];
  reasonsSnapshot.forEach((doc: any) =>
    reasons.push({ id: doc.id, ...doc.data() })
  );

  const currentUserVotes = userVotesSnapshot ? userVotesSnapshot.data() : {};
  // console.log("...", JSON.stringify(currentUserVotes));
  const {
    description,
    name,
    tagMap = {},
    ...rest
  }: any = profileSnapshot.data() || {};
  return {
    ...rest,
    id: profileId,
    profileId,
    description: description,
    name: name,
    tags: Object.keys(tagMap).map((tag) => ({ label: tag, value: tag })),
    reasons: reasons.sort((a, b) => {
      return b.votes - a.votes;
    }),
    currentUserVotes: currentUserVotes,
  };
}

export async function fetchEntities(
  tags: Array<string> = [],
  limit = 8,
  startAfter = 0,
  prev = false
) {
  let query = db.collection("entity").where("oinks", ">", 0);

  tags.forEach((tag) => {
    query = query.where(`tagMap.${tag}`, "==", true);
  });

  let snapshotPeople = await query.orderBy("oinks", "desc");

  if (startAfter > 0 && !prev) {
    snapshotPeople = snapshotPeople.startAfter(startAfter);
  } else if (startAfter > 0 && !!prev) {
    snapshotPeople = snapshotPeople.endBefore(startAfter);
  }

  const snapshotPeople2 = await snapshotPeople.limit(limit).get();

  const lastItem =
    snapshotPeople2.docs[snapshotPeople2.docs.length - 1]?.get("oinks");
  const firstItem = snapshotPeople2.docs[0]?.get("oinks");

  const snapshotCount = await query.count().get();

  const people: Array<any> = [];

  snapshotPeople2.forEach((doc: any) =>
    people.push({ id: doc.id, ...doc.data() })
  );
  const data = [
    people,
    snapshotCount.data().count,
    lastItem,
    firstItem,
    tags.join(" / "),
  ] as [Array<Profile>, number, number, number, string];
  return data;
}

export async function updateReasons(
  profileId: string,
  userId: string,
  reasonIds: string[] = []
) {
  console.log("updateReasons", userId, reasonIds);
  if (!userId) {
    throw new Error("user id is required.");
  }
  if (!profileId) {
    throw new Error("profile id is required.");
  }
  await db
    .collection(`entity/${profileId}/votes`)
    .doc(userId)
    .set({
      voteMap: reasonIds.reduce((acc, reasonId) => {
        return {
          ...acc,
          [reasonId]: true,
        };
      }, {}),
    });
}
