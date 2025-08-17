import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Import Quill's CSS
import { marked } from 'marked'
import { FaMagic, FaSpinner } from 'react-icons/fa' // Import icons

function SummaryEditor({ transcript, prompt, summary, setPrompt, setSummary, setHtmlSummary }) {
  const [editorHtml, setEditorHtml] = useState('')
  const [loading, setLoading] = useState(false) // Add loading state

  useEffect(() => {
    // Convert the initial summary (from AI, potentially Markdown) to HTML
    if (summary) {
      const htmlContent = marked.parse(summary);
      setEditorHtml(htmlContent);
      setHtmlSummary(htmlContent); // Set HTML content for App.jsx
    }
  }, [summary, setHtmlSummary])

  const generateSummary = async () => {
    setLoading(true) // Set loading to true
    try {
      const res = await axios.post('https://ai-meeting-summarizer-sharer.onrender.com/api/summary', {
        transcript,
        prompt
      })
      const htmlSummary = marked.parse(res.data.summary)
      setSummary(res.data.summary) // Keep original summary if needed, or change to setEditorHtml
      setEditorHtml(htmlSummary) // Set HTML content for Quill
      setHtmlSummary(htmlSummary) // Set HTML content for App.jsx
      toast.success('Summary generated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary.')
    } finally {
      setLoading(false) // Set loading to false
    }
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link',
  ]

  return (
    <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Summary Editor</h2>
      <textarea
        className="w-full border p-3 rounded-md mb-4 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ease-in-out resize-y min-h-[100px] shadow-sm"
        rows="3"
        placeholder="Enter custom instruction/prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateSummary}
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out shadow-md mb-4 flex items-center justify-center"
        disabled={loading} // Disable button when loading
      >
        {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaMagic className="mr-2" />}
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>

      <div className="mb-4">
        <ReactQuill
          theme="snow"
          value={editorHtml}
          onChange={setEditorHtml}
          modules={modules}
          formats={formats}
          placeholder="Generated summary will appear here..."
          className="bg-white rounded-md shadow-sm"
        />
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-700">Summary HTML Preview:</h3>
      <div
        className="border p-4 rounded-md bg-white preview-box shadow-inner"
        dangerouslySetInnerHTML={{ __html: editorHtml }}
      />
    </div>
  )
}

export default SummaryEditor
