import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { MapPin, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import showToast from "../../utils/toast/toastUtils";
import { deleteAddresses, fetchAddresses, saveNewAddress, updateAddresses } from "../../store/addressSlice";


interface Address {
  _id: string;
  type: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

const addressSchema = z.object({
  type: z.string().min(1, { message: "Address type is required." }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Street address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  zipCode: z.string().regex(/^\d{5}$/, { message: "ZIP code must be 5 digits." }),
  country: z.string().min(2, { message: "Country must be at least 2 characters." }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressManagement() {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { addresses, status } = useAppSelector((state) => state.address);


useEffect(()=>{
  if(status === 'idle'){

    dispatch(fetchAddresses());
  }
},[dispatch, status])

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      country: "",
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    try {
      if (editingAddress) {
        // Handle update
        await dispatch(updateAddresses({ _id: editingAddress._id, ...data })).unwrap();
        showToast("Your address has been successfully updated.",'success');
      } else {
        // Handle create
        await dispatch(saveNewAddress(data)).unwrap();

        showToast("Your new address has been successfully added.",'success')
      }
      resetForm();
    } catch (error) {

      showToast("Failed to save address. Please try again.",'error')

    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      zipCode: address.zipCode,
      country: address.country,
    });
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setDeleteConfirmation(addressId);
  };

  const confirmDeleteAddress = async () => {
    if (deleteConfirmation) {
      try {
        await dispatch(deleteAddresses(deleteConfirmation)).unwrap();

        showToast("The address has been successfully removed.",'success')
      } catch (error) {

        showToast("Failed to delete address. Please try again.",'error')
      }
      setDeleteConfirmation(null);
    }
  };

  const resetForm = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
    form.reset();
  };

  const AddressCard = ({ address }: { address: Address }) => (
    <div className="relative group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start space-x-4 p-6">
        <MapPin className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg tracking-tight">
              {address.type || "Home"}
            </h3>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditAddress(address)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteAddress(address._id)}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{address.firstName} {address.lastName}</p>
            <p>{address.address}</p>
            <p>{address.city}, {address.zipCode}</p>
            <p>{address.country}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Addresses</CardTitle>
          <CardDescription>
            Manage your delivery and billing addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {addresses.length === 0 && !isAddingAddress ? (
            <div className="text-center py-6">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No addresses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first address to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <AddressCard key={address._id} address={address} />
              ))}
            </div>
          )}

          {isAddingAddress ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Home, Work" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4">
                  <Button type="submit" className="flex-1">
                    {editingAddress ? "Update" : "Add"} Address
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Button
              onClick={() => setIsAddingAddress(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAddress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}