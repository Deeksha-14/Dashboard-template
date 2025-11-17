import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosConfig";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import Navbar from "../layout/Home/navbar";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeRole(data) {
  const r = typeof data?.role === "string" ? data.role : data?.role?.name;
  return r || null;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(true);          // default checked for less friction
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = (f = form) => {
    const e = {};
    if (!f.email) e.email = "Email is required";
    else if (!emailRx.test(f.email)) e.email = "Enter a valid email";
    if (!f.password) e.password = "Password is required";
    return e;
  };

  const onBlur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eNow = validate();
    setErrors(eNow);
    setServerErr("");
    if (Object.keys(eNow).length) return;

    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/login", form);
      const data = res?.data || {};
      const role = normalizeRole(data);
      login({ ...data, role });

      if (role === "ADMIN") navigate("/dashboard/admin", { replace: true });
      else navigate("/dashboard/participant", { replace: true });
    } catch (err) {
      setServerErr("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const errorClass = (key) =>
    touched[key] && errors[key] ? "!border-red-500 focus:!border-red-500" : "";

  return (
    <>
      <Navbar />
      <section className="m-8 flex gap-4 pt-20 justify-center items-center">
        {/* Form */}
        <div className="w-full lg:w-3/5 mt-10 lg:mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Login</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to continue.
          </Typography>
        </div>

        <form onSubmit={onSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium">
                Email
              </Typography>
              <Input
                name="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => onBlur("email")}
                size="lg"
                type="email"
                placeholder="name@mail.com"
                autoComplete="email"
                className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errorClass("email")}`}
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="-mb-1 font-medium">
                Password
              </Typography>
              <div className="relative">
                <Input
                  name="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onBlur={() => onBlur("password")}
                  type={showPass ? "text" : "password"}
                  size="lg"
                  placeholder="********"
                  autoComplete="current-password"
                  className={`!border-t-blue-gray-200 focus:!border-t-gray-900 pr-12 ${errorClass("password")}`}
                  labelProps={{ className: "before:content-none after:content-none" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              label={<Typography variant="small" color="gray" className="font-medium">Remember me</Typography>}
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="text-gray-900">
              <a href="#" className="underline">Forgot Password?</a>
            </Typography>
          </div>

          {serverErr && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverErr}
            </div>
          )}

          <Button type="submit" className="mt-6" fullWidth disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="space-y-3 mt-6">
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth type="button">
              {/* Google icon */}
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs><clipPath id="clip0_1156_824"><rect width="16" height="16" fill="white" transform="translate(0.5)" /></clipPath></defs>
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          <Typography variant="small" className="text-center text-blue-gray-500 font-medium mt-6">
            New user?
            <Link to="/auth/sign-up" className="text-blue-800 ml-1 underline">Register Now</Link>
          </Typography>
        </form>
        </div>

      {/* Side Image */}
      {/* <div className="w-2/5 h-full hidden lg:block">
        <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" alt="" />
      </div> */}
      </section>
    </>
  );
}




// ------------------------
// working material tailwind
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axiosInstance from "../../services/axiosConfig";
// import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";

// function readRole(data) {
//   const r = typeof data?.role === "string" ? data.role : data?.role?.name;
//   return r || null;
// }

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [agree, setAgree] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     setLoading(true);
//     try {
//       const res = await axiosInstance.post("/auth/login", form);
//       const data = res?.data || {};
//       const role = readRole(data);
//       login({ ...data, role });

//       if (role === "ADMIN") navigate("/dashboard/admin", { replace: true });
//       else navigate("/dashboard/participant", { replace: true });
//     } catch (error) {
//       setErr("Invalid credentials. Please check your email/password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="m-8 flex gap-4">
//       {/* Left: Form */}
//       <div className="w-full lg:w-3/5 mt-10 lg:mt-24">
//         <div className="text-center">
//           <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
//           <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
//             Enter your email and password to sign in.
//           </Typography>
//         </div>

//         <form onSubmit={onSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
//           <div className="mb-1 flex flex-col gap-6">
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Your email
//             </Typography>
//             <Input
//               name="email"
//               value={form.email}
//               onChange={onChange}
//               size="lg"
//               placeholder="name@mail.com"
//               className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//               required
//             />
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Password
//             </Typography>
//             <Input
//               name="password"
//               value={form.password}
//               onChange={onChange}
//               type="password"
//               size="lg"
//               placeholder="********"
//               className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//               required
//             />
//           </div>

//           <div className="mt-3">
//             <Checkbox
//               checked={agree}
//               onChange={(e) => setAgree(e.target.checked)}
//               label={
//                 <Typography variant="small" color="gray" className="flex items-center font-medium">
//                   I agree to the&nbsp;
//                   <a href="#" className="underline">Terms & Conditions</a>
//                 </Typography>
//               }
//               containerProps={{ className: "-ml-2.5" }}
//             />
//           </div>

//           {err && (
//             <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {err}
//             </div>
//           )}

//           <Button
//             type="submit"
//             className="mt-6"
//             fullWidth
//             disabled={loading || !agree}
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </Button>

//           <Typography variant="small" className="text-center text-blue-gray-500 font-medium mt-6">
//             Not registered?
//             <Link to="/auth/sign-up" className="text-gray-900 ml-1 underline">Create account</Link>
//           </Typography>
//         </form>
//       </div>

//       {/* Right: Image */}
//       <div className="w-2/5 h-full hidden lg:block">
//         <img
//           src="/img/pattern.png"
//           className="h-full w-full object-cover rounded-3xl"
//           alt=""
//         />
//       </div>
//     </section>
//   );
// }






// -------------------------------------------------------------------
//working but basic
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import axiosInstance from '../../services/axiosConfig';
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Avatar,
//   CssBaseline,
//   Grid,
//   Link as MuiLink,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme();

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axiosInstance.post('/auth/login', formData);
//       const data = response.data || {};
//       // ensure role is a plain string
//      const role = typeof data.role === 'string' ? data.role : data.role?.name;
//     login({ ...data, role }); // store normalized role
//      // Redirect based on role to the new paths
//      if (role === 'ADMIN') {
//        navigate('/dashboard/admin', { replace: true });
//      } else {
//        navigate('/dashboard/participant', { replace: true });
//      }
//     } catch (err) {
//       setError('Invalid credentials');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Sign in
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder='***'
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading}
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </Button>
//             <Grid container>
//               <Grid item>
//                 <MuiLink component={Link} to="/auth/sign-up" variant="body2">
//                   {"Don't have an account? Sign Up"}
//                 </MuiLink>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//       <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
//         <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
//           {error}
//         </Alert>
//       </Snackbar>
//     </ThemeProvider>
//   );
// };

// export default Login;

// -------------------------------------------------------------------
















// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import axiosInstance from '../../services/axiosConfig';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     setLoading(true);

// //     try {
// //       const response = await axiosInstance.post('/auth/login', formData);
// //       login(response.data);
      
// //       // Redirect based on role
// //       if (response.data.role === 'ADMIN') {
// //         navigate('/admin');
// //       } else {
// //         navigate('/');
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Invalid credentials');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     const response = await axiosInstance.post('/auth/login', formData);
//     login(response.data);
    
//     // Redirect based on role
//     if (response.data.role === 'ADMIN') {
//       navigate('/admin');
//     } else {
//       navigate('/dashboard');
//     }
//   } catch (err) {
//     setError('Invalid credentials');
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
//             {error}
//           </div>
//         )}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//                 loading 
//                   ? 'bg-blue-400 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//             >
//               {loading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>

//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{' '}
//               <Link
//                 to="/register"
//                 className="font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Register here
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;