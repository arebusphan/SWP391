using DAL.Models;
using System.Collections.Generic;

namespace DAL.Repositories
{
    public interface IMedicationRepository
    {
        void Add(MedicationRequests request);
        List<MedicationRequests> GetRequestsByParent(int parentId);
    }
}
