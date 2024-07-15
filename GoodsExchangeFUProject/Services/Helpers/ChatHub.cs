using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.SignalR;
using Services.Helpers;

namespace SignalRChat.Hubs
{
    public interface IChatClient
    {
        Task<string> ApproveConnect(string connectionId);
        Task<string> ReceiveMessage(string user, string message);
        Task ReceiveNotification(string userName, int productId, string productName);
    }
    public class ChatHub : Hub<IChatClient>
    {
        private readonly static ConnectionDictionary _connections =
           new ConnectionDictionary();

        public async Task SendMessage(string user, string message)
        {
            //await Clients.All.SendAsync("ReceiveMessage", user, $"{message}. from: {Context.ConnectionId}");
            await Clients.All.ReceiveMessage(user, $"{message}. from: {Context.ConnectionId}");
        }

        public async Task SendMessagePrivate(string user, string message, string toId)
        {
            try
            {
                var fromUser = _connections.GetUser(Context.ConnectionId);
                if (string.IsNullOrEmpty(fromUser))
                    throw new Exception("You don't have a connection. Message not sent.");

                //var connectResult = await Clients.Client(toId).InvokeAsync<string>("ApproveConnect", Context.ConnectionAborted);
                // var connectResult = await Clients.Client(toId).ApproveConnect(Context.ConnectionId);


                //if (!connectResult.Contains("Yesed")) //Check if the client is still on
                //{
                //    throw new Exception($"No connection to {toId}. Message not sent.");
                //}

                var toUser = _connections.GetUser(toId);


                //await Clients.Client(toId).SendAsync("ReceiveMessage", user, $"{message} [to {toUser}]. from: {fromUser}");
                string result;
                try
                {
                    result = await Clients.Client(toId).ReceiveMessage(user, $"{message}. [to {toUser}]");
                }
                catch (Exception ex)
                {
                    result = "";
                }

                if (string.IsNullOrEmpty(result)) throw new Exception($"Connect to {toUser} lost");
                //await Clients.Caller.SendAsync("ReceiveMessage", user, $"{message}. from: {Context.ConnectionId}");
                await Clients.Caller.ReceiveMessage("Me", $"{message}.");
            }
            catch (Exception e)
            {
                //await Clients.Caller.SendAsync("ReceiveMessage", "System", $"Failed to connect to {toId}");
                await Clients.Caller.ReceiveMessage("System", "Failed to connect to this user");
                //await Clients.Caller.SendAsync("ReceiveMessage", "System", $"{e.Message}");
                await Clients.Caller.ReceiveMessage("System", $"Exception: {e.Message}");
            }
        }

        public async Task OnConnected(string userName)
        {
            if (string.IsNullOrEmpty(userName))
            {
                await Clients.Caller.ReceiveMessage("System", $"Please input UserName.");
                return;
            }

            _connections.Add(userName.ToLower(), Context.ConnectionId);
          
            foreach (var x in _connections._connections)
            {
                Clients.Client(x.Value).ReceiveMessage("System", $"{userName} connected. from: {Context.ConnectionId}");
            }
        }

        public async Task<string> GetConnection(string userName, string stringProductId, string productName)
        {

            try
            {
                int productId = int.Parse(stringProductId);
            
                string toId = _connections.GetConnection(userName.ToLower());

                var fromUser = _connections.GetUser(Context.ConnectionId);
                if (string.IsNullOrEmpty(fromUser))
                    throw new Exception("You don't have a connection. Please login.");

                if (string.IsNullOrEmpty(toId)) //check if there is client
                {
                    throw new Exception($"{userName} is in other chat or not online. Please try again later");
                }
                if (toId.Equals(Context.ConnectionId))
                {
                    await Clients.Caller.ReceiveMessage("System", $"Cant connect to your self!");
                    return null;
                }

                //var message = await Clients.Client(toId).InvokeAsync<string>("ApproveConnect", Context.ConnectionId, Context.ConnectionAborted);
                //if (!message.Contains("Yesed")) //Check if the client is still on
                //    throw new Exception($"Failed to connect to {userName}");
                //string message = await Clients.Client(toId).InvokeAsync<string>("ApproveConnect", (string)Context.ConnectionId, CancellationToken.None);
                string message;
                try
                {
                    message = await Clients.Client(toId).ApproveConnect(Context.ConnectionId);
                }
                catch (Exception ex)
                {
                    message = "";
                }

                if (!message.Contains("Yesed")) //Check if the client is still on
                {

                     Clients.Client(toId).ReceiveNotification(fromUser, productId, productName);
                    throw new Exception($"Failed to connect to {userName}. Request for chat sent, you can wait for {fromUser} to respond or exit chat session.");
                }

                //string testMess = await Clients.Caller.ApproveConnect(Context.ConnectionId);
                 Clients.Caller.ReceiveMessage("System", $"Connected to {userName}");
                 Clients.Client(toId).ReceiveMessage("System", $"Connected with {fromUser}");

                return toId;
            }
            catch (Exception ex)
            {

                Clients.Caller.ReceiveMessage("System", $"Exception! {ex.Message}");
                return null;
            }
        }

        public async Task<string> GetCurrentConnect()
        {
            return Context.ConnectionId;
        }

    }
}
