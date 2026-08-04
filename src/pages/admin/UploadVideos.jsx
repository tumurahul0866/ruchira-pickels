import React, { useState } from 'react';

const UploadVideos = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      // Logic to upload video
      console.log('Video uploaded:', selectedFile.name);
    }
  };

  return (
    <div className="upload-videos">
      <h1>Upload Videos</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Video:
          <input type="file" accept="video/*" onChange={handleFileChange} required />
        </label>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadVideos;