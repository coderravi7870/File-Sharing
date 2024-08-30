import React, { useState, useRef } from "react";
import { VscCopy } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGithub } from "react-icons/fa";

const App = () => {
  const [file, setFile] = useState(null);
  const [emailFrom, setEmailFrom] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [link, setLink] = useState("");
  const [uuid, setUuid] = useState("");

  // Create a ref for the file input
  const fileInputRef = useRef();
  const notify = (msg) => toast(msg);

  const handleFileInput = async (e) => {
    const avatar = e.target.files[0];
    setFile(avatar);
    setLink(`https://file-sharing-backend-y7ba.onrender.com/files/showfile/${uuid}`); // This is just a placeholder

    if (avatar) {
      const newFormData = new FormData();
      newFormData.append("myfile", avatar);

      try {
        const response = await fetch("https://file-sharing-backend-y7ba.onrender.com/files/upload", {
          method: "POST",
          body: newFormData,
        });
        const result = await response.json();
        console.log(result);

        if (result) {
          setUuid(result.uuid);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        notify("copy successfully!");
        setFile(null); // Clear state
        fileInputRef.current.value = ""; // Clear file input
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://file-sharing-backend-y7ba.onrender.com/files/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailFrom: emailFrom,
          emailTo: emailTo,
          uuid: uuid,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFile(null); // Clear state
        fileInputRef.current.value = ""; // Clear file input
        toast(`successfully send!`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="w-full bg-slate-300">
      {/* navbar */}
      <div className="bg-[#f5f5f5] py-4 shadow-lg flex justify-between items-center">
        <img src="/Images/logo.png" alt="" className="w-36 h-12 ml-5" />
        <a href="https://github.com/coderravi7870?tab=repositories"><FaGithub size={30}  className="mr-12"/></a>
      </div>

      {/* main Section  */}
      <div className="flex justify-center items-center h-[87vh]">
        <div className="bg-white p-4 rounded-lg ">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="fileUpload"
              className="block text-xl font-serif mb-3"
            >
              Choose a file:
            </label>
            <div className="flex flex-col w-[100%]">
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef} // Attach ref to the file input
                onChange={handleFileInput}
              />
              {file && (
                <div className="mt-4">
                  <div className="flex">
                    <input
                      type="text"
                      required
                      value={link}
                      readOnly
                      className="ml-2 bg-slate-100 px-2 outline-none py-1 mb-5 "
                    />
                    <VscCopy
                      className="w-8 h-8 bg-slate-100 rounded-md"
                      onClick={handleCopyToClipboard}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="from">From:</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter email"
                      value={emailFrom}
                      className="ml-2 bg-slate-100 px-2 outline-none py-1 focus:border focus:border-blue-400"
                      onChange={(e) => setEmailFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="to">To:</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter email"
                      value={emailTo}
                      className="ml-7 bg-slate-100 px-2 outline-none py-1 focus:border focus:border-blue-400"
                      onChange={(e) => setEmailTo(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className=" bg-blue-500 py-1 rounded-lg mt-4 hover:bg-blue-400"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
