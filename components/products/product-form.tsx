"use client";
import * as z from "zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import Heading from "../ui/heading";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AlertModal from "../modals/alert-modal";
import ImageUpload from "../ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import Modal from "../ui/modal";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorIds: z.array(z.string()),
  sizeIds: z.array(z.string()),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
      }
    : {
        name: "",
        images: [],
        price: 0,
        stock: 1,
        categoryId: "",
        colorIds: [],
        sizeIds: [],
        isFeatured: false,
        isArchived: false,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input
                  type="button"
                  value={"Select size"}
                  onClick={() => setSizeOpen(true)}
                />
              </FormControl>
              <Modal
                title="Size"
                description="Select product's available sizes"
                isOpen={sizeOpen}
                onClose={() => setSizeOpen(false)}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {sizes.map((size) => (
                    <FormField
                      key={size.id}
                      control={form.control}
                      name="sizeIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={size.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(size.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange(
                                        field?.value && field.value.length > 0
                                          ? [...field.value, size.id]
                                          : [size.id]
                                      )
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== size.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal flex justify-center items-center gap-x-1">
                              <div>{size.name}</div>
                              <div>({size.value})</div>
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </Modal>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input
                  type="button"
                  value={"Select color"}
                  onClick={() => setColorOpen(true)}
                />
              </FormControl>
              <Modal
                title="Color"
                description="Select product's available colors"
                isOpen={colorOpen}
                onClose={() => setColorOpen(false)}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {colors.map((color) => (
                    <FormField
                      key={color.id}
                      control={form.control}
                      name="colorIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={color.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(color.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange(
                                        field?.value && field.value.length > 0
                                          ? [...field.value, color.id]
                                          : [color.id]
                                      )
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== color.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal flex flex-row justify-center items-center gap-x-1">
                              {color.name}
                              <div
                                key={color.value}
                                className="h-4 w-4 rounded-full border"
                                style={{ backgroundColor: color.value }}
                              />
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </Modal>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
