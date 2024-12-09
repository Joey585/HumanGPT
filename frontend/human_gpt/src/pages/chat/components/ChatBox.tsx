import React, {ChangeEvent, useState} from "react";
import "../css/ChatBox.css"

export const ChatBox = ({ messageCallback }: { messageCallback: (message: string) => void }) => {
    const [messageSent, editMessage] = useState<string>("");
    const onSubmit = () => {
        if(messageSent.trim() !== ""){
            messageCallback(messageSent)
            editMessage("")
        }
    }

    const onMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        editMessage(e.target.value);
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter"){
            e.preventDefault();
            onSubmit();
        }
    }

    return(
        <div id="chatbox">
            <input type="text"
                   placeholder="Message HumanGPT..."
                   onChange={onMessageChange}
                   value={messageSent}
                   onKeyDown={onKeyDown}
                   id="chat-input"
            />
            {messageSent.length > 0 ? (<button id="submit-chat" onClick={onSubmit}></button>) : null}
        </div>
    )
}
