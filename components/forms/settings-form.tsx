"use client";

import * as z from "zod";
import { Store } from "@prisma/client";
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
import ApiAlert from "../ui/api-alert";
import useOrigin from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
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
});

type settingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<settingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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

  const onSubmit = async (data: settingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store updated successfully");
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error("Make sure you remove all products and categories first.");
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
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant={"destructive"}
          size={"sm"}
          disabled={state.loading}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="gird grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={state.loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="ml-auto" type="submit" disabled={state.loading}>
            Save
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
