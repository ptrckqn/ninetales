import React, { useState, useEffect } from 'react';
import { isNil, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';
import { useNav } from '../context/navContext';
import { firestore } from '../firebase';
import { uploadPhoto } from '../firebase/functions';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

const types = ['image/png', 'image/jpeg'];

const Upload = () => {
  const auth = useAuth();
  const { updateNav, resetNav } = useNav();
  const [file, setFile] = useState();
  const [story, setStory] = useState('');
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

    toast.success('Post created');
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
    <div className="h-full p-4">
      <div className="relative mb-4">
        <label className="w-full mb-8 cursor-pointer">
          <input type="file" onChange={handleFile} accept="image/png, image/jpeg" className="hidden" />

          <div className={`h-64 w-full border-gray-400 ${preview ? 'border-0' : 'border-4'} rounded-lg relative flex flex-col items-center justify-center overflow-hidden`}>
            {preview ? (
              <img src={preview} className="object-contain h-full w-full max-h-96" />
            ) : (
              <>
                <div className="flex-grow flex justify-center items-center">
                  <div className="w-32 h-32 bg-gray-400 rounded-full grid place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1F2937" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </div>
                <div className="pb-4 text-gray-400 font-bold text-3xl">Tap to upload</div>
              </>
            )}
          </div>
        </label>
      </div>

      <TextInput name="story" label="Story" value={story || ''} handleChange={handleChange} textArea />

      <Button variant="contained" className="w-full mt-4" disabled={isNil(file) || isEmpty(story)} handleClick={handleSubmit}>
        Upload
      </Button>
    </div>
  );
};

export default Upload;
