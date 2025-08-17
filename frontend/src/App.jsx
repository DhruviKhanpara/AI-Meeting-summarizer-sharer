import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TranscriptUpload from './components/TranscriptUpload'
import SummaryEditor from './components/SummaryEditor'
import EmailShare from './components/EmailShare'

function App() {
  const [transcript, setTranscript] = useState('')
  const [prompt, setPrompt] = useState('')
  const [summary, setSummary] = useState('')
  const [htmlSummary, setHtmlSummary] = useState('')

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">AI Meeting Summarizer</h1>
      <TranscriptUpload onUpload={setTranscript} />
      <SummaryEditor transcript={transcript} prompt={prompt} summary={summary} setPrompt={setPrompt} setSummary={setSummary} setHtmlSummary={setHtmlSummary} />
      <EmailShare transcript={transcript} prompt={prompt} summary={summary} htmlSummary={htmlSummary} />
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  )
}

export default App
