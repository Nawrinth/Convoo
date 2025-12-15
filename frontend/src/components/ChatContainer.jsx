import React, { useRef, useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import HeaderChat from "./HeaderChat";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderCircle } from "lucide-react";

const ChatContainer = () => {
  const { selectedUser, getMessages } = useChatStore();
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["messages", selectedUser?._id],
    queryFn: ({ pageParam = 1 }) => getMessages(pageParam, selectedUser._id),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    enabled: !!selectedUser?._id,
  });

  // Flatten all pages (oldest → newest)
  const allMessages = data?.pages.flatMap((page) => page.messages) || [];

  // ✅ Reset scroll position when user changes
  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight; // go to bottom
    }
  }, [selectedUser?._id]);

  // ✅ Maintain scroll position when fetching older messages
  const handleFetchMore = async () => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const oldScrollHeight = scrollEl.scrollHeight;
    await fetchNextPage();
    const newScrollHeight = scrollEl.scrollHeight;

    // Maintain position after prepending messages
    scrollEl.scrollTop = newScrollHeight - oldScrollHeight + scrollEl.scrollTop;
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col h-full w-full text-gray-500">
        <HeaderChat />
        <div className="flex-1 p-4">Loading messages...</div>
        <div className="p-3 bg-background">
          <MessageInput />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col h-full w-full text-red-500 text-center">
        <HeaderChat />
        <div className="flex-1 p-4">Error loading messages</div>
        <div className="p-3 bg-background">
          <MessageInput />
S      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100vh] w-full md:max-w-[calc(100vw-350px)] overflow-hidden text-gray-500">
      <HeaderChat />

      <div
        id={`scrollableDiv-${selectedUser?._id}`} // ✅ unique id per chat
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3"
        style={{ height: "100%", display: "flex", flexDirection: "column-reverse" }}
      >
        <InfiniteScroll
          key={selectedUser?._id} // ✅ reinitialize for each user
          dataLength={allMessages.length}
          next={handleFetchMore}
          hasMore={!!hasNextPage}
          inverse={true}
          loader={
            isFetchingNextPage ? (
              <div className="text-center py-2 w-full flex items-center justify-center">
                <LoaderCircle className="size-6 text-primary animate-spin" />
              </div>
            ) : null
          }
          scrollableTarget={`scrollableDiv-${selectedUser?._id}`} // ✅ dynamic scroll target
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          {allMessages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))}
        </InfiniteScroll>
        <div ref={bottomRef} />
      </div>

      <div className="p-3 bg-background">
        <MessageInput />
      </div>
    </div>
  );
};
export default ChatContainer;S