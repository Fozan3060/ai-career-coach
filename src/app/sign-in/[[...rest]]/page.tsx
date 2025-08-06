import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn forceRedirectUrl={"dashboard"} path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
