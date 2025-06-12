import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function BlankClickableBox() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="p-5">
      {/* Vùng trống có thể click để mở dialog */}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogTitle>Empty Dialog</DialogTitle>
          <DialogDescription>You can put your content here.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
