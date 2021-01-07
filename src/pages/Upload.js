import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { firestore } from '../firebase';
import { uploadPhoto } from '../firebase/functions';
import Container from '../components/Container';
import TextInput from '../components/TextInput';

const types = ['image/png', 'image/jpeg'];

const Upload = () => {
  const auth = useAuth();
  const [file, setFile] = useState();
  const [story, setStory] = useState('');
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const { id, url } = await uploadPhoto(file, 'posts');

    const docRef = firestore.collection('posts').doc(id);

    await docRef.set({
      username: auth.username,
      story,
      url,
      createdAt: new Date().getTime(),
    });

    setFile(null);
    setStory('');
    setPreview(null);

    setLoading(false);
  };

  return (
    <Container showBack nextBtn="Submit" handleNext={handleSubmit} loading={loading}>
      <div className="p-4">
        <div className="relative">
          <label className="w-full mb-8 cursor-pointer">
            <input type="file" onChange={handleFile} accept="image/png, image/jpeg" className="hidden" />

            <div className={`h-80 w-full my-4 border-gray-400 ${preview ? 'border-0' : 'border-4'} rounded-lg relative flex flex-col items-center justify-center overflow-hidden`}>
              {preview ? (
                <img src={preview} className="object-contain h-full w-full max-h-96" />
              ) : (
                <>
                  <div className="flex-grow flex justify-center items-center">
                    <img src="/svg/plus-2.svg" className="w-36 bg-gray-400 p-4 rounded-full" />
                  </div>
                  <div className="pb-4 text-gray-400 font-bold text-3xl">Tap to upload</div>
                </>
              )}
            </div>
          </label>
        </div>

        <TextInput name="story" label="Story" value={story || ''} handleChange={handleChange} textArea />
      </div>
    </Container>
  );
};

export default Upload;
