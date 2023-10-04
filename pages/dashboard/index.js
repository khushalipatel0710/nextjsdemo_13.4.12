import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "@/store/user";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import Head from "next/head";
import AddUser from "./add";

function Dashbord() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [addUserOpen, setAddUserOpen] = useState(false);
 

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  const handleEdit = () => {
    toggleAddUserDrawer();
  };

  useEffect(() => {
    const intiUser = async () => {
      setIsLoading(true);
      const response = await axios.get("/api/user", {});
      console.log("response", response);
      await dispatch(fetchData(response.data.data));
      setIsLoading(false);
    };
    intiUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const store = useSelector((state) => state.user.data);
  console.log("store______________", store);
  const columns = [
    {
      flex: 0.1,
      minWidth: 250,
      field: "name",
      headerName: "User Name",
    },
    {
      flex: 0.1,
      minWidth: 190,
      field: "city",
      headerName: "City",
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "age",
      headerName: "Age",
    },
    {
      flex: 0.1,
      minWidth: 190,
      field: "gender",
      headerName: "Gender",
    },
    {
      flex: 0.1,
      minWidth: 70,
      sortable: false,
      field: "actions",
      headerName: "Action",
      renderCell: ({ row }) => <RowOptions row={row} />,
    },
  ];

  const RowOptions = (row) => {
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);
    const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

    const handleEdit = () => {
      toggleAddUserDrawer();
    };

    const handleConfirmation = async (value) => {
      console.log("value__________", value, row);
      if (value == "yes") {
        const response = await axios.delete(`/api/user/${row.row.id}`);
        console.log("response_________1234_____", response);
        await dispatch(fetchData(response.data.data));

        handleClose();
      } else {
        handleClose();
      }
    };
    return (
      <>
        <Button onClick={handleEdit}>Edit</Button>
        {addUserOpen && (
          <AddUser
            open={addUserOpen}
            toggle={toggleAddUserDrawer}
            title={"Edit User"}
            defaultValues={row.row}
          />
        )}
        <Button onClick={() => setOpen(true)}>Delete</Button>
        <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                "& svg": { mb: 6, color: "warning.main" },
              }}
            >
              <Icon icon="tabler:alert-circle" fontSize="5.5rem" />
              <Typography>
                Are you sure you would like to delete your user?
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => handleConfirmation("yes")}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleConfirmation("cancel")}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <Grid container spacing={6.5}>
      <Head>
        <title>{`UserData`}</title>
        <meta name="description" content={`UserData`} />
        <meta name="keywords" content="" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />   
      </Head>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="User Data" />
          <CardContent>
            <Button onClick={handleEdit}>Add</Button>
            {addUserOpen && (
              <AddUser
                open={addUserOpen}
                toggle={toggleAddUserDrawer}
                title={"Add User"}
                defaultValues={{
                  id: store.length + 1,
                  name: "",
                  city: "",
                  age: "",
                  gender: "female",
                }}
              />
            )}
          </CardContent>
          <DataGrid
            disableColumnMenu={true}
            autoHeight
            loading={isLoading}
            rowHeight={62}
            rows={store}
            pagination
            columns={columns}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashbord;
