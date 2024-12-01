import "../css/Output.css"

export interface Message {
    author: number,
    content: string
}

export const Output = ({conversation}: {conversation: Array<Message>}) => {
    return(
        <div id="conversation-output">
            {conversation.map((message, index) => (
                <span className={"message-" + message.author}>{message.content}</span>
            ))}
        </div>
    )
}
