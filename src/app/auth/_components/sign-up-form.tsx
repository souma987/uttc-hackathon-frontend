"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpThenSignIn } from "@/lib/services/auth";

type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpForm() {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await signUpThenSignIn({ email: data.email, password: data.password });
      setSuccessMessage(t("signUp.success"));
      // After sign up + sign in, go to market
      router.push("/market");
    } catch (error) {
      console.error("Sign up error:", error);
      // Basic error feedback
      setErrorMessage(t("signUp.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: t("errors.emailRequired"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t("errors.emailInvalid"),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("signUp.email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("signUp.emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{
            required: t("errors.passwordRequired"),
            minLength: {
              value: 6,
              message: t("errors.passwordMinLength"),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("signUp.password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("signUp.passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: t("errors.passwordRequired"),
            validate: (value) =>
              value === form.getValues("password") ||
              t("errors.passwordsNotMatch"),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("signUp.confirmPassword")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("signUp.confirmPasswordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {successMessage && (
          <p className="text-sm text-green-600" role="status">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("signUp.submitting") : t("signUp.submit")}
        </Button>
      </form>
    </Form>
  );
}
