"use client";
import * as z from "zod";
import { Size } from "@prisma/client";
import Heading from "../ui/heading";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReducer } from "react";
import {
  Form,
  FormControl,
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

interface SizeFormProps {
  initialData: Size | null;
}

interface StoreInterface {
  open: boolean;
  loading: boolean;
}

type ActionType =
  | { type: "TOGGLE_OPEN"; payload: boolean }
  | { type: "TOGGLE_LOADING"; payload: boolean };

const reducer = (state: StoreInterface, action: ActionType): StoreInterface => {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return { ...state, open: action.payload };
    case "TOGGLE_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  value: z.string().min(1, {
    message: "Value is required",
  }),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const [state, dispatch] = useReducer(reducer, {
    open: false,
    loading: false,
  });

  const setLoading = (toggle: boolean) => {
    dispatch({ type: "TOGGLE_LOADING", payload: toggle });
  };
  const setOpen = (toggle: boolean) => {
    dispatch({ type: "TOGGLE_OPEN", payload: toggle });
  };

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData ? "Size updated" : "Size created";
  const action = initialData ? "Save changes" : "Create";

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted successfully");
    } catch (error) {
      toast.error("Make sure you remove all products using this size first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        loading={state.loading}
        isOpen={state.open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"sm"}
            disabled={state.loading}
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
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={state.loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={state.loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="ml-auto" type="submit" disabled={state.loading}>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default SizeForm;
