using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GoodsExchangeFUProject.ModelsView.UserViewModel;
using Services;
using Repositories.Entities;
using Services.Service;
using Repositories;
using Microsoft.Win32;
using Microsoft.AspNetCore.Authorization;

namespace GoodsExchangeFUProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly GoodsExchangeFudbContext _context;

        public UserController(GoodsExchangeFudbContext context)
        {
            _context = context;
        }

        // GET: api/Users1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users1/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users1/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users1
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Create-Customer-Account")]
        public async Task<ActionResult<string>> PostUser(UserRegisterView registerView)
        {
            UserService service = new UserService();
            (bool, string) result = await service.RegisterUserUI(registerView);
            if (result.Item1)
                return Ok(result.Item2);
            //return CreatedAtAction("GetUser", new { id = 20 }, registerView);
            return Ok(result.Item2);
        }

        [HttpPost("Create-Modderator-Account")]
        public async Task<ActionResult<string>> PostModderator(UserRegisterView registerView)
        {
            UserService service = new UserService();
            (bool, string) result = await service.RegisterUserUI(registerView);
            if (result.Item1)
                return Ok(result.Item2);
            //return CreatedAtAction("GetUser", new { id = 20 }, registerView);
            return Ok(result.Item2);
        }

        // DELETE: api/Users1/5
        [HttpDelete("{id}")]
        [Authorize("admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
