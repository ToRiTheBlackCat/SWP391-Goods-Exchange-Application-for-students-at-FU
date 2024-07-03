import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import userIcon from '../../assets/user.jpg';
import ChatWindowReceiver, { ChatWindowSender } from './ChatWindow';
import MessageInput from './MessageInput';

export default function ChatContainer(){
    let socketio = socketIOClient("http://localhost:4000"); // Kết nối tới cổng 4000
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(localStorage.getItem("userName"));
    const [avatar, setAvatar] = useState(userIcon);

    useEffect(() => {
        socketio.on('chat', senderChats => {
            console.log('Received chat:', senderChats); // Log tin nhắn nhận được để kiểm tra
            setChats(prevChats => [...prevChats, senderChats]); // Cập nhật tin nhắn mới vào danh sách
        });

        // Cleanup khi component bị unmount
        return () => {
            socketio.off('chat');
        };
    }, [socketio]);

    function sendChatToSocket(chat){
        console.log('Sending chat to server:', chat); // Log tin nhắn gửi đi để kiểm tra
        socketio.emit("chat", chat);
    }

    function addMessage(chat){
        const newChat = {...chat, user, avatar};
        console.log('Adding new chat:', newChat); // Log tin nhắn mới để kiểm tra
        setChats(prevChats => [...prevChats, newChat]);
        sendChatToSocket(newChat);
    }

    function ChatList(){
        return chats.map((chat, index) => {
            if(chat.user === user) return <ChatWindowSender key={index} message={chat.message} avatar={chat.avatar} user={chat.user}/>;
            return <ChatWindowReceiver key={index} message={chat.message} avatar={chat.avatar} user={chat.user}/>;
        });
    }

    return(
        <div>
            <div style={{display: 'flex', flexDirection:"row", justifyContent:'space-between'}}>
            <h4>Username: {user}</h4>
            </div>
            <ChatList/>
            <MessageInput addMessage={addMessage}/>
        </div>
    );
}
