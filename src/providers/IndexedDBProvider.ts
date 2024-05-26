import { openDB, deleteDB } from "idb";

const dbName = "reactionapp";
const version = 1;

const db = await openDB(dbName, version, {
  upgrade(db, oldVersion, newVersion, transaction) {
    db.put("Initialized", true);
  },
});

export async function holdClientLibraryState(uid: string, data: Array<any>) {
  if (!db.objectStoreNames.contains(uid)) {
    await db.createObjectStore(uid);
  }
  const dbm = db.transaction(uid, "readwrite");
  const store = await dbm.objectStore(uid);

  await store.put({ id: "librarystate", data: data });
  await dbm.done;
}
