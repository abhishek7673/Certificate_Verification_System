import React, { useState, useRef, useEffect } from 'react';
import { CiUser } from "react-icons/ci";
import { HiPencil } from "react-icons/hi2";
import { fetchProfileImageAPI, getUserProfileAPI, updateProfileAPI, updateProfileImageAPI } from '../../APIServices/userAPI.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Buffer } from 'buffer';
import { ImSpinner8 } from 'react-icons/im';

export default function EmployerDash() {

  const imageInputRef = useRef(null);
  const QueryClient = useQueryClient();

  const [imageSrc, setImageSrc] = useState('');

  const { data: profilePic, isLoading: dpLoading } = useQuery({
    queryKey: ["fetch-profile-pic"],
    queryFn: fetchProfileImageAPI,
  });

  const { data: user, isLoading: profileLoading } = useQuery({
    queryKey: ["user-auth"],
    queryFn: getUserProfileAPI,
  });

  // console.log(user)
  const updateProfile = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateProfileAPI,
  });
  const { isPending: profilePending } = updateProfile;

  useEffect(() => {
    if (profilePic && profilePic.data) {
      const buffer = profilePic.data;
      const base64String = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64String}`;
      setImageSrc(dataUrl);
    }
  }, [profilePic, user]);

  useEffect(() => {
    if (user) {
      setProfile(prevProfile => ({
        ...prevProfile,
        fullName: user?.user?.fullName || '',
        email: user?.user?.email || '',
        headline: user?.user?.headline || '',
        description: user?.user?.description || '',
        city: user?.user?.city || '',
        state: user?.user?.state || '',
        country: user?.user?.country || '',
        mobile: user?.user?.mobile || '',
        linkedIn: user?.user?.linkedIn || '',
      }));
    }
  }, [user]);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    headline: '',
    description: '',
    city: '',
    state: '',
    country: '',
    mobile: '',
    linkedIn: '',
  });

  const [isEditing, setIsEditing] = useState({
    profilePic: false,
    fullName: false,
    headline: false,
    description: false,
    contact: false
  });

  const updateProfilePic = useMutation({
    mutationKey: ["update-profile-pic"],
    mutationFn: updateProfileImageAPI,
  });
  const { isPending: dpPending } = updateProfilePic;

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('File size cannot exceed 1 MB!');
        return;
      }
    }
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      // console.log(file)
      const formData = new FormData();
      formData.append('profilePic', file);

      updateProfilePic
        .mutateAsync(formData)
        .then((data) => toast.success(data.msg))
        .then(() => QueryClient.invalidateQueries('fetch-profile-pic'))
        .catch((error) => console.log(error));
    } else {
      toast.error('Invalid file type. Only .jpg, .jpeg, and .png files are allowed.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const setAllEditingFieldsToFalse = () => {
    const updatedEditingState = Object.keys(isEditing).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    setIsEditing(updatedEditingState);
  };

  const handleSave = async () => {
    updateProfile
      .mutateAsync(profile)
      .then(() => setAllEditingFieldsToFalse())
      .then(() => toast.success('Profile updated successfully'))
      .catch((error) => console.log(error));

  };

  return (
    <div className="container mx-auto p-6 min-h-screen max-w-lg lg:max-w-2xl">
      <div className="p-6 rounded shadow-xl">
        <div className="flex items-center mb-6">
          <div className="relative">
            {(dpLoading || dpPending) ? <ImSpinner8 className='animate-spin text-gray-700 w-20 h-20' /> : (
              imageSrc ? (
                <img src={imageSrc} alt="Profile" className="w-24 h-24 rounded-full" />
              ) : (
                <CiUser className="w-24 h-24 p-4 bg-gray-200 rounded-full" />
              )
            )}
            <button onClick={() => imageInputRef.current.click()} className="absolute bottom-1 right-1 bg-gray-300 p-1 rounded-full">
              <HiPencil />
            </button>
            <div className="mt-2">
              <input
                type="file"
                ref={imageInputRef}
                className='hidden'
                name="profilePic"
                accept=".jpg,.jpeg,.png"
                onChange={handleProfilePicChange}
              />
            </div>
          </div>
          {profileLoading ? <ImSpinner8 className='animate-spin ml-12 text-gray-700 w-8 h-8' /> : (
            <div className="ml-4">
              <h2 className="text-2xl font-bold">
                {isEditing.fullName ? (
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} className="border p-1 w-44" />
                ) : (
                  profile.fullName
                )}
                <button onClick={() => handleEditClick('fullName')} className="ml-2 hover:bg-gray-300 p-1 rounded-full">
                  <HiPencil />
                </button>
              </h2>
              <p className="text-gray-600">
                {isEditing.headline ? (
                  <input type="text" name="headline" value={profile.headline} onChange={handleInputChange} className="border p-1" />
                ) : (
                  profile.headline
                )}
                <button onClick={() => handleEditClick('headline')} className="ml-2 hover:bg-gray-300 p-1 rounded-full">
                  <HiPencil />
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className='flex items-center gap-2'>
            <h3 className="text-xl font-bold">About</h3>
            <button onClick={() => handleEditClick('description')} className="hover:bg-gray-300 p-1 rounded-full">
              <HiPencil />
            </button>
          </div>
          <div>
            <label className="block text-gray-500 font-semibold">Description:</label>
            {isEditing.description ? (
              <textarea name="description" value={profile.description} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.description}</p>
            )}

          </div>
        </div>

        <div className="mb-6">
          <div className='flex items-center gap-2'>
            <h3 className="text-xl font-bold">Contact</h3>
            <button onClick={() => handleEditClick('contact')} className="hover:bg-gray-300 p-1 rounded-full">
              <HiPencil />
            </button>
          </div>
          <div>
            <label className="block text-gray-500 font-semibold">Email Id:</label>
            {isEditing.contact ? (
              <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.email}</p>
            )}

          </div>
          <div className="mt-4">
            <label className="block text-gray-500 font-semibold">Mobile No:</label>
            {isEditing.contact ? (
              <input type="text" name="mobile" value={profile.mobile} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.mobile}</p>
            )}

          </div>
          <div className="mt-4">
            <label className="block text-gray-500 font-semibold">LinkedIn URL:</label>
            {isEditing.contact ? (
              <input type="url" name="linkedIn" value={profile.linkedIn} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <a className='text-blue-600 hover:underline' target='_blank' rel="noreferrer" href={profile.linkedIn}>{profile.linkedIn}</a>
            )}

          </div>
        </div>

        <div className="mb-6">
          <h3 className="inline text-xl font-bold mb-2 mr-2">Location:</h3>
          <button onClick={() => handleEditClick('location')} className="hover:bg-gray-300 text-sm p-1 rounded-full">
            <HiPencil />
          </button>
          <div>
            <label className="text-gray-500 font-semibold mr-2">City:</label>
            {isEditing.location ? (
              <input type="text" name="city" value={profile.city} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.city}</p>
            )}

          </div>
          <div className="mt-4">
            <label className="block text-gray-500 font-semibold">State:</label>

            {isEditing.location ? (
              <input type="text" name="state" value={profile.state} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.state}</p>
            )}

          </div>
          <div className="mt-4">
            <label className="block text-gray-500 font-semibold">Country:</label>
            {isEditing.location ? (
              <input type="text" name="country" value={profile.country} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.country}</p>
            )}

          </div>
        </div>
        {profilePending ? <ImSpinner8 className='animate-spin text-gray-700 w-10 h-10' /> : (
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
            onClick={handleSave}
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}