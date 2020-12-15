import { useState, useEffect } from "react";
import Container from "../components/Container";
import TextField from "../components/TextInput";

const Upload = () => {
  const [story, setStory] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setStory(value);
  };

  const handleSubmit = () => {};

  return (
    <Container showBack nextBtn="Submit" handleNext={handleSubmit}>
      <div className="p-2">
        <button className="w-full mb-8">
          <div className="h-80 w-full my-4 border-gray-400 border-4 rounded-lg relative flex flex-col items-center justify-center overflow-hidden">
            <div className="flex-grow flex justify-center items-center">
              <img src="/svg/plus-2.svg" className="w-36 bg-gray-400 p-4 rounded-full" />
            </div>
            <div className="pb-4 text-gray-400 font-bold text-3xl">Tap to upload</div>
          </div>
        </button>

        <TextField name="story" label="Story" value={story || ""} handleChange={handleChange} textArea />
      </div>
    </Container>
  );
};

export default Upload;
