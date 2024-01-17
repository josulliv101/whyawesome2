import admin from "firebase-admin";
import { Profile } from "./types";

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
  const data = [people, snapshotCount.data().count, lastItem, firstItem] as [
    Array<Profile>,
    number,
    number,
    number
  ];
  return data;
}
