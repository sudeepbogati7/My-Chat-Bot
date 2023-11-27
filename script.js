const sendChatBtn = document.querySelector(".chat-input span"); //send button
const chatInput = document.querySelector(".chat-input textarea"); // chat input 
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
const inputInitHeight = chatInput.scrollHeight;

let userMsg;
const API_KEY = "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";

const createChatLi = (message , className) => {
    // create a chat <li> element with passed message and class name 
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className)
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}


const generateResponse = (incomingChatLi)=> {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const msgElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method : "POST", 
        headers : {
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body : JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": userMsg}]
        })
    }

    //send POST request to API and get response 
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        msgElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        msgElement.classList.add("error");
        msgElement.textContent = "Opps! Something went wrong . Please try again. ";
    }).finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight));
}


const handleChat = () =>{
    userMsg = chatInput.value.trim();
    if(!userMsg) return ;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    //append user msg to the chatbox
    chatbox.appendChild(createChatLi(userMsg, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking .....", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

//adjust the height of the inputarea based on the scroll height 
chatInput.addEventListener('input', ()=> {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener('keyup', (e)=> {
    //if eneter key is pressed without shift and window
    if(e.key == 'Enter' && !e.shiftkey && window.innerWidth > 800 ){
        e.preventDefault();
        handleChat();
    }
})

chatbotToggler.addEventListener('click', () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener('click', () => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener('click', handleChat)