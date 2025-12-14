"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailPassword } from "@/lib/services/auth";
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

type SignInFormData = {
  email: string;
  password: string;
};

export function SignInForm() {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithEmailPassword(data.email, data.password);
      router.push("/market");
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMessage(t("signIn.errorGeneric"));
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
              <FormLabel>{t("signIn.email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("signIn.emailPlaceholder")}
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
              <FormLabel>{t("signIn.password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("signIn.passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("signIn.submitting") : t("signIn.submit")}
        </Button>
      </form>
    </Form>
  );
}
