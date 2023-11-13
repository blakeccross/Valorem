"use client";
import { FC, useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop, { withDragAndDropProps } from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { Card, Button, Table } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import { calcCrow } from "@/utils/commonUtils";
type Event = Database["public"]["Tables"]["events"]["Row"];
type EventWithOrderId = {
  order_id: {
    address: string;
  };
} & Event;
import ConfirmationModal from "./confirmation.modal";
import { useRouter } from "next/navigation";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SetAvailabiltyModal from "./setAvailability.modal";

export default function Calenda() {
  const supabase = createClientComponentClient<Database>();
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [location, setLocation] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const selectedEvent = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      alert("Geolocation is not available in your browser.");
    }
  }, []);

  async function getEvents() {
    let { data: events, error } = await supabase.from("events").select("*, order_id(address, location)");
    if (events) {
      setEvents(events);
      console.log(events);
    }
  }

  async function handleConfirmModal(event: Event) {
    setShowConfirmModal(true);
    selectedEvent.current = event;
  }

  return (
    <>
      <section className="p-5">
        <h2 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Upcoming events</h2>
        <div className="flex justify-end mb-5">
          <SetAvailabiltyModal showModal={showModal} setShowModal={setShowModal} />
        </div>
        <div className="flex flex-col gap-4">
          {events.map((item) => (
            <div key={item.id}>
              <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{moment(item.date_time).format("MMMM")}</h5>
              <Card>
                <div className="flex flex-row gap-8 items-center" key={item.id}>
                  <div className="flex-col items-center pr-5 border-r-gray-500 border-r-2">
                    <h5 className="mb-2 text-xl font-bold text-center text-gray-900 dark:text-white">{moment(item.date_time).format("ddd")}</h5>
                    <h5 className="mb-2 text-3xl font-bold text-center text-gray-900 dark:text-white">{moment(item.date_time).format("DD")}</h5>
                  </div>

                  <div className="flex flex-1 flex-col text-left justify-center items-start text-gray-900 dark:text-white">
                    <p>{item.type}</p>
                    <b>{moment(item.date_time).format("h:mm a")}</b>
                    <p>Address: {item.order_id?.address}</p>
                  </div>
                  <Button onClick={() => handleConfirmModal(item)}>Confirm</Button>
                </div>
              </Card>
            </div>
          ))}
          <ConfirmationModal showModal={showConfirmModal} setShowModal={setShowConfirmModal} event={selectedEvent.current} location={location} />
        </div>
      </section>
    </>
  );
}
