import { getTranslations } from "next-intl/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./_components/sign-in-form";
import { SignUpForm } from "./_components/sign-up-form";

type AuthPageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const t = await getTranslations("auth");
  const resolvedSearchParams =
    ((searchParams ? await searchParams : undefined) ?? {}) as Record<
      string,
      string | string[] | undefined
    >;
  const rawNext = resolvedSearchParams?.next;
  const nextValue = Array.isArray(rawNext) ? rawNext[0] : rawNext;
  const redirectPath =
    typeof nextValue === "string" && nextValue.startsWith("/")
      ? nextValue
      : "/market";

  return (
    <div className="w-full px-4 py-20">
      <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("tabs.signIn")}</TabsTrigger>
              <TabsTrigger value="signup">{t("tabs.signUp")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>{t("signIn.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SignInForm redirectPath={redirectPath} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>{t("signUp.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SignUpForm redirectPath={redirectPath} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}
