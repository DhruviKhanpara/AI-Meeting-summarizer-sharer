import React, { useState } from 'react'
import mammoth from 'mammoth'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaFileUpload, FaUpload } from 'react-icons/fa'

function TranscriptUpload({ onUpload }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://ai-meeting-summarizer-sharer.onrender.com'

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const allowedExtensions = ['txt', 'docx']
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()

    if (!allowedExtensions.includes(fileExtension)) {
      setError('Only .txt and .docx files are allowed.')
      toast.error('Only .txt and .docx files are allowed.')
      return
    }

    setError('')
    setFile(selectedFile)

    if (fileExtension === 'txt') {
      const reader = new FileReader()
      reader.onload = (event) => {
        setText(event.target.result)
        onUpload(event.target.result)
      }
      reader.readAsText(selectedFile)
    } else if (fileExtension === 'docx') {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer()
        const { value } = await mammoth.extractRawText({ arrayBuffer })
        setText(value)
        onUpload(value)
      } catch (err) {
        setError('Failed to extract text from .docx file.')
        toast.error(err.response?.data?.message || 'Failed to extract text from .docx file.')
      }
    }
  }

  const handleChange = (e) => {
    setText(e.target.value)
    onUpload(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await axios.post(
          `${backendURL}/api/transcripts/file`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        console.log('File uploaded:', res.data)
        toast.success('File uploaded successfully!')
      } else {
        if (!text.trim()) {
          setError('Transcript cannot be empty.')
          toast.error('Transcript cannot be empty.')
          return
        }

        const res = await axios.post(
          `${backendURL}/api/transcripts/manual`,
          { transcript: text }
        )
        console.log('Manual transcript saved:', res.data)
        toast.success('Manual transcript saved successfully!')
      }

      setError('')
      setFile(null)
    } catch (err) {
      console.error(err)
      setError('Error uploading transcript')
      toast.error('Error uploading transcript')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Transcript</h2>
      <textarea
        className="w-full border p-3 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out resize-y min-h-[150px] shadow-sm"
        rows="6"
        placeholder="Paste transcript here or upload a file..."
        value={text}
        onChange={handleChange}
      />
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label block text-gray-700 font-medium mb-2">
          <FaFileUpload className="inline-block mr-2 text-blue-600" />
          Upload Transcript:
        </label>
        <input
          className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
          type="file"
          accept=".txt,.docx"
          onChange={handleFileUpload}
          id="formFile"
        />
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out shadow-md flex items-center justify-center"
      >
        <FaUpload className="mr-2" />
        Upload Transcript
      </button>
    </form>
  )
}

export default TranscriptUpload
