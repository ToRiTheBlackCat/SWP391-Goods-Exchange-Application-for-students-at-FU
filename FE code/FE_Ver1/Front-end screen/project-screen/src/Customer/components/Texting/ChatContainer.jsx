import { useEffect, useState, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useLocation } from 'react-router-dom';
import userIcon from '../../assets/user.jpg';
import ChatWindowReceiver, { ChatWindowSender } from './ChatWindow';
import MessageInput from './MessageInput';
import { useNavigate } from 'react-router-dom';

export default function ChatContainer(){
    const location = useLocation();
    const sellerInfo = location.state?.sellerInfo; // Lấy sellerInfo từ state

    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(localStorage.getItem("userName"));
    const [avatar, setAvatar] = useState(userIcon);
    const [connection, setConnection] = useState(null);
    const [toAddress, setToAddress] = useState("");
    const navigate = useNavigate();
    const inSession = useRef(false);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://goodsexchangefu-api.azurewebsites.net/chat")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, []);

    const signUpConnection = useCallback(async () => {
        if (connection) {
            try {
                await connection.invoke("OnConnected", user);
            } catch (err) {
                console.error("Exception: " + err.toString());
            }
        }
    }, [connection, user]);

    const connectWithUser = useCallback(async () => {
        // if (connection && connection.connectionStarted) {
            try {
                if(inSession.current==false){
                const result = await connection.invoke("GetConnection", sellerInfo);
                if(result.length>5){
                    setToAddress(result);
                    inSession.current=true;
                }
            }
            } catch (err) {
                console.error(err.toString());
            }
        // } else {
        //     console.log('No connection to server yet.');
        // }
    }, [connection, sellerInfo]);

    const CheckConnection = useCallback(() => {
        if (connection) {
            connection.invoke("GetCurrentConnect")
                .then(function (result) {
                    console.log("Current Connection ID:", result);
                }).catch(function (err) {
                    return console.error("Exception: " + err.toString());
                });
        }
    }, [connection]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
                    signUpConnection();
                    CheckConnection();
                    connectWithUser();
                    connection.on('ReceiveMessage', (user, message) => {
                        setChats(prevChats => [...prevChats, { user, message }]);
                        return "Sent";
                    });
                    connection.on("ApproveConnect", (connectionId) => {
                        if (connectionId != null && connectionId !== "") {
                            if(inSession.current==false){
                                setToAddress(connectionId);
                                inSession.current=true;
                                return "Yesed";
                            }else{
                                return "No";
                            }
                        }
                        
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [connection, signUpConnection, connectWithUser, CheckConnection]);

    function sendChatToServer(chat) {
        // if (connection && connection.connectionStarted) {
            connection.invoke('SendMessagePrivate', chat.user, chat.message, toAddress)
                .catch(err => console.error('Error while sending message: ', err));
        // }
        //  else {
        //     console.log('No connection to server yet.');
        // }
    }

    function addMessage(chat) {
        const newChat = { ...chat, user, avatar };
        // setChats(prevChats => [...prevChats, newChat]);
        sendChatToServer(newChat);
    }

    function ChatList(){
        return chats.map((chat, index) => {
            if(chat.user === "Me") return <ChatWindowSender key={index} message={chat.message} avatar={avatar} user={chat.user}/>;
            return <ChatWindowReceiver key={index} message={chat.message} avatar={avatar} user={chat.user}/>;
        });
    }
    function handleBack(){
        navigate(-1);
    }

    return(
        <div style={{marginBottom:'100px'}}>
            <div style={{display: 'flex', flexDirection:"row", justifyContent:'space-between'}}>
                <h4>Username: {user}</h4>
                {sellerInfo && <h4>Chatting with: {sellerInfo}</h4>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* <button onClick={signUpConnection}>Sign up</button> */}
                <button onClick={handleBack} style={{backgroundColor:'black'}}>Back</button>
            </div>
            <ChatList/>
            <MessageInput addMessage={addMessage}/>
        </div>
    );
}
