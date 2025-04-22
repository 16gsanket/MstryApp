"use client";
import React from "react";
import z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams();

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log(data);
    try {
      const response = axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      console.log(response)

      toast("Account Verified Successfully");
      router.replace("sign-in");
    } catch (error) {
      console.error("Error in verifying account", error);
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data.message ?? "error verifying account";

      toast("error verifying account", errorMessage);
    }
  };

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Code Here" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Code</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
