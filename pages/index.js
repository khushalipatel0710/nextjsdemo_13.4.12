import { useDispatch } from "react-redux";
import { login } from "@/store/login";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { FormHelperText, TextField } from "@mui/material";
import axios from "axios";

function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const defaultValues = {
    username: "spiral",
    password: "admin@123",
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log(data, "data____________");
    try {
      const checkData = await axios.post("/api/login", {
        data,
      });
      console.log("checkData________________", checkData);
      if (checkData.data.data) {
        router.push("/dashboard");
      } else {
        setError("password", {
          type: "manual",
          message: "Incorrect password or username",
        });
      }
    } catch (err) {
      console.log("err_____", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          <b>Login Form</b>
        </label>
        <br />
        <FormControl sx={{ mt: 4 }}>
          <Controller
            name="username"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                value={value}
                label="Username"
                onChange={onChange}
                placeholder="johndoe"
              />
            )}
          />
        </FormControl>

        <br />
        <FormControl sx={{ mt: 4 }}>
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                value={value}
                label="Password"
                onChange={onChange}
                placeholder="admin@123"
              />
            )}
          />
          {errors.password && (
            <FormHelperText sx={{ color: "error.main" }}>
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>
        <br />

        <br />
        <button type="submit">Login</button>
      </div>
    </form>
  );
}

export default HomePage;
