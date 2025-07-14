import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getuser } from "../../service/serviceauth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import AddFileForm from "./AddFileForm";
import { Pagination } from "@/components/ui/Pagination";

export type Account = {
  userId?: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  isActive: boolean;
};

export default function AccountManager() {
  const [users, setUsers] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedDialog, setExpandedDialog] = useState(false); // chỉ dùng cho Add User
  const itemsPerPage = 10;

  const refreshUsers = async () => {
    try {
      const response = await getuser();
      setUsers([...response.data].reverse());
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const filteredAccounts = users.filter((account) =>
    account.fullName.toLowerCase().includes(search.toLowerCase()) ||
    account.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdate = (updatedUser: Account) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userId === updatedUser.userId ? updatedUser : user
      )
    );
    setSelectedAccount(null);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Account Management</h1>

      {/* Search + Add Account Dropdown */}
      <div className="flex justify-between items-center mb-6 relative">
        <Input
          placeholder="Search Account"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/2"
        />

        <div className="relative">
          <Button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setOpenAddUserDialog(true);
                    setDropdownOpen(false);
                  }}
                >
                  Add User
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setOpenAddFileDialog(true);
                    setDropdownOpen(false);
                  }}
                >
                  Add File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAccounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-5 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedAccounts.map((account) => (
                <tr
                  key={account.email}
                  className="border-t hover:bg-blue-50 transition-colors"
                >
                  <td className="p-3">{account.fullName}</td>
                  <td className="p-3">{account.email}</td>
                  <td className="p-3">{account.phoneNumber}</td>
                  <td className="p-3">{account.role}</td>
                  <td className="p-3">
                    {account.isActive ? (
                      <span className="text-green-600 font-semibold">✔</span>
                    ) : (
                      <span className="text-red-500 font-semibold">✖</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" onClick={() => setSelectedAccount(account)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add User Dialog (can expand) */}
      <Dialog
        open={openAddUserDialog}
        onOpenChange={(val) => {
          setOpenAddUserDialog(val);
          if (!val) setExpandedDialog(false);
        }}
      >
        <DialogContent className={expandedDialog ? "!max-w-[1000px]" : "!max-w-[600px]"}>
          <DialogTitle>Add a new account</DialogTitle>
          <DialogDescription>Fill in the user information.</DialogDescription>
          <AddUserForm
            onSubmit={(newUser) => {
              setUsers((prev) => [newUser, ...prev]);
              setOpenAddUserDialog(false);
              setExpandedDialog(false);
            }}
            onExpandDialog={(expand) => setExpandedDialog(expand)}
          />
        </DialogContent>
      </Dialog>

      {/* Add File Dialog */}
      <Dialog open={openAddFileDialog} onOpenChange={setOpenAddFileDialog}>
        <DialogContent>
          <DialogTitle>Import users from file</DialogTitle>
          <DialogDescription>Upload file to add multiple users.</DialogDescription>
          <AddFileForm
            onSuccess={async () => {
              await refreshUsers();
              setOpenAddFileDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog (fixed size) */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="!max-w-[600px]">
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Modify user details below.</DialogDescription>
          {selectedAccount && (
            <EditUserForm user={selectedAccount} onSubmit={handleUpdate} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
