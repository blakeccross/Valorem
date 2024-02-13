"use client";

import { Timeline, Table, Badge, Dropdown, Select, TextInput, Spinner, Label, Checkbox, Button } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
import Link from "next/link";
import { MergeOrdersbyKey } from "@/utils/commonUtils";
import { BiSolidPackage, BiDotsVerticalRounded } from "react-icons/bi";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { HiCheck, HiClock } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { BiSortDown } from "react-icons/bi";
import { UserContext } from "@/context/userContext";
import { Markets } from "@/utils/defaults";
import { FaHardHat, FaUser } from "react-icons/fa";
import ConfirmationModal from "@/components/confirmation.modal";
import AddUserModal from "./components/add-user-modal";
import UserInfoDrawer from "./components/user-info-drawer";
type User = Database["public"]["Tables"]["profiles"]["Row"] & { user_organizations: User_Organizations[] };
type User_Organizations = Database["public"]["Tables"]["user_organizations"]["Row"];

export default function UserTable({ user }: { user: User }) {
  const supabase = createClientComponentClient<Database>();
  const [users, setUsers] = useState<User[]>();
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState<boolean>(false);
  const [showUserDetailsDrawer, setShowUserDetailsDrawer] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"project_name" | "start_date">("project_name");
  const selectedUser = useRef<User>();
  const organization = user.user_organizations[0];

  useEffect(() => {
    getUsers();
  }, [searchInput]);

  async function getUsers() {
    setTableIsLoading(true);
    let searchUsers = supabase
      .from("profiles")
      .select("*, user_organizations!inner(*)")
      .eq("user_organizations.organization", user.user_organizations[0].organization || 0);
    if (searchInput) searchUsers.textSearch("first_name", searchInput);
    // searchOrders.eq("organization", selectedOrginization);

    await searchUsers.then(({ data: users, error }) => {
      if (error) {
        console.error(error);
      }
      if (users) {
        setUsers(users);
      }
    });
    setTableIsLoading(false);
  }

  async function removeUser() {
    let { data, error } = await supabase
      .from("user_organizations")
      .delete()
      .eq("id", selectedUser.current?.user_organizations.find((value) => value.organization === organization.organization)?.id || "")
      .select();
    if (data) {
      setShowRemoveUserModal(false);
      getUsers();
    }
  }

  function AccountType({ type }: { type: string }) {
    switch (type) {
      case "client":
        return (
          <Badge size="xs" color="blue" className="justify-center w-fit" icon={FaUser}>
            Client
          </Badge>
        );
      case "vendor":
        return (
          <Badge size="xs" color="success" className="justify-center w-fit" icon={HiCheck}>
            Vendor
          </Badge>
        );
      case "admin":
        return (
          <Badge size="xs" color="cyan" className="justify-center w-fit" icon={HiClock}>
            Admin
          </Badge>
        );
      case "supplier":
        return (
          <Badge size="xs" color="purple" className="justify-center w-fit" icon={FaHardHat}>
            Contractor
          </Badge>
        );
      default:
        return (
          <Badge size="xs" color="gray" className="justify-center w-fit">
            {type}
          </Badge>
        );
    }
  }

  return (
    <section className="p-5">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Users</h5>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4 items-end">
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="search" value="Search" />
            </div>
            <TextInput placeholder="Name" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="market" value="Market" />
            </div>
            <Select id="market" required>
              {Markets.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>

          {/* <Dropdown label={<BiSortDown size={17} className=" dark:text-white" />} arrowIcon={false} color="white">
            <Dropdown.Header>
              <strong>Sort By</strong>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setSortBy("project_name")}>Project Name</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy("start_date")}>Starting Date</Dropdown.Item>
          </Dropdown> */}
        </div>
        <AddUserModal />
      </div>
      {tableIsLoading ? (
        <div className=" ml-auto mr-auto mt-72 text-center">
          <Spinner size="xl" />
        </div>
      ) : users && users.length !== 0 ? (
        <Table striped className="w-full">
          <Table.Head>
            <Table.HeadCell>
              <Checkbox />
            </Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Market</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users &&
              users.map((user) => (
                <Fragment key={user.id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user.id}>
                    <Table.Cell>
                      <Checkbox />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {`${user.first_name} ${user.last_name}`}
                    </Table.Cell>
                    <Table.Cell>
                      <AccountType type={user.type} />
                    </Table.Cell>
                    <Table.Cell>{user.markets && user.markets.join(", ")}</Table.Cell>
                    <Table.Cell className="truncate">{user.email}</Table.Cell>
                    <Table.Cell className="">
                      <div className="relative cursor-pointer">
                        <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                          <Dropdown.Item
                            onClick={() => {
                              selectedUser.current = user;
                              setShowUserDetailsDrawer(true);
                            }}
                          >
                            View
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              selectedUser.current = user;
                              setShowRemoveUserModal(true);
                            }}
                          >
                            Remove from team
                          </Dropdown.Item>
                        </Dropdown>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Fragment>
              ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="mx-auto my-24">
          <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white text-center">No Results</h5>
          <p className="mb-2 text-sm text-gray-400 dark:text-white text-center">There are currently no orders.</p>
        </div>
      )}
      <ConfirmationModal
        showModal={showRemoveUserModal}
        setShowModal={setShowRemoveUserModal}
        title="Remove User from Team"
        description="You may invite this user to your team at a later time if you wish to add them back."
        handleCancel={() => setShowRemoveUserModal(false)}
        handleConfirm={removeUser}
      />
      <UserInfoDrawer showDrawer={showUserDetailsDrawer} setShowDrawer={setShowUserDetailsDrawer} user={selectedUser.current} />
    </section>
  );
}
