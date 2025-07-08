import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";
import { sendOtp, verifyOtp } from "../service/serviceauth";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [gmail, setGmail] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    try {
      setLoading(true);
      const res = await sendOtp(phone.trim());

      if (res?.data?.gmail) {
        setGmail(res.data.gmail);
        setShowOtpDialog(true);
      } else {
        alert("Unable to retrieve Gmail from phone number.");
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      alert("Failed to send OTP. Please try again.");
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
    if (otp.length !== 6 || !gmail) return;

    try {
      setLoading(true);
      const res = await verifyOtp(gmail, otp);

      if (res?.data?.token) {
        const token = res.data.token;
        login(token);
        localStorage.setItem("token", token);

        const userInfo = parseJwt(token);
        const role =
          userInfo?.Role ||
          userInfo?.role ||
          userInfo?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        console.log("🧠 Decoded role:", role);
        localStorage.setItem("role", role);

        setShowOtpDialog(false);
        setOtp("");
        setPhone("");
        setGmail("");
      } else {
        alert("Login token not received.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-xl rounded-2xl border border-blue-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Login with Phone Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOtp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength={15}
                  className="rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm py-2"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg text-blue-700 font-bold">
              Enter OTP
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Please enter the 6-digit OTP sent to your Gmail
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              autoFocus
              className="text-center tracking-widest text-lg font-mono border-blue-300 rounded-xl"
            />
            <Button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
