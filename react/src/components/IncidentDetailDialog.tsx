import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import DetailInputBlock from "./DetailInputBlock";
import type { Class, DetailInput, IncidentInput, Supply } from "../pages/IncidentManagement";

interface Props {
    open: boolean;
    onClose: () => void;
    incident: IncidentInput;
    classes: Class[];
    allSupplies: Supply[];
    onAddDetail: (incidentId: number) => void;
    handleFieldChange: <T extends keyof DetailInput>(
        incidentId: number,
        detailIndex: number,
        field: T,
        value: DetailInput[T]
    ) => void;
    setIncidentList: React.Dispatch<React.SetStateAction<IncidentInput[]>>;
}

const IncidentDetailDialog: React.FC<Props> = ({
    open, onClose, incident, classes, allSupplies, onAddDetail, handleFieldChange, setIncidentList
}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[900px]">
                <DialogHeader>
                    <DialogTitle className="text-blue-500">Incident Details</DialogTitle>
                </DialogHeader>
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => onAddDetail(incident.id)}
                        className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1 text-white hover:text-white" >
                        Add Detail
                    </Button>
                </div>
                {incident.details.map((detail, index) => (
                    <DetailInputBlock
                        key={index}
                        incidentId={incident.id}
                        detail={detail}
                        detailIndex={index}
                        classes={classes}
                        allSupplies={allSupplies}
                        handleFieldChange={handleFieldChange}
                        setIncidentList={setIncidentList}
                        incident={incident}
                    />
                ))}
                <DialogFooter>
                    <Button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1 text-white hover:text-white" >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default IncidentDetailDialog;
