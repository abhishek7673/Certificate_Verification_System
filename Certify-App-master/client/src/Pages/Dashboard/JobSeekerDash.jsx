import React, { useState, useEffect, useRef } from 'react';
import { CiUser } from "react-icons/ci";
import { HiPencil } from "react-icons/hi2";
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfileImageAPI, fetchResumeAPI, getUserProfileAPI, updateProfileAPI, updateProfileImageAPI, updateResumeAPI } from '../../APIServices/userAPI.js';
import { FaDownload } from "react-icons/fa";
import { Buffer } from 'buffer';
import { ImSpinner8 } from 'react-icons/im';

export default function JobSeekerDash() {

  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const queryClient = useQueryClient();

  const [imageSrc, setImageSrc] = useState('');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-auth"],
    queryFn: getUserProfileAPI,
  });

  const { data: resumeData, isLoading: resumeLoading } = useQuery({
    queryKey: ["fetch-resume"],
    queryFn: fetchResumeAPI,
  });

  const { data: profilePic, isLoading: dpLoading } = useQuery({
    queryKey: ["fetch-profile-pic"],
    queryFn: fetchProfileImageAPI,
  });

  // console.log(profilePic)

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
        skills: user?.user?.skills || '',
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
    headline: '',
    skills: '',
    description: '',
    city: '',
    state: '',
    country: '',
    email: '',
    mobile: '',
    linkedIn: '',
  });

  const [isEditing, setIsEditing] = useState({
    fullName: false,
    headline: false,
    skills: false,
    description: false,
    location: false,
    contact: false,
  });

  const updateProfile = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateProfileAPI,
  });

  const { isPending: profileUpdatePending } = updateProfile;

  const updateResume = useMutation({
    mutationKey: ["update-resume"],
    mutationFn: updateResumeAPI,
  });

  const updateProfilePic = useMutation({
    mutationKey: ["update-profile-pic"],
    mutationFn: updateProfileImageAPI,
  });

  const handleSave = async (field) => {
    updateProfile
      .mutateAsync(profile)
      .then(() => {
        const newIsEditingState = Object.keys(isEditing).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        setIsEditing(newIsEditingState);
      })
      .then(() => toast.success('Profile updated successfully'))
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

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
        .then(() => queryClient.invalidateQueries('fetch-profile-pic'))
        .catch((error) => console.log(error));
    } else {
      toast.error('Invalid file type. Only .jpg, .jpeg, and .png files are allowed.');
    }
  };

  const handleResumeChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('File size cannot exceed 1 MB');
        return;
      }
    }
    const formData = new FormData();
    formData.append('resume', file);

    updateResume
      .mutateAsync(formData)
      .then((data) => toast.success(data.msg))
      .then(() => queryClient.invalidateQueries('fetch-resume'))
      .catch((error) => console.log(error));
  };

  const handleDownloadResume = () => {
    const blob = new Blob([new Uint8Array(resumeData?.data.data)], { type: resumeData?.contentType });
    const url = window.URL.createObjectURL(blob);

    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = resumeData?.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  return (
    <div className="container mx-auto p-6 min-h-screen max-w-lg lg:max-w-2xl">
      <div className="p-6 rounded shadow-xl">
        <div className="flex items-center mb-6">
          <div className="relative">
            {(dpLoading || updateProfilePic.isPending) ? <ImSpinner8 className='h-24 w-24 text-gray-700 animate-spin' /> : (
              imageSrc ? (
                <img src={imageSrc} alt="Profile" className="w-24 h-24 shadow-md rounded-full" />
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
                accept=".jpg,.jpeg,.png"
                onChange={handleProfilePicChange}
              />
            </div>

          </div>
          {userLoading ? <ImSpinner8 className='ml-12 h-12 w-12 text-gray-700 animate-spin' /> : (
            <div className="ml-4">
              <h2 className="text-2xl font-bold">
                {isEditing.fullName ? (
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} className="border p-1 w-40" />
                ) : (
                  profile.fullName
                )}
                <button onClick={() => handleEditClick('fullName')} className="ml-2 hover:bg-gray-300 text-base p-1 rounded-full">
                  <HiPencil />
                </button>
              </h2>
              <p className="text-gray-600">
                {isEditing.headline ? (
                  <input type="text" name="headline" value={profile.headline} onChange={handleInputChange} className="border p-1" />
                ) : (
                  profile.headline
                )}
                <button onClick={() => handleEditClick('headline')} className="ml-2 text-black hover:bg-gray-300 text-sm p-1 rounded-full">
                  <HiPencil />
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">About</h3>

          <div>
            <label className="text-gray-500 font-semibold mr-2">Skills:</label>
            <button onClick={() => handleEditClick('skills')} className="hover:bg-gray-300 text-sm p-1 rounded-full">
              <HiPencil />
            </button>
            {isEditing.skills ? (
              <input type="text" name="skills" value={profile.skills} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.skills}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="text-gray-500 font-semibold mr-2">Description:</label>
            <button onClick={() => handleEditClick('description')} className="hover:bg-gray-300 text-sm p-1 rounded-full">
              <HiPencil />
            </button>
            {isEditing.description ? (
              <textarea name="description" value={profile.description} onChange={handleInputChange} className="border p-1 w-full" />
            ) : (
              <p>{profile.description}</p>
            )}
          </div>

        </div>

        <div className="mb-6">
          <h3 className="inline text-xl font-bold mb-2 mr-2">Location</h3>
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

        <div className="mb-6">
          <h3 className="inline mr-2 text-xl font-bold mb-2">Contact</h3>
          <button onClick={() => handleEditClick('contact')} className="hover:bg-gray-300 text-sm p-1 rounded-full">
            <HiPencil />
          </button>
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

        {/* RESUME UPLOAD HERE */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Upload Resume</h3>
          <div className='flex gap-4 items-center'>
            {resumeLoading && <ImSpinner8 className='h-12 w-12 text-gray-700 animate-spin' />}
            {
              resumeData?.data &&
              <button onClick={handleDownloadResume}
                className='flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
              >
                {resumeData?.filename} <FaDownload />
              </button>
            }
            {updateResume.isPending ? <ImSpinner8 className='h-12 w-12 text-gray-700 animate-spin' /> : (
              <div className='my-2'>
                <input type="file" ref={resumeInputRef} name="resume" accept=".pdf" onChange={handleResumeChange} className="hidden" />
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
                  onClick={() => resumeInputRef.current.click()}
                >
                  {resumeData?.data ? 'Update Resume' : 'Upload Resume'}
                </button>
              </div>
            )}
          </div>
        </div>
        {
          profileUpdatePending ? <ImSpinner8 className='h-12 w-12 text-gray-700 animate-spin' /> : (
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
              onClick={handleSave}
            >
              Save Changes
            </button>
          )
        }
      </div>
    </div>
  );
}