import React, { useState } from "react";
import StyledModal from "./StyledModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from 'react-bootstrap/Alert'
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useMutation, useQuery } from "urql";
import {
  ManagementCategory,
  ManagementContainerQuery,
} from "../CaseManagementContainer";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "25ch",
    },
  })
);

type DeleteCaseModalProps = {
  open: boolean;
  onClose: () => void;
};

const DeleteCategoryMutation = `
mutation DeleteCategoryMutation($id: bigint!) {
  delete_category_by_pk(id: $id) {
    id
  }
}  
`;

const AddCategoryModal: React.FC<DeleteCaseModalProps> = (props) => {
  const classes = useStyles();
  const [id, setId] = useState<number>(-1);
  const [result, executeMutation] = useMutation(DeleteCategoryMutation);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });

  return (
    <div>
      {showAlert ?
      <Alert variant="success" onClose={() => setShowAlert(false)} style={{position: "fixed", top: "0", left: "0", width: "100%", display: "flex", justifyContent: "space-between"}}>
        <Alert.Heading>Successfully deleted category!</Alert.Heading>
        <CloseIcon style={{width: "30px", height: "30px", cursor: "pointer"}} onClick={() => setShowAlert(false)}/>
      </Alert>
    : null }
    <StyledModal open={props.open} onClose={props.onClose}>
      <Typography variant="h4" align="center">
        Delete Category
      </Typography>
      {data ? (
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category Name</InputLabel>
            <Select
              labelId="category-select-label"
              fullWidth
              value={id}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setId(event.target.value as number);
              }}
            >

            {data.category.map((c: any) => {
              return <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            })}

            </Select>
          </FormControl>
        ) : fetching ? (
          "Loading Categories"
        ) : null}
      <Box mt="10px" display="flex" justifyContent="center">
        <Button
          variant="outlined"
          onClick={() => {
            executeMutation({
              id
            }).then(() => {
              setShowAlert(true);
            });
            props.onClose();
          }}
        >
          Submit
        </Button>
      </Box>
    </StyledModal>
    </div>
  );
};
export default AddCategoryModal;
