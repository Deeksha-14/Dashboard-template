import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRx = /^\+?[0-9]{10,15}$/;
const passStrongRx = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // 8+ chars, letter+number

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(true);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const validate = (f = form) => {
    const e = {};
    if (!f.firstName) e.firstName = "First name is required";
    if (!f.lastName) e.lastName = "Last name is required";
    if (!f.phoneNumber) e.phoneNumber = "Phone is required";
    else if (!phoneRx.test(f.phoneNumber)) e.phoneNumber = "Use +<code> and 10–15 digits";
    if (!f.email) e.email = "Email is required";
    else if (!emailRx.test(f.email)) e.email = "Enter a valid email";
    if (!f.password) e.password = "Password is required";
    else if (!passStrongRx.test(f.password))
      e.password = "Min 8 chars with letters & numbers";
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
      await axiosInstance.post("/auth/register", form);
      navigate("/auth/sign-in", { replace: true });
    } catch (err) {
      setServerErr("Registration failed. Please review details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const errorClass = (key) =>
    touched[key] && errors[key] ? "!border-red-500 focus:!border-red-500" : "";

  // quick, non-judgy strength meter
  const strength = !form.password
    ? 0
    : form.password.length >= 12 && passStrongRx.test(form.password)
      ? 100
      : form.password.length >= 10
        ? 66
        : 33;

  return (
    <section className="m-8 flex">
      {/* Side Image */}
      <div className="w-2/5 h-full hidden lg:block">
        <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" alt="" />
      </div>

      {/* Form */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Create your account</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your details to register.
          </Typography>
        </div>

        <form onSubmit={onSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Typography variant="small" color="blue-gray" className="-mb-1 font-medium">First name</Typography>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                onBlur={() => onBlur("firstName")}
                size="lg"
                placeholder="John"
                autoComplete="given-name"
                className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errorClass("firstName")}`}
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
              {touched.firstName && errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="-mb-1 font-medium">Middle name (optional)</Typography>
              <Input
                name="middleName"
                value={form.middleName}
                onChange={(e) => setField("middleName", e.target.value)}
                size="lg"
                placeholder=""
                autoComplete="additional-name"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: "before:content-none after:content-none" }}
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="-mb-1 font-medium">Last name</Typography>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                onBlur={() => onBlur("lastName")}
                size="lg"
                placeholder="Doe"
                autoComplete="family-name"
                className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errorClass("lastName")}`}
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
              {touched.lastName && errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="-mb-1 font-medium">Phone number</Typography>
              <Input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) => setField("phoneNumber", e.target.value)}
                onBlur={() => onBlur("phoneNumber")}
                size="lg"
                placeholder="+91XXXXXXXXXX"
                autoComplete="tel"
                className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errorClass("phoneNumber")}`}
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
              {touched.phoneNumber && errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
            </div>

            <div className="sm:col-span-2">
              <Typography variant="small" color="blue-gray" className="-mb-1 font-medium">Email</Typography>
              <Input
                name="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => onBlur("email")}
                size="lg"
                placeholder="name@mail.com"
                autoComplete="email"
                className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errorClass("email")}`}
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
              {touched.email && errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <Typography variant="small" color="blue-gray" className="-mb-1 font-medium">Password</Typography>
              <div className="relative">
                <Input
                  name="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onBlur={() => onBlur("password")}
                  type={showPass ? "text" : "password"}
                  size="lg"
                  placeholder="********"
                  autoComplete="new-password"
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

              {/* Strength bar */}
              <div className="mt-2 h-1 w-full bg-gray-200 rounded">
                <div
                  className={`h-1 rounded ${strength >= 100 ? "bg-green-600" : strength >= 66 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Use at least 8 characters, including letters and numbers.
              </p>
            </div>
          </div>

          <div className="mt-3">
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              label={
                <Typography variant="small" color="gray" className="flex items-center font-medium">
                  I agree to the&nbsp;<a href="#" className="underline">Terms & Conditions</a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
          </div>

          {serverErr && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverErr}
            </div>
          )}

          <Button type="submit" className="mt-6" fullWidth disabled={loading || !agree}>
            {loading ? "Registering..." : "Register Now"}
          </Button>

          <Typography variant="small" className="text-center text-blue-gray-500 font-medium mt-6">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1 underline">Sign in</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}



// -----------------
// working material tailwind
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../../services/axiosConfig";
// import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";

// export default function Register() {
//   const navigate = useNavigate();
//   const [agree, setAgree] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const [form, setForm] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     phoneNumber: "",
//     email: "",
//     password: "",
//   });

//   const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     setLoading(true);
//     try {
//       await axiosInstance.post("/auth/register", form);
//       navigate("/auth/sign-in", { replace: true });
//     } catch (error) {
//       setErr("Registration failed. Please review your details and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="m-8 flex">
//       {/* Left: Image */}
//       <div className="w-2/5 h-full hidden lg:block">
//         <img
//           src="/img/pattern.png"
//           className="h-full w-full object-cover rounded-3xl"
//           alt=""
//         />
//       </div>

//       {/* Right: Form */}
//       <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
//         <div className="text-center">
//           <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
//           <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
//             Enter your details to register.
//           </Typography>
//         </div>

//         <form onSubmit={onSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
//           <div className="mb-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//                 First name
//               </Typography>
//               <Input
//                 name="firstName"
//                 value={form.firstName}
//                 onChange={onChange}
//                 size="lg"
//                 placeholder="John"
//                 className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//                 labelProps={{ className: "before:content-none after:content-none" }}
//                 required
//               />
//             </div>
//             <div>
//               <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//                 Middle name (optional)
//               </Typography>
//               <Input
//                 name="middleName"
//                 value={form.middleName}
//                 onChange={onChange}
//                 size="lg"
//                 placeholder=""
//                 className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//                 labelProps={{ className: "before:content-none after:content-none" }}
//               />
//             </div>
//             <div>
//               <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//                 Last name
//               </Typography>
//               <Input
//                 name="lastName"
//                 value={form.lastName}
//                 onChange={onChange}
//                 size="lg"
//                 placeholder="Doe"
//                 className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//                 labelProps={{ className: "before:content-none after:content-none" }}
//                 required
//               />
//             </div>
//             <div>
//               <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//                 Phone number
//               </Typography>
//               <Input
//                 name="phoneNumber"
//                 value={form.phoneNumber}
//                 onChange={onChange}
//                 size="lg"
//                 placeholder="+91XXXXXXXXXX"
//                 className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//                 labelProps={{ className: "before:content-none after:content-none" }}
//                 required
//               />
//             </div>
//             <div className="sm:col-span-2">
//               <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//                 Email
//               </Typography>
//               <Input
//                 name="email"
//                 value={form.email}
//                 onChange={onChange}
//                 size="lg"
//                 placeholder="name@mail.com"
//                 className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//                 labelProps={{ className: "before:content-none after:content-none" }}
//                 required
//               />
//             </div>
//             <div className="sm:col-span-2">
//               <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//                 Password
//               </Typography>
//               <Input
//                 name="password"
//                 value={form.password}
//                 onChange={onChange}
//                 type="password"
//                 size="lg"
//                 placeholder="********"
//                 className="!border-t-blue-gray-200 focus:!border-t-gray-900"
//                 labelProps={{ className: "before:content-none after:content-none" }}
//                 required
//               />
//             </div>
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

//           <Button type="submit" className="mt-6" fullWidth disabled={loading || !agree}>
//             {loading ? "Registering..." : "Register Now"}
//           </Button>

//           <Typography variant="small" className="text-center text-blue-gray-500 font-medium mt-6">
//             Already have an account?
//             <Link to="/auth/sign-in" className="text-gray-900 ml-1 underline">Sign in</Link>
//           </Typography>
//         </form>
//       </div>
//     </section>
//   );
// }



// ---------------------
// Working but basic
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../services/axiosConfig';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     phoneNumber: '',
//     email: '',
//     password: ''
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.post('/auth/register', formData);
//       navigate('/auth/sign-in');
//     } catch (err) {
//       setError('Registration failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
//         <h2 className="text-center text-3xl font-extrabold">Register</h2>
//         {error && <div className="text-red-500 text-center">{error}</div>}
//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           <input
//             type="text"
//             placeholder="First Name"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Middle Name"
//             name="middleName"
//             value={formData.middleName}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md"
//           />
//           <input
//             type="text"
//             placeholder="Last Name"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//           <input
//             type="tel"
//             placeholder="Phone Number"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//           <button 
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;