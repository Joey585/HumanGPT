import "@/components/css/Output.css"
import {useEffect, useRef} from "react";

export interface Message {
    author: number,
    content: string
}

export const Output = ({conversation}: {conversation: Array<Message>}) => {
    const outputRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(outputRef.current){
            outputRef.current.scrollTop = outputRef.current.scrollHeight
        }
    }, [conversation]);

    return(
        <div id="conversation-output" ref={outputRef}>
            {conversation.map((message, index) => (
                <span className={"message-" + message.author} key={index}>{message.content}</span>
            ))}
        </div>
    )
}
