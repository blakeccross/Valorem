"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../types/supabase";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    // router.refresh();
  };

  return (
    <div className="w-full place-self-center lg:col-span-6">
      <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
        <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Request Access</h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-300">Fill out this form to request access to Valorem.</p>
        <div className="mt-4 space-y-6 sm:mt-6">
          <div className="grid gap-6 sm:grid-rows-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput id="email" placeholder="name@company.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Select your country" />
              </div>
              <Select id="countries" required>
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </Select>
            </div>
            <div>
              <Label>Company Name</Label>
              <TextInput id="company" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <Label>Company Address</Label>
              <TextInput id="address" required value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
            </div>
            <div>
              <Label>Phone Number</Label>
              <TextInput id="phone" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <Checkbox id="remember" required />
              </div>
              <div className="ml-3 text-sm">
                <Label htmlFor="remember">Recieve email notifications from Valorem</Label>
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={handleSignUp}>
            Request access
          </Button>
        </div>
      </div>
    </div>
  );
}
