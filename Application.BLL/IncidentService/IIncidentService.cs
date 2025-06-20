﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;

namespace BLL.IncidentService
{
    public interface IIncidentService
    {
        Task<MedicalIncidents> AddAsync(IncidentDTO incident);
    }
}
