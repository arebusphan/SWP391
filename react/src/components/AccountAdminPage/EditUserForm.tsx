import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { deletebyactive, update } from "../../service/serviceauth"; // Gọi API update từ service
import type { Account } from "./AddUser";


type Props = {
    user: Account;
    onSubmit: (updatedUser: Account) => void;
};

export default function EditUserForm({ user, onSubmit }: Props) {
    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
 

    const handleUpdate = async () => {
        try {
            await update(user.userId!, fullName, email, phoneNumber);
            onSubmit({ ...user, fullName, email, phoneNumber });
        } catch (err) {
            console.error("Update failed", err);
        }
    };
    const handleDeletebyactive = async () => {
        try {
            const res = await deletebyactive(user.userId!);
            console.log("Delete success", res);
            alert("Successful");
        } 
         catch (err) {
            console.error("delete fail",err)
        }
    }
    return (
        <div className="space-y-4">
            <Input value={fullName} onChange={e => setFullName(e.target.value)} />
            <Input value={email} onChange={e => setEmail(e.target.value)} />
            <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            <Button onClick={handleDeletebyactive}>Delete </Button>
            <Button onClick={handleUpdate}>Update</Button>
        </div>
    );
}
