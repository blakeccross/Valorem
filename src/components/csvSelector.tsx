// components/CSVSelector.tsx
import React, { useRef, useState } from "react";
import CSVReader from "react-csv-reader";
import { Button, Checkbox, Label, Modal, Table, Select, Dropdown } from "flowbite-react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { numberWithCommas } from "@/utils/commonUtils";

type Props = {
  onChange(data: string[][]): void;
};

const CSVSelector = ({
  showModal,
  setShowModal,
  handleCancel,
  handleConfirm,
  orderId,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  handleCancel: () => void;
  handleConfirm: () => void;
  orderId: number;
}) => {
  const [documentName, setDocumentName] = useState<string>("");
  const [documentData, setDocumentData] = useState<any>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: "greedy",
    transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, ""),
  };
  const selectedOrder = useRef<any>(null);
  const supabase = createClientComponentClient<Database>();

  async function uploadProducts() {
    let formattedData: any = [];
    documentData.forEach((item: any) =>
      formattedData.push({
        description: item.description,
        quantity: item.qty,
        price: Number(item.amount.replace(/\s+/g, "").replace(/[^0-9.-]+/g, "")) || 0,
        type: item.roomname,
        orderId: orderId,
      })
    );

    let { error } = await supabase.from("products").insert(formattedData);

    if (error) {
      alert(error.message);
    } else {
      handleConfirm();
    }
  }

  function DocumentTable() {
    return (
      <Table>
        <Table.Head>
          <Table.HeadCell>Product Name</Table.HeadCell>
          <Table.HeadCell>Quantity</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {documentData.map((item: any, index: number) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
              <Table.Cell className="font-medium text-gray-900 dark:text-white">{item.description}</Table.Cell>
              <Table.Cell>{item.qty}</Table.Cell>
              <Table.Cell>{"$ " + numberWithCommas(Number(item.amount.replace(/\s+/g, "").replace(/[^0-9.-]+/g, "")) || 0)}</Table.Cell>
              <Table.Cell className="">
                <div className="relative cursor-pointer">
                  <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                    <Dropdown.Item
                      onClick={() => {
                        selectedOrder.current = item[0];
                      }}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        selectedOrder.current = item[0];
                      }}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)} outline>
        <AiOutlineCloudUpload size={22} color="rgb(75 85 99)" className="mr-3 text-gray-900 dark:text-white" />
        Upload
      </Button>
      <Modal show={showModal} size="3xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body className=" overflow-scroll">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Upload CSV</h3>
          {documentData.length === 0 ? (
            <div>
              <label className="flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <AiOutlineCloudUpload size={25} color="rgb(75 85 99)" />
                  <span className="font-medium text-gray-600">Drop files to Attach, or browse</span>
                </span>
                <CSVReader
                  cssClass="hidden"
                  onFileLoaded={(data, fileInfo, originalFile) => {
                    let filteredData = data.filter((row) => row.qty !== 0 && row.qty !== null && typeof row.qty !== "string");
                    setDocumentData(filteredData);
                    setDocumentName(fileInfo.name);
                    console.log(filteredData);
                  }}
                  parserOptions={papaparseOptions}
                  //label="Select CSV with secret Death Star statistics"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <DocumentTable />
              <div className="flex justify-end">
                <Button onClick={uploadProducts}>Submit</Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CSVSelector;
