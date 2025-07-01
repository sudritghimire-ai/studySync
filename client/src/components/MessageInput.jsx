"use client"

import { useEffect, useRef, useState } from "react"
import { useMessageStore } from "../store/useMessageStore"
import { Send, Smile, Paperclip, Mic, ImageIcon, X } from "lucide-react"
import EmojiPicker from "emoji-picker-react"

const MessageInput = ({ match }) => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [attachments, setAttachments] = useState([])
  const emojiPickerRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const { sendMessage, isLoadingSendMessage } = useMessageStore()

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(match._id, message.trim())
      setMessage("")
      setAttachments([])
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleTextareaChange = (e) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-3 z-50">
          <div className="bg-purple-800/95 backdrop-blur-xl rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden">
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                setMessage((prevMessage) => prevMessage + emojiObject.emoji)
              }}
              theme="dark"
              searchDisabled={false}
              skinTonesDisabled={false}
              width={350}
              height={400}
              previewConfig={{
                showPreview: false,
              }}
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative flex items-center gap-2 px-3 py-2 bg-purple-700/50 backdrop-blur-sm rounded-xl border border-purple-600/30 shadow-lg"
            >
              <ImageIcon size={16} className="text-amber-400" />
              <span className="text-sm text-purple-200 truncate max-w-32">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="p-1 hover:bg-purple-600/50 rounded-full transition-colors duration-200"
              >
                <X size={12} className="text-purple-300 hover:text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSendMessage} className="relative w-full">
        <div className="w-full flex items-center gap-3 p-4 bg-transparent border-t border-purple-700/50">
          {/* Text Input */}
          <div className="flex-grow relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${match.name}...`}
className="w-full bg-purple-700/30 text-purple-100 placeholder-white-400 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-200 min-h-[48px] max-h-[120px] scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent rounded-full"
              rows={1}
              disabled={isLoadingSendMessage}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoadingSendMessage}
            className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-purple-600 disabled:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex-shrink-0 border border-amber-400/30 disabled:border-purple-600/30"
          >
            {isLoadingSendMessage ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </form>
    </div>
  )
}

export default MessageInput
