import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, X, SendHorizontal } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import toast from "react-hot-toast";
import { errorTheme } from "@/styles/ToastStyle";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);     
  const fileInputRef = useRef(null);
  const [disableSend , setDisableSend] = useState(false);
  const {sendImage , isMessagesLoading , sendMessages} = useChatStore();
  const {selectedUser} = useChatStore();

  useEffect(()=>{
    setText("");
    setImage(null);
    setPreview(null);

  } , [selectedUser])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
        setImage(file);
        setPreview(URL.createObjectURL(file)); 
    }
    };

  const handleSend = async () => {
    setDisableSend(true);
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
      const base64data = reader.result;
      if (!text.trim() && !image) return;
      if (isMessagesLoading)  return;
      try {
          await sendMessages({ text:text.trim(), image:base64data });
          console.log("Message:", text);
          console.log("Image:", image);
          toast.success("Message sent!");

      } catch (error) {
          toast.error("Failed to send message "+error.message , errorTheme);
      }
      finally{
        
          setDisableSend(false);
          setText("");
          setImage(null);
          setPreview(null)
      }
    };
    
  };

  return (
    <div className="w-full bg-white/70 dark:bg-[#18181880]">
      {/* Image Preview */}
      {image && (
        <div className="relative mb-2 flex gap-4  border dark:border-gray-300/20 border-gray-600/30 rounded-xl w-full p-4 overflow-hidden ">
          <div className="flex gap-2">

          
            <img
                src={preview}
                alt="preview"
                className="w-full max-h-20 object-contain"
            />
            <button
                className="w-fit h-fit top-2 right-2 bg-black/60 text-white rounded-full p-1"
                onClick={() => {setImage(null);setPreview(null);}}
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
          className="p-2  hover:text-primary/70"
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            rows={1} // start small
            className="flex-1 resize-none dark:text-white/80 text-black/70 px-2 py-2 outline-none bg-transparent max-h-40"
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                }
            }}
        />

        {/* Send Icon */}
        <button
          className={`p-2 transition-all flex items-center justify-center duration-100 cursor-pointer rounded-xl px-2 text-white bg-primary ${!text.trim() && !image ? "  cursor-not-allowed" : "hover:scale-103"}`}
          onClick={handleSend}
          disabled={(!text.trim() && !image) || disableSend}
        >
          <SendHorizontal size={20} className="" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
