"use client";

import { Button, Spinner } from "flowbite-react";
import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
import NewProductModal from "./components/newProduct.modal";
import ApproveCOModal from "./components/approve.modal";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { MdClose, MdDashboard, MdCheck } from "react-icons/md";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { BiHistory } from "react-icons/bi";
import ConfirmationModal from "@/components/confirmation.modal";
import OrderTimeLine from "./components/timeLine";
import ChangeOrder from "./components/changeOrder";
import ActiveOrder from "./components/activeOrder";
import Warranties from "./components/warranties";
import Settings from "./components/settings";
import History from "./components/history";
type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [Product];
interface COProduct extends Product {
  status: string;
}
import { HiCheck } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import CSVSelector from "@/components/csvSelector";

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [products, setProducts] = useState<Product[]>([]);
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState<boolean>(false);
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const previousProducts = useRef<any[]>([]);
  const coProducts = useRef<any[]>([]);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const selectedTab = searchParams.get("view") || "details";
  const { user, SignOut } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    getProducts();
    getOrders();
  }, []);

  async function getOrders() {
    let { data: order, error } = await supabase.from("orders").select("*").eq("id", params.id).single();
    if (order) {
      setOrder(order);
      if (order.change_order) {
        getPreviousOrder();
      }
    }
  }

  async function getProducts() {
    setProductsLoading(true);
    let { data: products, error } = await supabase.from("products").select("*").eq("orderId", params.id);
    if (products) {
      setProducts(products);
      coProducts.current = products;
      setProductsLoading(false);
    }
  }

  async function getPreviousOrder() {
    let { data: order, error } = await supabase
      .from("orders")
      .select("id")
      .eq("order_id", orderId)
      .neq("id", params.id)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (order) {
      getPreviousProducts(order.id);
    }
    if (error) alert(error.message);
  }

  async function getPreviousProducts(id: number) {
    let { data: products, error } = await supabase.from("products").select("*").eq("orderId", id);
    if (products) {
      previousProducts.current = products;
      getChangeOrder();
    }
  }

  function handleTabChange(selectedTab: string) {
    router.push(`/order/${params.id}?orderId=${order?.order_id}&view=${selectedTab}`);
  }

  function getChangeOrder() {
    let resultArray: COProduct[] = [];
    let ProductArray1 = coProducts.current;
    let ProductArray2 = previousProducts.current;

    ProductArray1.forEach((obj1) => {
      const noChange = ProductArray2.find((obj2) => obj2.description === obj1.description && obj2.price === obj1.price);
      const updatedPrice = ProductArray2.find((obj2) => obj2.description === obj1.description && obj2.price !== obj1.price);
      if (noChange) {
        resultArray.push({ ...noChange, status: "same" });
      } else if (updatedPrice) {
        resultArray.push({ ...updatedPrice, status: "updated" });
      } else {
        resultArray.push({ ...obj1, status: "new" });
      }
    });

    ProductArray2.forEach((obj2) => {
      const foundInResult = resultArray.find((obj) => obj.description === obj2.description);
      if (!foundInResult) {
        resultArray.push({ ...obj2, status: "removed" });
      }
    });

    setProducts(resultArray);

    // setProducts(MergeProductsbyKey(resultArray, "type"));
  }

  async function createChangeOrder() {
    let formattedProducts = products.map((item) => ({
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      type: item.type,
    }));
    let allProducts = [...formattedProducts, ...addedProducts];

    let totalCost = allProducts.reduce(function (acc, val) {
      return acc + val.price;
    }, 0);

    if (order?.id !== order?.order_id || products.length > 0) {
      const { data: orderSuccess, error } = await supabase
        .from("orders")
        .insert([
          {
            project_name: order?.project_name,
            start_date: null,
            address: order?.address,
            location: order?.location,
            description: order?.description,
            size: order?.size,
            trade: order?.trade,
            order_id: order?.order_id,
            change_order: true,
            cost: totalCost,
          },
        ])
        .select()
        .limit(1)
        .single();
      if (orderSuccess) {
        let allProductsUpdatedId = allProducts.map((item) => ({
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          type: item.type,
          orderId: orderSuccess.id,
        }));
        const { data, error } = await supabase.from("products").insert(allProductsUpdatedId).select();
        if (error) {
          alert(error.message);
        }
        if (data) {
          router.push(`/order/${orderSuccess.id}?orderId=${orderSuccess.order_id}`);
        }
      }
      if (error) {
        alert(error.message);
      }
    } else {
      const { data, error } = await supabase.from("products").insert(addedProducts).select();
      if (error) {
        alert(error.message);
      }
      if (data) {
        router.refresh();
      }
    }
  }

  if (order && user)
    return (
      <section className="p-5">
        <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
          <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("details")}
              className={`flex items-center justify-center gap-3 w-full p-4 rounded-l-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "details"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
              aria-current="page"
            >
              <MdDashboard size={20} />
              Details
            </div>
          </li>
          <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("warranties")}
              className={`flex items-center justify-center gap-3 w-full p-4 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "warranties"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
            >
              <HiClipboardList size={20} />
              Warranties
            </div>
          </li>
          <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("history")}
              className={`flex items-center justify-center gap-3 w-full p-4 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "history"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
            >
              <BiHistory size={20} />
              History
            </div>
          </li>
          <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("settings")}
              className={`flex items-center justify-center gap-3 w-full p-4 rounded-r-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "settings"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
            >
              <HiAdjustments size={20} />
              Settings
            </div>
          </li>
        </ul>
        {selectedTab === "details" && (
          <section className="p-5">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{order.project_name}</h1>
            <p className="mb-2 text-sm text-gray-900 dark:text-white">
              <b>Date Created: </b>
              {moment(order.created_at).format("MMMM DD, YYYY HH:mm a")}
            </p>
            <p className="mb-2 text-sm text-gray-900 dark:text-white">
              <b>Address: </b>
              {order.address}
            </p>
            {user.role !== "contractor" && order?.change_order && (
              <div className="flex flex-row justify-end gap-4 mt-4">
                <Button outline color="red" className="h-fit">
                  <MdClose size={20} />
                  Deny Changes
                </Button>
                <ApproveCOModal showModal={showApproveModal} setShowModal={setShowApproveModal} reload={getOrders} id={Number(params.id)} />
              </div>
            )}
            {order && <OrderTimeLine order={order} />}

            {!order.change_order && (
              <div className="flex justify-end mb-5 gap-4">
                <CSVSelector
                  showModal={showUploadModal}
                  setShowModal={setShowUploadModal}
                  orderId={Number(params.id)}
                  addProduct={(newProduct) => {
                    setAddedProducts([...addedProducts, ...newProduct]), setShowSubmitButton(true);
                  }}
                />
                <NewProductModal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  addProduct={(newProduct) => {
                    setAddedProducts([...addedProducts, newProduct]), setShowSubmitButton(true);
                  }}
                  orderId={Number(params.id)}
                />
                {showSubmitButton && (
                  <Button className="h-fit" onClick={() => setShowSubmitConfirmation(true)}>
                    <MdCheck size={20} />
                    Submit Changes
                  </Button>
                )}
                <ConfirmationModal
                  title="Submit Order?"
                  description="Are you sure you would like to submit updates to this order?"
                  showModal={showSubmitConfirmation}
                  setShowModal={setShowSubmitConfirmation}
                  handleConfirm={createChangeOrder}
                  handleCancel={() => setShowSubmitConfirmation(false)}
                />
              </div>
            )}
            {productsLoading ? (
              <div className="flex justify-center items-center">
                <Spinner aria-label="Loading" size="xl" />
              </div>
            ) : order.change_order ? (
              <ChangeOrder products={products} />
            ) : (
              <ActiveOrder products={[...products, ...addedProducts]} />
            )}
          </section>
        )}

        {selectedTab === "warranties" && <Warranties products={products} />}
        {selectedTab === "history" && <History order={order} />}
        {selectedTab === "settings" && <Settings order={order} />}
      </section>
    );
}
