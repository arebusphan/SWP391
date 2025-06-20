﻿import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getuser } from "../../service/serviceauth";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import { DialogTitle } from "@radix-ui/react-dialog";
import AddFileForm from "./AddFileForm";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedDialog, setExpandedDialog] = useState(false);

  const refreshUsers = async () => {
    try {
      const response = await getuser();
      setUsers(response.data);
    } catch (error) {
      console.error("Fail when get user:", error);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const filteredAccounts = users.filter(account =>
    account.fullName.toLowerCase().includes(search.toLowerCase()) ||
    account.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = (updatedUser: Account) => {
    setUsers(prevUsers =>
      prevUsers.map(user => (user.userId === updatedUser.userId ? updatedUser : user))
    );
    setSelectedAccount(null);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-10">
        <Input
          placeholder="Search Account"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-1/2"
        />

        <div className="relative inline-block text-left">
          <button
            className="flex items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setOpenAddUserDialog(true);
                    setDropdownOpen(false);
                  }}
                >
                  Add User
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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

          {/* Dialog Add User */}
          <Dialog
            open={openAddUserDialog}
            onOpenChange={(val) => {
              setOpenAddUserDialog(val);
              if (!val) setExpandedDialog(false);
            }}
          >
            <DialogContent className={`!w-full ${expandedDialog ? "!max-w-[1000px]" : "!max-w-[600px]"}`}>
              <DialogTitle>Add a new account</DialogTitle>
              <DialogDescription>Add a new account</DialogDescription>
              <AddUserForm
                onSubmit={(newUser) => {
                  setUsers([...users, newUser]);
                  setOpenAddUserDialog(false);
                  setExpandedDialog(false);
                }}
                onExpandDialog={(expand) => setExpandedDialog(expand)}
              />
            </DialogContent>
          </Dialog>

          {/* Dialog Add File */}
          <Dialog open={openAddFileDialog} onOpenChange={setOpenAddFileDialog}>
            <DialogContent className="!w-full !max-w-[1000px]">
              <DialogTitle>Add multiple accounts from file</DialogTitle>
              <DialogDescription>Upload file to add multiple users</DialogDescription>
              <AddFileForm
                onSuccess={async () => {
                  await refreshUsers();
                  setOpenAddFileDialog(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-5">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredAccounts.map(account => (
                <tr key={account.email} className="border-t hover:bg-gray-50">
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
                    <Button
                      className="flex items-center"
                      onClick={() => setSelectedAccount(account)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog Edit */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="!w-full !max-w-[1000px]">
          <DialogTitle></DialogTitle>
          <DialogDescription>Edit user information</DialogDescription>
          {selectedAccount && (
            <EditUserForm user={selectedAccount} onSubmit={handleUpdate} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}