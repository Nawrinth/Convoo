import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal, Image as ImageIcon, X } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import toast from "react-hot-toast";
import { errorTheme } from "@/styles/ToastStyle";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [disableSend, setDisableSend] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const { sendMessages, isMessagesLoading, selectedUser } = useChatStore();

  // Reset input when user changes
  useEffect(() => {
    setText("");
    setImage(null);
    setPreview(null);
  }, [selectedUser]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [text]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSend = async () => {
    setDisableSend(true);

    // Prevent sending empty messages
    if (!text.trim() && !image) {
      setDisableSend(false);
      return;
    }

    if (isMessagesLoading) {
      setDisableSend(false);
      return;
    }

    try {
      let base64data = null;

      // ✅ Only process FileReader if an image exists
      if (image) {
        const reader = new FileReader();
        base64data = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      // ✅ Send the message (text + optional image)
      await sendMessages({ text: text.trim(), image: base64data });

      console.log("Message:", text);
      console.log("Image:", image);
      toast.success("Message sent!");
    } catch (error) {
      toast.error("Failed to send message: " + error.message, errorTheme);
    } finally {
      // Reset states
      setDisableSend(false);
      setText("");
      setImage(null);
      setPreview(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-white/70 dark:bg-[#18181880] mb-6">
      {/* Image Preview */}
      {image && (
        <div className="relative mb-2 flex gap-4 border dark:border-gray-300/20 border-gray-600/30 rounded-xl w-full p-4 overflow-hidden">
          <div className="flex gap-2">
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-20 object-contain"
            />
            <button
              className="w-fit h-fit top-2 right-2 bg-black/60 text-white rounded-full p-1"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2 border border-gray-600/30 rounded-lg px-4 py-1">
        {/* Image Upload */}
        <button
          className="p-2 hover:text-primary/70"
          onClick={() => fileInputRef.current.click()}
        >
          <ImageIcon size={22} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          rows={1}
          className="w-full resize-none overflow-auto max-h-40 text-black dark:text-white bg-transparent outline-none placeholder-gray-400 text-sm"
        />

        {/* Send Button */}
        <div className="flex items-end justify-end h-full">
          <button
            className={`p-2 transition-all flex items-center justify-center duration-100 rounded-xl px-2 text-white bg-primary ${
              !text.trim() && !image
                ? "cursor-not-allowed opacity-60"
                : "hover:scale-105"
            }`}
            onClick={handleSend}
            disabled={(!text.trim() && !image) || disableSend}
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
