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

type AddCaseModalProps = {
  open: boolean;
  onClose: () => void;
};

/* 
  FEATURE 2 TODO:
  Write a mutation that will insert (add) a new case given the
  description, name, status, and category_id.
  
  Make sure to replace the string that is currently
  in this variable 
*/
const InsertCaseMutation = `
mutation InsertCaseMutation($name: String = "", $description: String = "", $status: String = "", $category_id: Int!) {
  insert_cases_one(object: {name: $name, description: $description, status: $status, category_id: $category_id}) {
    id
    name
    description
    status
    category_id
  }
}
`;

const AddCaseModal: React.FC<AddCaseModalProps> = (props) => {
  const classes = useStyles();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });

  const [result, executeMutation] = useMutation(InsertCaseMutation);

  return (
    <div>
    {showAlert ?
      <Alert variant="success" onClose={() => setShowAlert(false)} style={{position: "fixed", top: "0", left: "0", width: "100%", display: "flex", justifyContent: "space-between"}}>
        <Alert.Heading>Successfully added case!</Alert.Heading>
        <CloseIcon style={{width: "30px", height: "30px", cursor: "pointer"}} onClick={() => setShowAlert(false)}/>
      </Alert>
    : null }
    <StyledModal open={props.open} onClose={props.onClose}>
      <Typography variant="h4" align="center">
        Add New Case
      </Typography>
      <Box>
        <TextField
          id="standard-full-width"
          label="Name"
          placeholder="Example Case Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="standard-full-width"
          label="Description"
          placeholder="Example Case Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDescription(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            fullWidth
            value={status}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              setStatus(event.target.value as string);
            }}
          >
            <MenuItem value={"To Do"}>To Do</MenuItem>
            <MenuItem value={"In Progress"}>In Progress</MenuItem>
            <MenuItem value={"Done"}>Done</MenuItem>
          </Select>
        </FormControl>
        {data ? (
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              fullWidth
              value={category}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setCategory(event.target.value as number);
              }}
            >
              {/*
                FEATURE 2 TODO:
                Use the data from the result of the query ManagementContainerQuery
                to render a MenuItem with category id as the value, and the 
                category name as the text.
              */}

              {data.category.map((c: any, index: number) => {
                return <MenuItem key={index} value={c.id}>
                  {c.name}
                </MenuItem>
              })}

            </Select>
          </FormControl>
        ) : fetching ? (
          "Loading Categories"
        ) : null}
      </Box>
      <Box mt="10px" display="flex" justifyContent="center">
        <Button
          variant="outlined"
          onClick={() => {
            executeMutation({
              description,
              name,
              status,
              category_id: category,
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
export default AddCaseModal;
