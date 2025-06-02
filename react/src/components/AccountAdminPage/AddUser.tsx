import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { getuser } from "../../service/serviceauth";
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "../ui/dialog";

import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";


export type Account = {
    
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

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await getuser();
                setUsers(response.data);
            } catch (error) {
                console.error("Fail when get user:", error);
            }
        }
        fetchUsers();
    }, []);

    const filteredAccounts = users.filter(account =>
        account.fullName.toLowerCase().includes(search.toLowerCase()) ||
        account.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleUpdate = (updatedUser: Account) => {
        setUsers(prevUsers =>
            prevUsers.map(user => (user.fullName === updatedUser.fullName ? updatedUser : user))
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

                <Dialog>
                    <DialogTrigger>
                        <Button className="flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Account
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogDescription>Add a new account</DialogDescription>
                        <AddUserForm onSubmit={(newUser) => setUsers([...users, newUser])} />
                    </DialogContent>
                </Dialog>
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

            <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
                <DialogContent>
                    <DialogDescription>Edit user information</DialogDescription>
                    {selectedAccount && (
                        <EditUserForm user={selectedAccount} onSubmit={handleUpdate} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
