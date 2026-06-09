
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAppContext } from "../context/Appcontext"

import loginImage from "../assets/login.png"

const Login : React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const navigate = useNavigate()
  const { login } = useAppContext()

  const [loginInfo, setlloginInfo] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setlloginInfo((prevInfo) => ({ ...prevInfo, [name]: value })); 
  }

  const handlelogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { email, password } = loginInfo;
    if (!email || !password) {
      toast.error('Email and password are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(loginInfo); 
      const { success, message, error } = result; 

     if (success) { 
  toast.success(message || "Logged in successfully!");
  
  const userData = result.user ? result.user : result;
  
  // 🔍 Check exactly what your backend is returning to your client application
  console.log("=== DEBUG LOGIN DATA ===");
  console.log("Raw Result Object:", result);
  console.log("Parsed User Target Data:", userData);
  console.log("Evaluated Flag Status:", userData?.isOnboardingComplete);
  
  if (userData?.isOnboardingComplete === true) {
    navigate('/dashboard');
  } else {
    navigate('/onboarding');
  }
} else if (error) { 
        const details = error?.details[0]?.message; 
        toast.error(details || "Validation failed");
      } else { 
        toast.error(message || "An error occurred");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cannot connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="flex min-h-screen transition-colors duration-200 bg-slate-50 dark:bg-slate-950">
      <div className="items-center justify-center hidden p-12 border-r md:flex md:w-1/2 bg-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-lg text-center">
            <img src={loginImage} alt="Fitness Tracker Illustration" className="w-full h-auto mb-10 transition duration-500 transform drop-shadow-2xl rounded-2xl hover:scale-105" />
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Start Your <span className="text-sky-500">Fitness Journey</span> Today.
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
              Track calories, log activities, and transform your lifestyle with our easy-to-use platform.
            </p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full p-6 md:w-1/2 sm:p-12">
        <form onSubmit={handlelogin} className="w-full max-w-md p-10 bg-white border shadow-2xl dark:bg-slate-900 rounded-3xl border-slate-200 dark:border-slate-800">
          <header className="mb-6 text-center md:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Sign In</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">Fill in the details to login.</p>
          </header>

          <div className="mt-5">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative mt-2">
              <MailIcon className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 size-5" />
              <input onChange={handleChange} value={loginInfo.email} type="email" name="email" placeholder="example@gmail.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 transition-all outline-none" required />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative mt-2">
              <LockIcon className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 size-5" />
              <input onChange={handleChange} value={loginInfo.password} name="password" placeholder="••••••••••••" className="w-full pl-12 pr-12 py-3.5 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 transition-all outline-none" required type={showPassword ? 'text' : 'password'} />
              <button type="button" className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-400 hover:text-sky-500" onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full mt-8 py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]">
            {isSubmitting ? "Processing..." : "Login"}
          </button>

          <div className="mt-8 text-sm text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate('/signup')} className="font-bold text-sky-600 hover:text-sky-700 underline-offset-4 hover:underline">
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Login