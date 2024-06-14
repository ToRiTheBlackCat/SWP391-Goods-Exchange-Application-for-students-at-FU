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
//using Repositories.Repositories;
//using AutoMapper;
//using Repositories.ModelsView;
//using Repositories.Entities;
//using Repositories.Repositories;
//using Services.Interface;
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
        //TRI
        public List<CreateReportModel> ConvertReportToModel(List<Report> listIn)
        {
            var listOut = new List<CreateReportModel>();
            foreach (var report in listIn)
            {
                listOut.Add(_mapper.Map<CreateReportModel>(report));
            }

            return listOut;
        }
        //TRI
        public List<ViewReportModel> ConvertReportToModel2(List<Report> listIn)
        {
            var listOut = new List<ViewReportModel>();
            foreach (var report in listIn)
            {
                listOut.Add(_mapper.Map<ViewReportModel>(report));
            }

            return listOut;
        }
        //TRI
        public async Task<List<ViewReportModel>> ModGetReportWaitingList()
        {
            return ConvertReportToModel2(_repo.ViewReportByStatus(1).ToList());

        }
        //TRI
        public async Task<(bool, string)> StudentAddNewReport(CreateReportModel createReportModel)
        {
            var newReport = _mapper.Map<Report>(createReportModel);
            newReport.Status = 1;  //set to 1 for waiting list  
            await _repo.AddReportAsync(newReport);
            return (true, "Report created successfully.");
        }
        //TRI
        public async Task<(bool, string)> ModMarkDoneReport(int reportId)
        {
            var success = await _repo.UpdateReportStatusAsync(reportId, 0);
            if (success)
            {
                return (true, "Report resolved");
            }
            return (false, "Report not found in the list.");
        }
    }
}
