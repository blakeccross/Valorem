"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Datepicker } from "flowbite-react";
import { usePlacesWidget } from "react-google-autocomplete";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm, SubmitHandler } from "react-hook-form";
type Inputs = {
  email: string;
};

export default function AddUserModal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  // const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<any>({ lat: "", long: "" });
  // const [trade, setTrade] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const { user, organizations } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  async function handleCreateOrder(data: Inputs) {
    let response = await fetch("/api/send-invite-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
      }),
    });
    let what = await response.json();
    console.log(what);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add User</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit(handleCreateOrder)}>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add User</h3>
              <div>
                <Label htmlFor="countries">Email</Label>
                <TextInput id="email" type="email" required {...register("email")} />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Send Invitation</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
