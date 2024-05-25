namespace Repositories.Entities



{
    public class RefreshToken
    {
        public string RefreshTokenID { get; set; }

        public int UserID { get; set; }

        public string Refresh_Token { get; set; }
        public string JwtID { get; set; }
        public bool isUsed { get; set; }
        public bool isRevoked {  get; set; }
        public DateTime isUssedAt
        { get; set; }
        public DateTime ExpiredAt {  get; set; } 

       
    }

}