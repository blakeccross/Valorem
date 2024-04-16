import { Card, Toast, Table } from "flowbite-react";
import { useState, useRef, useContext } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Database } from "../../../../../../types/supabase";
import { numberWithCommas } from "@/utils/commonUtils";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { MergeProductsbyKey } from "@/utils/commonUtils";
type Item = Database["public"]["Tables"]["lineitems"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  ItemId: Item;
};
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [COProduct];
interface COProduct extends Product {
  status: string;
}
import { HiCheck } from "react-icons/hi";
import { useSearchParams } from "next/navigation";

export default function ActiveOrder({
  products,
  remove,
  isEditing,
}: {
  products: Product[];
  remove: (product: Product) => void;
  isEditing: boolean;
}) {
  const [showToast, setShowToast] = useState(false);
  const searchParams = useSearchParams();
  const { user, SignOut } = useContext(UserContext);
  const router = useRouter();
  const productSortedByType: ProductArray[] = MergeProductsbyKey(products, "Room");

  function handleRemoveProduct(product: Product) {
    let removedProduct = { ...product, status: "removed" };
    remove(removedProduct);
  }

  return (
    <div>
      <div className="flex flex-col flex-1 gap-4">
        {productSortedByType.length >= 1 ? (
          productSortedByType
            .sort((a, b) => (a[0].Room || "").localeCompare(b[0].Room || ""))
            .map((item: ProductArray) => (
              <Card key={item[0].id} className="overflow-x-auto">
                <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item[0].Room}</h5>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Product Description</Table.HeadCell>
                    <Table.HeadCell>Qty</Table.HeadCell>
                    <Table.HeadCell>Price</Table.HeadCell>
                    <Table.HeadCell>Total Price</Table.HeadCell>
                    {isEditing && <Table.HeadCell></Table.HeadCell>}
                  </Table.Head>
                  {item
                    .sort((a, b) => (a.ItemId.Description || "z").localeCompare(b.ItemId.Description || "z"))
                    .map((product, index) => (
                      <Table.Body className="divide-y" key={product.id}>
                        <Table.Row
                          className={
                            `dark:border-gray-700 dark:bg-gray-800 ` +
                            ((product.status === "updated" && ` bg-amber-200 dark:bg-amber-800`) ||
                              (product.status === "removed" && ` bg-red-200 dark:bg-red-800`) ||
                              (product.status === "new" && ` bg-green-200 dark:bg-green-800`))
                          }
                        >
                          <Table.Cell className="font-medium text-gray-900 dark:text-white">
                            <p>{product.ItemId.Description}</p>
                          </Table.Cell>
                          <Table.Cell>{product.Qty}</Table.Cell>
                          <Table.Cell className="whitespace-nowrap">{"$" + numberWithCommas(Math.floor(product.Price || 0))}</Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            {"$" + numberWithCommas(Math.floor(product.Price || 0 * product.Qty))}
                          </Table.Cell>
                          {isEditing && (
                            <Table.Cell>
                              {product.status !== "removed" && (
                                <MdDeleteOutline size={25} className="text-red-500 cursor-pointer" onClick={() => handleRemoveProduct(product)} />
                              )}
                            </Table.Cell>
                          )}
                        </Table.Row>
                      </Table.Body>
                    ))}
                </Table>
              </Card>
            ))
        ) : (
          <div className="mx-auto my-24">
            <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white">No products added</h5>
            <p className="mb-2 text-sm text-gray-400 dark:text-white">{`Select 'Add Product' to get started.`}</p>
          </div>
        )}
      </div>
      {showToast && (
        <Toast className="fixed bottom-10 right-10" duration={100}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Product added successfully.</div>
          <Toast.Toggle />
        </Toast>
      )}
    </div>
  );
}
