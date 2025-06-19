import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  getStudentHealthProfile,
  createStudentHealthProfile,
  updateStudentHealthProfile,
} from "../../service/serviceauth";

export type StudentHealthProfile = {
  studentId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  allergies?: string;
  chronicDiseases?: string;
  vision?: string;
  hearing?: string;
  otherNotes?: string;
};

export default function ViewHealthProfile({
  student,
  onSubmit,
}: {
  student: StudentHealthProfile;
  onSubmit: (updated: StudentHealthProfile) => void;
}) {
  const [formData, setFormData] = useState({
    allergies: "",
    chronicDiseases: "",
    vision: "",
    hearing: "",
    otherNotes: "",
  });

  const [profileId, setProfileId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchHealthProfile() {
      try {
        const res = await getStudentHealthProfile(student.studentId);
        const profile = res.data;
        setFormData({
          allergies: profile.allergies || "",
          chronicDiseases: profile.chronicDiseases || "",
          vision: profile.vision || "",
          hearing: profile.hearing || "",
          otherNotes: profile.otherNotes || "",
        });
        setProfileId(profile.declarationId); // dùng declarationId từ DB
      } catch (error: any) {
        if (error.response?.status === 400 || error.response?.status === 404) {
          setFormData({
            allergies: "",
            chronicDiseases: "",
            vision: "",
            hearing: "",
            otherNotes: "",
          });
          setProfileId(null);
        } else {
          console.error("Failed to fetch health profile:", error);
        }
      }
    }

    fetchHealthProfile();
  }, [student.studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        studentId: student.studentId,
        ...formData,
      };

      if (profileId === null) {
        await createStudentHealthProfile(payload);
      } else {
        await updateStudentHealthProfile(profileId, payload);
      }

      onSubmit({
        ...student,
        ...formData,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save health profile:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
      {/* Thông tin học sinh */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold">👧 Student Info</h3>
        <div><Label>Name</Label><div className="p-2 bg-gray-100 rounded">{student.fullName}</div></div>
        <div><Label>Date of Birth</Label><div className="p-2 bg-gray-100 rounded">{student.dateOfBirth.split("T")[0]}</div></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Gender</Label><div className="p-2 bg-gray-100 rounded">{student.gender}</div></div>
          <div><Label>Class</Label><div className="p-2 bg-gray-100 rounded">{"N/A"}</div></div>
        </div>
        <div><Label>Guardian</Label><div className="p-2 bg-gray-100 rounded">{student.guardianName}</div></div>
      </div>

      {/* Health Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">🩺 Health Information</h3>
          <div className="space-x-2">
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {["allergies", "chronicDiseases", "vision", "hearing", "otherNotes"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field === "allergies" && "Allergies"}
                {field === "chronicDiseases" && "Chronic Diseases"}
                {field === "vision" && "Vision"}
                {field === "hearing" && "Hearing"}
                {field === "otherNotes" && "Other Notes"}
              </Label>
              {isEditing ? (
                <Input
                  id={field}
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "allergies" ? "e.g. pollen, seafood..." :
                    field === "chronicDiseases" ? "e.g. asthma, diabetes..." :
                    field === "vision" ? "e.g. normal, myopia" :
                    field === "hearing" ? "e.g. normal, impaired" :
                    "Additional notes or observations"
                  }
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">
                  {(formData as any)[field] || "—"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
