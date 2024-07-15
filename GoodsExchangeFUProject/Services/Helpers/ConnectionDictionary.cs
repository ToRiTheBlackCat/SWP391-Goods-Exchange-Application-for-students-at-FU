using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Helpers
{
    public class ConnectionDictionary
    {
        public readonly Dictionary<string, string> _connections =
            new Dictionary<string, string>();

        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }

        public void Add(string userName, string connectionId)
        {
            lock (_connections)
            {
                Remove(userName);
                _connections.Add(userName, connectionId);
            }
        }

        public string GetConnection(string userName)
        {
            string connections;
            if (_connections.TryGetValue(userName, out connections))
            {
                return connections;
            }

            return string.Empty;
        }

        public string GetUser(string connectionId)
        {
            foreach (KeyValuePair<string, string> pair in _connections)
            {
                if (pair.Value.Equals(connectionId))
                    return pair.Key;
            }
            return string.Empty;
        }

        public void Remove(string userName)
        {
            lock (_connections)
            {
                string connections;
                if (!_connections.TryGetValue(userName, out connections))
                {
                    return;
                }

                _connections.Remove(userName);
            }
        }
    }
}
