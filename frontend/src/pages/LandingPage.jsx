import MainHeader from "../components/MainHeader";

export default function LandingPage() {
  return (
    <>
      <MainHeader />
      <div className="bg-[#27445D] min-h-screen flex justify-center items-center">
        <div className="flex flex-row justify-center items-center space-x-20 ">
          <img
            width={500}
            src="https://i.pinimg.com/1200x/25/6f/1b/256f1b1f82918f2adef3061479ef27f2.jpg"
            className="rounded-full"
          />
          <div className="flex flex-col space-y-3 w-[30%]">
            <p className="font-arima text-lg font-semibold text-white">
              Simplify Your Task Management – Stay Organized, Stay Productive!
            </p>
            <p className="text-white">
              Create, organize, and track your tasks effortlessly. Our task
              manager helps you stay on top of your work with seamless task and
              sub-task management.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
