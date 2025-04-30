import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("HR");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData);
      setMessage(res.data.message);
      setPreviewUrl(res.data.file_url);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed: " + error.message);
    }
  };

  return (
    <div className="app">
      <h1>File Upload App</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="HR">HR</option>
        <option value="IT">IT</option>
        <option value="Sales">Sales</option>
      </select>

      <button onClick={handleUpload}>Upload</button>

      <p>{message}</p>

      {previewUrl && (
        <div className="preview">
          <h3>Uploaded File Preview:</h3>
          {previewUrl.endsWith(".pdf") ? (
            <iframe src={previewUrl} width="100%" height="500px" title="PDF Preview" />
          ) : (
            <img src={previewUrl} alt="Uploaded file" />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
