import { useAuthStore } from "@/store/useAuthStore"

const MessageBubble = ({message}) => {
  const date = new Date(message.createdAt);
  const time = date.toTimeString().split(" ")[0].slice(0, 5);

  const {authUser} = useAuthStore();
  return (
    
    <div className={`w-full flex flex-col py-4 px-2 ${authUser._id === message.senderId?"items-end":"items-start"}`}> 
      <div className={`flex flex-col max-w-[95%] md:max-w-[85%] lg:max-w-[70%] xl:max-w-[65%] 2xl:max-w-[55%] text-sm justify-end items-end`}>
        {message.image && (
          <img src={message.image} className="rounded-xl w-150"/>
        )}
          <div className={` ${authUser._id === message.senderId?"bg-primary w-fit mt-1 text-white":"bg-foreground/5 text-foreground"} p-3 rounded-lg `}>
              {message.text}
          </div>
          <div className="w-full relative ">
            <span className="text-[8px] mt-1 absolute right-1 text-foreground">
              {time}
            </span>
          </div>
        
      </div>
    </div>
  )
}

export default MessageBubble