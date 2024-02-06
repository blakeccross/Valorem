"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../../../types/supabase";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";
import Autocomplete from "@mui/material/Autocomplete";
import { states, Markets } from "@/utils/defaults";
import TextField from "@mui/material/TextField";

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
  const { onHandleNext, setFormData, formData } = useFormState();

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

  const onSubmit = handleSubmit((data) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  });

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
                <div className="flex-1">
                  <Label htmlFor="email">Zip Code</Label>
                  <TextInput id="zip code" type="number" required {...register("zipCode")} />
                </div>
                <div className=" min-w-[150px]">
                  <Label htmlFor="state" value="State" />
                  <Select id="state" required {...register("state")}>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="markets" value="Markets" />
              <Autocomplete
                multiple
                limitTags={2}
                id="multiple-limit-tags"
                options={Markets}
                getOptionLabel={(option) => option}
                // defaultValue={[Markets[13], Markets[12], Markets[11]]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                )}
                // sx={{ width: "500px" }}
              />
            </div>
            <Button className="w-full" type="submit">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
