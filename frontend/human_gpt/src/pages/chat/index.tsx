import {ChatBox} from "@/components/ChatBox";
import {Message, Output} from "@/components/Output";
import {useState} from "react";
import "@/components/css/index.css"
import Head from "next/head";
import {Header} from "@/components/Header";
import config from "../../../config.json"

export default function Chat(){
    const [currentConversation, setConversation] = useState<Array<Message>>([]);
    const [dropdownActive, setDropdown] = useState<boolean>(false);

    const getResponse = async (conversation: Array<Message>) => {
        const AIResponse = await fetch(config.backendLink, {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({conversation: conversation.slice(0,-1).map((message) => `user${message.author}: ${message.content.trim()}`).join("\n")})
        });

        if(!AIResponse.body) {
            console.error("Response body is null");
            return;
        }

        const reader = AIResponse.body.getReader()
        while (true) {
            const {value, done} = await reader.read()
            if (done) {
                finishMessageStream()
                break
            }
            if(value){
                const chunk = new TextDecoder().decode(value)
                console.log(chunk)
                const JSONData = JSON.parse(chunk.replace("data: ", ""))
                if(JSONData.event === 2 ){
                    appendToMessage(JSONData.data)
                }
            }
        }
    }

    const appendToMessage = (content: string) => {
        setConversation((prevConversation) => {
            if(prevConversation.length === 0) {
                console.error("No conversations");
                return prevConversation;
            }

            const updatedConversation = [...prevConversation];

            const lastMessage = {...updatedConversation[updatedConversation.length -1]};
            lastMessage.content = content.replace("\n", "");
            lastMessage.active = true;
            updatedConversation[updatedConversation.length -1] = lastMessage;

            return updatedConversation;
        })
    }

    const finishMessageStream = () => {
        setConversation((prevConversation) => {
            if(prevConversation.length === 0) {
                console.error("No conversations");
                return prevConversation;
            }

            const updatedConversation = [...prevConversation];
            const lastMessage = {...updatedConversation[updatedConversation.length -1]};
            lastMessage.active = false;
            updatedConversation[updatedConversation.length -1] = lastMessage;
            return updatedConversation;
        })
    }

    const onChat = (message: string) => {
        setConversation((prevConversation) => {
            const updatedConversation = [
                ...prevConversation,
                { content: message, author: 1 },
                {content: "", author: 2, active: true}
            ];
            getResponse(updatedConversation);
            return updatedConversation;
        });
    }

    const onBodyClick = () => {
        console.log("clicked body")
        setDropdown(false)
    }

    return(
        <div id="root-chat" onClick={onBodyClick}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet"/>
                <title>HumanGPT</title>
            </Head>
            <Header activeDropdown={dropdownActive}/>
            <Output conversation={currentConversation}></Output>
            <ChatBox messageCallback={onChat}/>
        </div>
    )
}
