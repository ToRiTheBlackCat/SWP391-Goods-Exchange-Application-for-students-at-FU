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

    // const [sellerInfo, setSellerInfo] = useState(location.state?.sellerInfo); // Lấy sellerInfo từ state
    const [product, setProduct] = useState(null);
    const [chats, setChats] = useState([]);

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
    const user= currentUser.userName;
    const [avatar] = useState(userIcon);
    const [connection, setConnection] = useState(null);
    const [toAddress, setToAddress] = useState("");
    const navigate = useNavigate();
    var inSession = false;
    const connectionInitialized = useRef(false);

    // Tạo kết nối SignalR chỉ một lần
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
        // if (userID) {
        //     setSellerInfo(userID);
        // }
        try {
            const result = await connection.invoke("GetConnection", userID, productID, productName);
            console.log("value", userID);
            console.log("value", productID);
            console.log("value", productName);
            console.log("Get connection: ",result);
            if (result != null) {
                setToAddress(result);
                inSession = true;  // Đặt trạng thái inSession ở đây
                console.log("Get connection successfully", { inSession: true });
            } else {
                console.log("Get connection failed");
            }
        } catch (err) {
            console.error(err.toString());
        }
    }, [userID, connection, productID, productName]);

    const checkConnection = useCallback(() => {
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
            connection.start()
                .then(() => {
                    console.log('Connected!');
                    connectionInitialized.current = true;
                    connection.on('ReceiveMessage', (user, message) => {
                        checkConnection();
                        setChats(prevChats => [...prevChats, { user, message }]);
                        console.log("session value: ", inSession);
                        return "Sent";
                    });
                    connection.on("ApproveConnect", (connectionId) => {
                        checkConnection();
                        
                        if (connectionId && inSession==false) {
                            setToAddress(connectionId);
                            inSession = true;
                            console.log("Approve connect", connectionId, { inSession: inSession });
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

        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/api/Product/Student/ViewProductDetailWithId/${productID}`);
                setProduct(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();

        // return () => {
        //     if (connection) {
        //         connection.stop();
        //     }
        // };
    }, [connection, signUpConnection, connectWithUser, checkConnection, productID, inSession]);

    const sendChatToServer = (chat) => {
        if (connection) {
            connection.invoke('SendMessagePrivate', chat.user, chat.message, toAddress)
                .catch(err => console.error('Error while sending message: ', err));
        }
    };

    const addMessage = (chat) => {
        const newChat = { ...chat, user, avatar };
        sendChatToServer(newChat);
    };

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