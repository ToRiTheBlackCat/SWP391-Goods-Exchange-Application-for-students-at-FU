using AutoMapper;
using Repositories.Entities;
using Repositories.ModelsView;
using Repositories.Repositories;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories.Repositories;
using AutoMapper;
using Repositories.ModelsView;
using Repositories.Entities;
using Repositories.Repositories;
using Services.Interface;
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;

namespace Services.Service
{
    public class ReportService : IReportService
    {
        private readonly ReportRepository _repo;
        private readonly IMapper _mapper;

        public ReportService(ReportRepository reportRepository, IMapper mapper)
        {
            _repo = reportRepository;
            _mapper = mapper;
        }

        public List<ReportModel> ConvertReportToModel(List<Report> listIn)
        {
            var listOut = new List<ReportModel>();
            foreach (var report in listIn)
            {
                listOut.Add(_mapper.Map<ReportModel>(report));
            }

            return listOut;
        }
        public async Task<List<ReportModel>> ModGetReportWaitingList()
        {
            return ConvertReportToModel(_repo.ViewReportByStatus(1).ToList());

        }

        public async Task<(bool, string)> StudentAddNewReport(ReportModel reportModel)
        {
            var newReport = _mapper.Map<Report>(reportModel);
            newReport.Status = 1;  //set to 1 for waiting list  
            await _repo.AddReportAsync(newReport);
            return (true, "Report created successfully.");
        }
    }
}
