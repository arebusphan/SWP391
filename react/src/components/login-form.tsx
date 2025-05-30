import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendOtp, verifyOtp } from "../service/serviceauth";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [gmail, setGmail] = useState("");
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (otp.length === 6) {
            handleVerifyOtp();
        }

    }, [otp]);

    async function handleSendOtp(e: React.FormEvent) {
        e.preventDefault();
        if (!phone.trim()) {
            alert("Vui lòng nhập số điện thoại");
            return;
        }
        try {
            setLoading(true);
            const res = await sendOtp(phone.trim());

            if (res?.data?.gmail) {
                setGmail(res.data.gmail);
                setShowOtpDialog(true);
            } else {
                alert("Không lấy được gmail từ số điện thoại.");
            }
        } catch (error) {
            console.error("Gửi OTP thất bại:", error);
            alert("Không gửi được mã OTP, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

    function parseJwt(token: string) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    async function handleVerifyOtp() {
        if (otp.length !== 6) return;
        if (!gmail) {
            alert("Không có email để xác thực OTP.");
            return;
        }

        try {
            setLoading(true);
            const res = await verifyOtp(gmail, otp);

            if (res?.data?.token) {
                const token = res.data.token;

                console.log(token);
                login(token);


                const userInfo = parseJwt(token);
                const role = userInfo?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                if (role === "Admin") {
                    navigate("/AdminPage");
                } else if (role === "Parent") {
                    navigate("/ParentPage");
                }
                else if (role === "Manager") {
                    navigate("/ManagerPage")
                }
                else if (role === "MedicalStaff") {
                    navigate("/MedicalStaffPage")
                }
                else {
                    navigate("/");
                }

                setShowOtpDialog(false);
                setOtp("");
                setPhone("");
                setGmail("");
            } else {
                alert("Không nhận được token đăng nhập.");
            }
        } catch (error) {
            console.error("Xác minh OTP thất bại:", error);
            alert("Mã OTP không đúng hoặc đã hết hạn.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Đăng nhập bằng số điện thoại</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSendOtp}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    maxLength={15}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Đang gửi..." : "Gửi mã OTP"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nhập mã OTP</DialogTitle>
                        <DialogDescription>Vui lòng nhập mã OTP gồm 6 số</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <Input
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otp}