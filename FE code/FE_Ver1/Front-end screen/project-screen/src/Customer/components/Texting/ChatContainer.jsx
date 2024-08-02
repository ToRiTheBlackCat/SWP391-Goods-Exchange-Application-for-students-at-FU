import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import userIcon from '../../assets/user.jpg';
import ChatWindowReceiver, { ChatWindowSender } from './ChatWindow';
import MessageInput from './MessageInput';
import axiosInstance from '../../../utils/axiosInstance';

export default function ChatContainer() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userID = queryParams.get('user');
    const productID = queryParams.get('productID');
    const productName = queryParams.get('productName');

    const [product, setProduct] = useState(null);   //quản lý trạng thái sản phẩm
    const [chats, setChats] = useState([]);   //quản lý tin nhắn
    const [currentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
    const user = currentUser.userName;
    const [avatar] = useState(userIcon);  //avatar mặc định của người dùng
    const [connection, setConnection] = useState(null); //quản lý kết nối SignalR
    const [toAddress, setToAddress] = useState("");   //quản lý địa chỉ của người dùng khác
    const navigate = useNavigate();
    const inSessionRef = useRef(false);   //quản lý trạng thái phiên chat 
    const connectionInitialized = useRef(false);  //quản lý trạng thái khởi tạo kết nối 

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/api/Product/Student/ViewProductDetailWithId/${productID}`);
                setProduct(response.data);
                console.log(response.data);

                // Once the product data is fetched, initialize the SignalR connection
                initializeConnection();
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productID]);

    const initializeConnection = useCallback(() => {    //hàm tạo kết nối SignalR
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://goodsexchangefu-api.azurewebsites.net/chat")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, []);

    const signUpConnection = useCallback(async () => {    //hàm đăng kí kết nối với SignalR
        if (connection) {
            try {
                await connection.invoke("OnConnected", user);
            } catch (err) {
                console.error("Exception: " + err.toString());
            }
        }
    }, [connection, user]);

    const connectWithUser = useCallback(async () => {      //hàm kiểm tra và kết nối với người dùng khác
        if (inSessionRef.current) return; // Check if already in session to avoid duplicate calls

        try {
            const result = await connection.invoke("GetConnection", userID, productID, productName);
            if (result != null) {
                setToAddress(result);
                inSessionRef.current = true; // Set session status
                console.log("Get connection successfully", { inSession: true });
            } else {
                console.log("Get connection failed");
                sendNotificationToUser();
            }
        } catch (err) {
            console.error(err.toString());
        }
    }, [connection, userID, productID, productName]);

    const checkConnection = useCallback(() => {    //hàm kiểm tra kết nối hiện tại
        if (connection) {
            connection.invoke("GetCurrentConnect")
                .then((result) => {
                    console.log("Current Connection ID:", result);
                })
                .catch((err) => {
                    console.error("Exception: " + err.toString());
                });
        }
    }, [connection]);

    useEffect(() => {
        if (connection && !connectionInitialized.current) {
            connection.start() //bắt đâu kết nối SignalR
                .then(() => {
                    console.log('Connected!');
                    connectionInitialized.current = true;
                    connection.on('ReceiveMessage', (user, message) => { //nhận tin nhắn từ server
                        checkConnection();
                        setChats(prevChats => [...prevChats, { user, message }]);
                        console.log("session value: ", inSessionRef.current);
                        return "Sent";
                    });
                    connection.on("ApproveConnect", (connectionId) => {  //xác nhận kết nối từ server
                        checkConnection();

                        if (connectionId && !inSessionRef.current) {
                            setToAddress(connectionId);
                            inSessionRef.current = true;
                            console.log("Approve connect", connectionId, { inSession: true });
                            return "Yesed";
                        } else {
                            return "No";
                        }
                    });

                    signUpConnection();
                    checkConnection();
                    connectWithUser();
                })
                .catch(e => {
                    console.log('Connection failed: ', e);
                    throw new Error('Connection failed, stopping further execution.');
                });
        }
    }, [signUpConnection, connectWithUser, checkConnection, connection]);

    const sendChatToServer = (chat) => {   //hàm gửi tin nhắn đến server qua SignalR
        if (connection) {
            connection.invoke('SendMessagePrivate', chat.user, chat.message, toAddress)
                .catch(err => console.error('Error while sending message: ', err));
        }
    };

    const addMessage = (chat) => {
        const newChat = { ...chat, user, avatar };
        sendChatToServer(newChat);
        sendNotificationToUser();
    };

    const sendNotificationToUser = useCallback(async () => {
        const notificationData = {
            userId: product?.userId,  // Use userId from fetched product data
            productId: productID,
            requesterId: currentUser.userId  // Use userID from queryParams
        };
        console.log("userId", product?.userId);
        console.log("requesterId", currentUser.userId);

        try {
            await axiosInstance.post('/api/User/SendNotificationToUser', notificationData);
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    });

    const ChatList = () => {
        return chats.map((chat, index) => {
            if (chat.user === "Me") return <ChatWindowSender key={index} message={chat.message} avatar={avatar} user={chat.user} />;
            return <ChatWindowReceiver key={index} message={chat.message} avatar={avatar} user={chat.user} />;
        });
    };

    const handleBack = () => {
        if (connection) {
            connection.stop().then(() => {
                navigate("/");
            });
        } else {
            navigate("/");
        }
    };

    return (
        <div style={{ marginBottom: '100px' }}>
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                <h4>Username: {user}</h4>
                {userID && <h4>Chatting with: {userID}</h4>}
            </div>
            {product && (
                <div>
                    <h5>Product name: {product.productName}</h5>
                    <h5>Product description: {product.productDescription}</h5>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={handleBack} style={{ backgroundColor: 'black' }}>Back</button>
            </div>
            <ChatList />
            <MessageInput addMessage={addMessage} />
        </div>
    );
}
