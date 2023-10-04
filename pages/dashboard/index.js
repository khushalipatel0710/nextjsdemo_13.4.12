import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "@/store/user";
import { useRouter } from "next/navigation";
import {
  Avatar,
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
import { DataGrid } from '@mui/x-data-grid'
import axios from "axios";
import { useEffect, useState } from "react";
import Head from "next/head";
import AddUser from "./add";

function Dashbord() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const getInitials = string => string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  const handleEdit = () => {
    toggleAddUserDrawer();
  };

const renderClient = row => {
  console.log(row, 'row')
  if (row.image) {
    return <Avatar src={row.image} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
      console.log(row, 'row')
    return (
      <Avatar
        
        sx={{ mr: 2.5, width: 38, height: 38}}
      >
        {getInitials(row.fullname ? row.fullname : 'User Name')}
      </Avatar>
    )
  }
}
  useEffect(() => {
    const intiUser = async () => {
      setIsLoading(true);
      var params = {
        page: page,
        limit: pageSize
      } 
      const response = await axios.get("/api/user", { params });
      console.log("response", response);
      await dispatch(fetchData(response.data.data));
      setIsLoading(false);
    };
    intiUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch,page, pageSize]);

  const store = useSelector((state) => state.user);
  console.log("store______________", store);

  const columns = [
     {
      flex: 0.1,
      minWidth: 250,
      field: "fullname",
       headerName: "Full Name",
       renderCell: ({ row }) => {
      const { fullname, email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
               
                 
              }}
            >
              {fullname || ''}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
    },
     {
      flex: 0.1,
      minWidth: 250,
      field: "username",
      headerName: "User Name",
    },
    {
      flex: 0.1,
      minWidth: 190,
      field: "contact_no",
      headerName: "Phone Number",
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "createdAt",
      headerName: "Created At",
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "updatedAt",
      headerName: "Updated At",
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
        const response1 = await axios.delete(`/api/user/${row.row.id}`);
        console.log("response_________1234_____", response1);
         var params = {
        page: 1,
        limit: 10
      } 
      const response = await axios.get("/api/user", { params });
      console.log("response", response);
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
                  username: "",
                  fullname: "",
                  image: "",
                  contact_no: "",
                  email:''
                }}
              />
            )}
          </CardContent>
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={store.data ? store.data : []}
            rowCount={store?.total}
            columns={columns}
            page={page}
            pageSize={pageSize}
            paginationMode='server'
            loading={isLoading}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 100]}
            onPageChange={newPage => setPage(newPage)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashbord;
