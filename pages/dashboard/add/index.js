import { useDispatch } from "react-redux";
import { fetchData } from "@/store/user";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Head from "next/head";

function AddUser(props) {
  const dispatch = useDispatch();
  const [gender, setGender] = useState(props?.defaultValues?.gender);
  const [open, setOpen] = useState(true);
  const defaultValues = {
    id: props.defaultValues.id,
    name: props.defaultValues.name,
    age: props.defaultValues.age,
    city: props.defaultValues.city,
    gender: props.defaultValues.gender,
    status: props.defaultValues.status,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log(data, "data____________");
    try {
      if (props.title == "Edit User") {
        const checkData = await axios.put("/api/user", {
          ...data,
          gender: gender,
        });
        console.log("checkData________________", checkData);
        await dispatch(fetchData(checkData.data.data));
      } else {
        const checkData = await axios.post("/api/user", {
          ...data,
          gender: gender,
        });
        console.log("checkData________________", checkData);
        await dispatch(fetchData(checkData.data.data));
      }
      setOpen(false);
    } catch (err) {
      console.log("err_____", err);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={props.toggle}>
      <Head>
        <title>{`${props.title}`}</title>
        <meta name="description" content={`${props.title}`} />
        <meta name="keywords" content="" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <DialogContent>
        <Typography>{props.title}</Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
        }}
      >
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ mt: 4 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    value={value}
                    label="name"
                    onChange={onChange}
                    placeholder="johndoe"
                  />
                )}
              />
            </FormControl>

            <br />
            <FormControl sx={{ mt: 4 }}>
              <Controller
                name="age"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    type="number"
                    value={value}
                    label="age"
                    onChange={onChange}
                  />
                )}
              />
            </FormControl>

            <br />
            <FormControl sx={{ mt: 4 }}>
              <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    value={value}
                    label="City"
                    onChange={onChange}
                    placeholder="Ahmedabad"
                  />
                )}
              />
            </FormControl>
            <br />
            <FormControl sx={{ mt: 4 }}>
              <InputLabel id="select-gender">Select gender</InputLabel>
              <Select
                fullWidth
                value={gender}
                id="select gender"
                label="Select gender"
                labelId="select gender"
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                inputProps={{ placeholder: "Select gender" }}
              >
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">male</MenuItem>
              </Select>
            </FormControl>
            <br />

            <Button type="submit">Submit</Button>
          </form>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default AddUser;
