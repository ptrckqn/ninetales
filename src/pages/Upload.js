import React, { useState, useEffect } from "react";
import { isNil, isEmpty } from "lodash";
import { useAuth } from "../context/authContext";
import { useNav } from "../context/navContext";
import { firestore } from "../firebase";
import { uploadPhoto } from "../firebase/functions";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

const types = ["image/png", "image/jpeg"];

const Upload = () => {
  const auth = useAuth();
  const { updateNav, resetNav } = useNav();
  const [file, setFile] = useState();
  const [story, setStory] = useState("");
  const [preview, setPreview] = useState();

  const handleChange = (e) => {
    const { value } = e.target;
    setStory(value);
  };

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
    }
  };

  const handleSubmit = async () => {
    updateNav({ loading: true });

    const { id, url } = await uploadPhoto(file, "posts");

    const docRef = firestore.collection("posts").doc(id);

    await docRef.set({
      username: auth.username,
      story,
      url,
      createdAt: new Date().getTime(),
    });

    setFile(null);
    setStory("");
    setPreview(null);

    updateNav({ loading: false });
  };

  useEffect(() => {
    updateNav({
      showBack: true,
      noSearch: true,
    });
    return () => {
      resetNav();
    };
  }, []);

  return (
    <>
      <div className="p-4">
        <div className="relative">
          <label className="w-full mb-8 cursor-pointer">
            <input
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="hidden"
            />

            <div
              className={`h-64 w-full my-4 border-gray-400 ${
                preview ? "border-0" : "border-4"
              } rounded-lg relative flex flex-col items-center justify-center overflow-hidden`}
            >
              {preview ? (
                <img
                  src={preview}
                  className="object-contain h-full w-full max-h-96"
                />
              ) : (
                <>
                  <div className="flex-grow flex justify-center items-center">
                    <img
                      src="/svg/plus-2.svg"
                      className="w-36 bg-gray-400 p-4 rounded-full"
                    />
                  </div>
                  <div className="pb-4 text-gray-400 font-bold text-3xl">
                    Tap to upload
                  </div>
                </>
              )}
            </div>
          </label>
        </div>

        <TextInput
          name="story"
          label="Story"
          value={story || ""}
          handleChange={handleChange}
          textArea
        />

        <Button
          variant="contained"
          className="w-full mt-4"
          disabled={isNil(file) || isEmpty(story)}
          handleClick={handleSubmit}
        >
          Upload
        </Button>
      </div>
    </>
  );
};

export default Upload;
