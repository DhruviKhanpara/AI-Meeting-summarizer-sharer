import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { WithContext as ReactTags } from 'react-tag-input'
import { FaEnvelope, FaPaperPlane, FaSpinner } from 'react-icons/fa';

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

function EmailShare({ transcript, prompt, summary, htmlSummary }) {
  const [tags, setTags] = useState([])
  const [emailContent, setEmailContent] = useState('')
  const [loading, setLoading] = useState(false) // Loading state

  useEffect(() => {
    setEmailContent(htmlSummary)
  }, [htmlSummary])

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag) => {
    const email = tag.text.trim()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address!')
      return
    }
    setTags([...tags, { id: email, text: email }])
  }

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)
    setTags(newTags)
  }

  const handleSend = async () => {
    setLoading(true) // Start loader
    try {
      await axios.post('http://localhost:5000/api/email', {
        summary: emailContent,
        recipients: tags.map(tag => tag.text),
        transcript: transcript.replace(/\n/g, '<br/>'),
        prompt: prompt.replace(/\n/g, '<br/>')
      })
      toast.success('Email sent successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email.')
    } finally {
      setLoading(false) // Stop loader
    }
  }

  return (
    <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Share Summary via Email</h2>
      <div className="mb-4">
        <label htmlFor="email-recipients" className="block text-gray-700 font-medium mb-2">
          <FaEnvelope className="inline-block mr-2 text-blue-600" />
          Recipients:
        </label>
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          delimiters={delimiters}
          inputFieldPosition="bottom"
          placeholder="Add email addresses"
          classNames={{
            tags: 'react-tags',
            tagInput: 'react-tags__tagInput',
            tagInputField: 'react-tags__tagInputField w-full border p-3 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 ease-in-out',
            selected: 'react-tags__selected',
            tag: 'react-tags__tag bg-blue-500 text-white px-3 py-1 rounded-full mr-2 mb-2 inline-flex items-center',
            remove: 'react-tags__remove ml-2 cursor-pointer',
            suggestions: 'react-tags__suggestions',
            activeSuggestion: 'react-tags__activeSuggestion',
          }}
        />
      </div>

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out shadow-md flex items-center justify-center"
        disabled={loading} // Disable button while sending
      >
        {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaPaperPlane className="mr-2" />}
        {loading ? 'Sending...' : 'Share via Email'}
      </button>
    </div>
  )
}

export default EmailShare
