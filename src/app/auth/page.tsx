import {useTranslations} from "next-intl";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
import {SignInForm} from "./_components/sign-in-form";
import {SignUpForm} from "./_components/sign-up-form";

export default function AuthPage() {
  const t = useTranslations("auth");

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
                  <SignInForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>{t("signUp.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SignUpForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}
