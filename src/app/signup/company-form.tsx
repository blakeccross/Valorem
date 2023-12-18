"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../types/supabase";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { useForm } from "react-hook-form";

type CompanyFormValues = {
  companyName: string;
  companyEmail: string;
  address: string;
  city: string;
  zipCode: number;
  state: string;
};

export default function CompanyForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [companyAddress, setCompanyAddress] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      },
    });
    if (error) {
      alert(error.message);
    }
    if (data) {
      setShowConfirmationModal(true);
    }
    router.refresh();
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>();
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit} className="w-full place-self-center lg:col-span-6">
      <div>
        <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Company Info</h1>
          {/* <p className="text-sm font-light text-gray-500 dark:text-gray-300">Fill out this form to request access to Valorem.</p> */}
          <div className="mt-4 space-y-6 sm:mt-6">
            <div className="grid gap-6 sm:grid-rows-2">
              <div className="flex flex-col flex-1">
                <Label htmlFor="company">Company Name</Label>
                <TextInput required {...register("companyName")} />
              </div>
              <div>
                <Label htmlFor="email">Company Email</Label>
                <TextInput placeholder="name@company.com" required type="email" {...register("companyEmail")} />
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Street Address</Label>
                  <TextInput id="first name" required {...register("address")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">City</Label>
                  <TextInput id="last name" required {...register("city")} />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Zip Code</Label>
                  <TextInput id="zip code" type="number" required {...register("zipCode")} />
                </div>
                <div>
                  <Label htmlFor="state" value="State" />
                  <Select id="state" required {...register("state")}>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
