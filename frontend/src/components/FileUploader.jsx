import React, { useState } from "react";
import Text from "./Text";

const FileUploader = ({handleFile}) => {
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState("initial");

  const handleFileChange = (e) => {
    if (e.target.files) {
      setStatus("initial");
      setFiles(e.target.files);
      handleFile(e.target.files);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = Array.from(files);
    newFiles.splice(index, 1);
    setFiles(newFiles.length > 0 ? newFiles : null);
  };

  return (
    <div className="flex-auto rounded-2xl p-4 max-w-lg mx-auto">
      <div className="input-group mb-4">
        <label
          htmlFor="uploadFile1"
          className="text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-black border-dashed mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-11 mb-2 fill-gray-500"
            viewBox="0 0 32 32"
          >
            <path
              d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
              data-original="#000000"
            />
            <path
              d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
              data-original="#000000"
            />
          </svg>
          Upload file
          <input
            onChange={handleFileChange}
            type="file"
            id="uploadFile1"
            className="hidden"
          />
          <p className="text-xs font-medium text-gray-400 mt-2">
            PNG, JPG SVG, WEBP, and GIF are Allowed.
          </p>
        </label>
      </div>

      {files &&
        Array.from(files).map((file, index) => (
          <section
            key={file.name}
            className="mb-4 p-4 bg-gray-100 rounded shadow"
          >
            <Text type="sm-heading">File details:</Text>
            <ul className="list-disc list-inside">
              <Text>Name: {file.name}</Text>
            </ul>
            <button
              onClick={() => handleRemoveFile(index)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </section>
        ))}
      <Result status={status} />
    </div>
  );
};

const Result = ({ status }) => {
  if (status === "success") {
    return (
      <p className="text-green-600 font-bold mt-4">
        ✅ File uploaded successfully!
      </p>
    );
  } else if (status === "fail") {
    return (
      <p className="text-red-600 font-bold mt-4">❌ File upload failed!</p>
    );
  } else if (status === "uploading") {
    return (
      <p className="text-blue-600 font-bold mt-4">
        ⏳ Uploading selected file...
      </p>
    );
  } else {
    return null;
  }
};

export default FileUploader;
