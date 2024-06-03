using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using Repositories.Entities;
using Repositories.ModelsView;
using Repositories.Repositories;
using Services.Service;

namespace GoodsExchangeFUProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExchangesController : ControllerBase
    {
        private readonly GoodsExchangeFudbContext _context;
        private readonly ExchangeService _serivice = new();

        public ExchangesController(GoodsExchangeFudbContext context)
        {
            _context = context;
        }

        // GET: api/Exchanges/EchangeRequests
        [HttpGet("EchangeRequests")]
        public IActionResult GetExchangeRequests(int userID)
        {
            var list = _serivice.GetExchangeOfUserUI(userID);
            return Ok(list);
        }

        // GET: api/Exchanges/ProductExchanges/5
        [HttpGet("ProductExchanges/{productId}")]
        public async Task<IActionResult> GetProductExchanges(int productId)
        {
            var list = await _serivice.GetProductExchangesUI(productId);
            if (list.Item2 == null)
                return NotFound("The product you are finding doesn't exist!");
            return Ok(list.Item1);
        }

        // PUT: api/ProductExchanges
        [HttpPut("ProductExchanges")]
        public async Task<IActionResult> AcceptExchange(int exchangeId)
        {
            var repo = new ExchangeRepository();
            await _serivice.AcceptExchangeUI(exchangeId);

            //var result = await _serivice.AcceptExchangeUI(exchangeId);


            //_context.Entry(exchange).State = EntityState.Modified;

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!ExchangeExists(id))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            return Ok();
        }

        // GET: api/Exchanges/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Exchange>> GetExchange(int id)
        {
            var exchange = await _context.Exchanges.FindAsync(id);

            if (exchange == null)
            {
                return NotFound();
            }

            return exchange;
        }

        // PUT: api/Exchanges/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExchange(int id, Exchange exchange)
        {
            if (id != exchange.ExchangeId)
            {
                return BadRequest();
            }

            _context.Entry(exchange).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExchangeExists(id))
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

        // POST: api/CreateExchange
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("CreateExchange")]
        public async Task<IActionResult> PostExchange(ExchangeCreateView exchangeCreate)
        {
            //Create Exchange request
            var result =  await _serivice.CreateExchangeUI(exchangeCreate);



            //_context.Exchanges.Add(exchange);
            //await _context.SaveChangesAsync();

            return Ok(result);
        }

        // DELETE: api/Exchanges/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExchange(int id)
        {
            var exchange = await _context.Exchanges.FindAsync(id);
            if (exchange == null)
            {
                return NotFound();
            }

            _context.Exchanges.Remove(exchange);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExchangeExists(int id)
        {
            return _context.Exchanges.Any(e => e.ExchangeId == id);
        }
    }
}
