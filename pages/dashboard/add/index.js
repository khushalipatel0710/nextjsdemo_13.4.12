import { useDispatch } from "react-redux";
import { fetchData } from "@/store/user";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import {
  Box,
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
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

function AddUser(props) {
  const dispatch = useDispatch();
  const router = useRouter()
  const [imgSrc, setImgSrc] = useState(props.defaultValues.image || "");
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(true);
  const [file, setFile] = useState(null);

  const defaultValues = {
    id: props.defaultValues.id,
    username: props.defaultValues.username,
    fullname: props.defaultValues.fullname,
    email: props.defaultValues.email,
    contact_no: props.defaultValues.contact_no,
    image: props.defaultValues.image,
  };

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const ImgStyled = styled("img")(({ theme }) => ({
    width: 100,
    height: 100,
    marginRight: theme.spacing(6),
    borderRadius: theme.shape.borderRadius,
  }));

  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  }));

  const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

  // file types check

  const checkValidFile = (file) => {
    if (file && file.type !== undefined) {
      return SUPPORTED_FORMATS.includes(file.type);
    }

    switch (get_url_extension(file)) {
      case "jpg":
        return SUPPORTED_FORMATS.includes("image/jpeg");

      case "jepg":
        return SUPPORTED_FORMATS.includes("image/jpeg");

      case "png":
        return SUPPORTED_FORMATS.includes("image/png");

      default:
        break;
    }
  };

  // file size check
  const validateSelectedFile = (file) => {
    const MIN_FILE_SIZE = 2; // 2 KB
    const MAX_FILE_SIZE = 5120; // 5 MB
    const fileSizeKiloBytes = file.size / 1024;

    if (fileSizeKiloBytes < MIN_FILE_SIZE) {
      // setErrorMsg('File size is less than minimum limit')
      // setIsSuccess(false)

      setError("image", {
        type: "manual",
        message: "File size is less than minimum limit",
      });

      return;
    }
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      // setErrorMsg('File size is greater than maximum limit')
      // setIsSuccess(false)

      setError("image", {
        type: "manual",
        message: "File size is greater than maximum limit",
      });

      return;
    }

    clearErrors(["image"]);

    // setErrorMsg('')
    // setIsSuccess(true)
  };

  const handleInputImageChange = async (e) => {
    const isValid = checkValidFile(e.target.files[0]);

    if (!isValid) {
      setError("image", {
        type: "manual",
        message: "Select a valid file type",
      });

      return;
    }

    validateSelectedFile(e.target.files[0]);
    let myFiles = Array.from(e.target.files);
    let valid = SUPPORTED_FORMATS.includes(
      myFiles && myFiles !== undefined && myFiles[0].type
    );

    // set Priview
    const reader = new FileReader();
    const { files } = e.target;
    setFile(e.target.files[0]);
    if (files && files.length !== 0) {
      reader.onload = async () => {
        console.log(reader.result, "reader.result");
        setImgSrc(reader.result);
      };
      if (!valid || valid === false) {
        setImgSrc("/nosupported.jpg");
        toast.error("Select a valid file type", {
          position: "bootom-center",
        });
        setIsLoading(false);
        setIsValidPreview(false);

        return;
      }
      reader.readAsDataURL(files[0]);
      if (reader.result !== null) {
        console.log(reader.result, "reader.result");
        setInputValue(reader.result);
      }
    }
  };

  const onSubmit = async (data) => {
    console.log(data, "data____________");
    try {
      var image;
      if (file !== null) {
        // if (!isSuccess) {
        //   setError('image', {
        //     type: 'manual',
        //     message: errorMsg
        //   })
        //   setIsLoading(false)

        //   return
        // }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "j2ament8");
        formData.append("cloud_name", "prosetsgolf-nextjs");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/hhnzs9k6q/image/upload",
          formData
        );
        image = res.data.secure_url;
        setImgSrc("");
      }

      console.log("image______________", image);

      data.image = data.image = image;
      if (props.title == "Edit User") {
        const checkData = await axios.put("/api/user", {
          data,
        });
        setOpen(false);
        console.log("checkData________________", checkData);
        router.push('/dashboard')
      } else {
        delete data.id;
        const checkData = await axios.post("/api/user", {
          data,
        });

        router.push('/dashboard')
        setOpen(false);
      }
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ImgStyled src={imgSrc || `/nosupported.jpg`} alt="Pic" />

              <div>
                <ButtonStyled
                  component="label"
                  variant="contained"
                  htmlFor="account-settings-upload-image"
                >
                  Upload New Photo
                  <input
                    hidden
                    type="file"
                    value={inputValue}
                    accept="image/png, image/jpeg"
                    onChange={handleInputImageChange}
                    id="account-settings-upload-image"
                  />
                </ButtonStyled>

                {errors.image && (
                  <Typography sx={{ mt: 4, color: "error.main" }}>
                    {errors.image.message}
                  </Typography>
                )}

                <Typography sx={{ mt: 4, color: "text.disabled" }}>
                  Allowed PNG or JPEG. Max size of 5MB or Min size of 5KB
                </Typography>
              </div>
            </Box>

            <FormControl sx={{ mt: 4 }}>
              <Controller
                name="username"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    value={value}
                    label="User Name"
                    onChange={onChange}
                    placeholder="johndoe"
                  />
                )}
              />
            </FormControl>

            <br />
            <FormControl sx={{ mt: 4 }}>
              <Controller
                name="fullname"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    value={value}
                    label="Full Name"
                    onChange={onChange}
                    placeholder="johndoe"
                  />
                )}
              />
            </FormControl>

            <br />
            <FormControl sx={{ mt: 4 }}>
              <Controller
                name="contact_no"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    type="number"
                    value={value}
                    label="Phone No"
                    onChange={onChange}
                  />
                )}
              />
            </FormControl>

            <br />
            <FormControl sx={{ mt: 4 }}>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    value={value}
                    label="Email"
                    onChange={onChange}
                    placeholder=""
                  />
                )}
              />
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
