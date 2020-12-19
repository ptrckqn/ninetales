import { IncomingForm } from "formidable";
import shortid from "shortid";
import { admin, firestore, storage } from "../../firebase/admin";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const { method, cookies } = req;

  if (method === "POST") {
    try {
      const token = await admin.auth().verifyIdToken(cookies.token);
      const { name: username } = token;

      const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      const postId = shortid.generate();
      const regex = /(?:\.([^.]+))?$/;
      const extention = regex.exec(data.files.file.name)[1];

      const bucket = storage.bucket("posts");
      const blob = bucket.file(data.files.file);

      console.log(temp);

      // const storageRef = storage.ref(`posts/${postId}.${extention}`);
      // await storageRef.put(data.files.file);

      // const url = await storageRef.getDownloadURL();

      // const doc = await firestore.collection("posts").add({
      //   username,
      //   story: data.fields.story,
      // });

      res.status(200).end();
    } catch (err) {
      console.log("err", err);
      res.status(401).end();
    }
  } else {
    res.status(405).end();
  }
};
