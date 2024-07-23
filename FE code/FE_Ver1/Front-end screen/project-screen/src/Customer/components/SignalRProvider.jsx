import { useEffect, useState, useCallback, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import * as signalR from '@microsoft/signalr';

const SignalRProvider = () => {
  const connectionRef = useRef(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser'))?.userName || '');
  const notificationsRef = useRef([]);
  const [, setUpdate] = useState(0); // Để buộc cập nhật lại khi thông báo thay đổi

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://goodsexchangefu-api.azurewebsites.net/chat")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = newConnection;
  }, []);

  const signUpConnection = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.invoke("OnConnected", user);
      } catch (err) {
        console.error("Exception: " + err.toString());
      }
    }
  }, [user]);

  const checkConnection = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.invoke("GetCurrentConnect")
        .then((result) => {
          console.log("Current Connection ID:", result);
        })
        .catch((err) => {
          console.error("Exception: " + err.toString());
        });
    }
  }, []);

  useEffect(() => {
    if (connectionRef.current) {
      connectionRef.current.start()
        .then(() => {
          console.log('Connected!');
          signUpConnection();
          checkConnection();

          connectionRef.current.on('ReceiveNotification', (user, productID, productName) => {
            const notification = { user, productID, productName };
            notificationsRef.current = [...notificationsRef.current, notification];
            setUpdate(prev => prev + 1); // Buộc cập nhật lại
          });
          
        })
        .catch(e => console.log('Connection failed: ', e));
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [signUpConnection, checkConnection]);

  return notificationsRef.current;
};

export default SignalRProvider;
