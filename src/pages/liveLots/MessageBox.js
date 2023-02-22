import React, { useEffect } from "react";
import AOS from "aos";

const MessageBox = (messageBoxContent) => {
  return (
    <div>
      {messageBoxContent &&
        messageBoxContent?.messageBoxContent?.map((messageObject, index) => (
          <>
            {messageObject.type === "seller" ? (
              <div
                className={`bidComment ${
                  messageObject.message.includes("sold")
                    ? "blue"
                    : messageObject.message.includes("Opened")
                    ? "green"
                    : "yellow"
                }`}
                key={index}
              >
                {messageObject.message}
              </div>
            ) : (
              <div className="bidComment" key={index}>
                {messageObject.message}
              </div>
            )}
          </>
        ))}
    </div>
  );
};

export default MessageBox;
