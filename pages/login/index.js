import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { FormHelperText, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

function HomePage() {
  const auth = useAuth();

  const defaultValues = {
    username: "admin",
    password: "admin@321",
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
    console.log(data, "data____________", auth);
    try {
      await auth.login(data, (e) => {
        console.log("e_____________________", e, data);
        setError("password", {
          type: "manual",
          message: e.message,
        });
      });
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
