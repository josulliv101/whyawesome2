import admin from "firebase-admin";
import { Profile } from "./types";
import { ProfileForm } from "@/app/(main)/admin/new/ProfileForm";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

const initializeApp = () => {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
};

export const getFirebaseAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  return initializeApp();
};

export const db = admin.firestore(getFirebaseAdminApp());

export async function addProfile({ profileId, ...profile }: any) {
  console.log("formData", profileId, profile);
  if (!profileId) {
    throw new Error("profile id is required.");
  }
  await db.collection("entity").doc(profileId).set(profile);
}

export async function fetchProfile(profileId: string) {
  if (!profileId) {
    throw new Error("profile id is required.");
  }
  const profileSnapshot = await db.collection("entity").doc(profileId).get();
  const reasonsSnapshot = await db
    .collection(`entity/${profileId}/whyawesome`)
    .get();

  const reasons: Profile["reasons"] = [];
  reasonsSnapshot.forEach((doc: any) =>
    reasons.push({ id: doc.id, ...doc.data() })
  );

  const {
    description,
    name,
    tagMap = {},
    ...rest
  }: any = profileSnapshot.data();
  return {
    ...rest,
    id: profileId,
    description: description,
    name: name,
    tags: Object.keys(tagMap).map((tag) => ({ label: tag, value: tag })),
    reasons: reasons.sort((a, b) => {
      return b.votes - a.votes;
    }),
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
