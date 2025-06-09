import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import SendMedicineForm from "./SendMedicineForm"; // giả sử bạn đã có file này

export default function AccountManager() {
    const [openSendMedicineDialog, setOpenSendMedicineDialog] = useState(false);

    return (
        <div className="p-5">
            <div className="flex justify-end mb-10">
                <Button
                    className="flex items-center"
                    onClick={() => setOpenSendMedicineDialog(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Send Medicine
                </Button>
            </div>

            <Dialog open={openSendMedicineDialog} onOpenChange={setOpenSendMedicineDialog}>
                <DialogContent>
                    <DialogTitle>Send Medicine</DialogTitle>
                    <DialogDescription>Send medicine to user</DialogDescription>
                    <SendMedicineForm
                        onSuccess={() => setOpenSendMedicineDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
