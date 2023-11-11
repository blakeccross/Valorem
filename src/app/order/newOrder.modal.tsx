"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Datepicker } from "flowbite-react";
import { usePlacesWidget } from "react-google-autocomplete";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from "next/navigation";

export default function NewOrderModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: (value: boolean) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<any>({ lat: "", long: "" });
  const [trade, setTrade] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toDateString());
  const [size, setSize] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const router = useRouter();

  async function handleCreateOrder() {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          project_name: name,
          start_date: startDate,
          address: address,
          location: `POINT(${location.lat} ${location.long})`,
          description: description,
          size: size,
          trade: trade,
        },
      ])
      .select()
      .limit(1)
      .single();
    if (data) {
      router.push(`/order/${encodeURIComponent(data.order_id)}`);
    }
    if (error) {
      alert(error.message);
    }
    setShowModal(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Order</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">New Order</h3>
            <div>
              <Label htmlFor="countries">Trade</Label>
              <Select id="countries" required value={trade} onChange={(e) => setTrade(e.target.value)}>
                <option disabled></option>
                <option>Exterior / Landscaping</option>
                <option>MEP / General</option>
                <option>Living Room</option>
                <option>Family Room / Den</option>
                <option>Dining Room</option>
                <option>Kitchen / Nook</option>
                <option>Master Bedroom</option>
                <option>Applicances</option>
                <option>Bedroom</option>
                <option>Laundry Room</option>
                <option>Garage</option>
                <option>Flooring</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Project Name</Label>
              <TextInput id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter a name" />
            </div>
            <div>
              <Label htmlFor="email">Address</Label>
              {/* <TextInput required value={address} onChange={(e) => setAddress(e.target.value)} ref={inputRef.current} /> */}
              <Autocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                onPlaceSelected={(place) => {
                  setAddress(place.formatted_address);
                  setLocation({ lat: place.geometry.location.lat(), long: place.geometry.location.lng() });
                }}
                options={{
                  types: ["address"],
                  componentRestrictions: { country: "us" },
                }}
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Datepicker onSelectedDateChanged={(e) => setStartDate(e.toDateString())} value={startDate} />
              {/* <TextInput id="name" required value={name} onChange={(e) => setName(e.target.value)} /> */}
            </div>
            <div>
              <Label>Main Sqft</Label>
              <TextInput required type="number" value={size} onChange={(e) => setSize(e.target.valueAsNumber)} />
            </div>
            <div className="max-w-md" id="textarea">
              <Label htmlFor="comment">Description</Label>
              <Textarea
                id="comment"
                placeholder="Please give a detailed description..."
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCreateOrder}>Save</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
