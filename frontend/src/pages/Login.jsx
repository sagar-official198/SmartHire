import { SignIn } from "@clerk/clerk-react";

function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn routing="path" path="/login" key="jobseeker" />
    </div>
  );
}

export default Login;