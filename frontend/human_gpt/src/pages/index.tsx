import "./home.css"

export default function Main() {
    const chatNowButton = () => {
        window.location.replace("/chat");
    }

    return(
        <div id="main-home">
            <h1>HumanGPT</h1>
            <div id="description">
                <p>This is HumanGPT, a project created by <a href="https://joey.now">Joey Lieb</a></p>
                <p>It is a fine-tuned GPT2 Model trained off of 1.5 million tokens of discord chats</p>
                <p>You can learn more <a href="https://blog.joey.now/tag/projects/">here</a></p>
            </div>
            <button id="chat-now" onClick={chatNowButton}>Chat Now</button>
        </div>
    )
}