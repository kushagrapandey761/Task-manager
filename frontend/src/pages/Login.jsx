import { useState } from "react";
import { z } from "zod";
import MainHeader from "../components/MainHeader"
import { useNavigate } from "react-router-dom";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export default function Login(){
  const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState([]);
    async function handleSubmit(e) {
      e.preventDefault();

      const formData = { email, password };
      const result = loginSchema.safeParse(formData);

      if (!result.success) {
        const errorMessages = result.error.errors.map((err) => err.message);
        setError(errorMessages);
        return;
      }

      setError([]);

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Invalid credentials!");
        }

        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } catch (err) {
        setError([err.message]);
      }
    }

    return (
      <>
        <MainHeader />
        <div className="bg-[#27445D] h-screen">
          <div className="flex flex-row justify-center items-center">
            <div className="flex flex-col space-y-10 items-center justify-center bg-[#E7FBB4] lg:w-[500px] lg:h-[550px] w-[350px] h-[400px] mt-20">
              <h1 className="font-arima font-bold text-xl">
                Login to your account
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-6">
                  <label className="font-arima font-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="bg-white w-[300px] h-[30px] p-4 rounded-xl font-arima text-sm"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    className="font-arima font-semibold"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="bg-white w-[300px] h-[30px] p-4 rounded-xl font-arima text-sm"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {error.length > 0 && (
                    <div className="flex flex-col text-red-500 text-xs font-semibold">
                      {error.map((errMsg, idx) => (
                        <p key={idx}>{errMsg}</p>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-[#FFE893] h-[50px] rounded-2xl hover:bg-[#FB9EC6] font-semibold"
                  >
                    Log In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
}