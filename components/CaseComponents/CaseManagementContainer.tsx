import React from "react";
import Button from "react-bootstrap/Button";
import { Container } from "reactstrap";
import Grid, { GridSpacing } from "@material-ui/core/Grid";
import "../../styles/casemanagement.module.css";
import Footer from "./Footer";
import CaseCategory from "./CaseCategory";
import AddCaseModal from "./Modals/AddCaseModal";
import { useQuery } from "urql";
import AddCategoryModal from "./Modals/AddCategoryModal";
import Image from 'next/image'
import { Category } from "@material-ui/icons";

/* 
  FEATURE 1 TODO:
  Write a query that will get the name AND id of 
  every category. Build this query, and verify it 
  works in Hasura, and then paste the query here.

  Make sure to replace the string that is currently
  in this variable.
*/
export const ManagementContainerQuery = `
query GetCategories {
  category {
    id
    name
  } 
}
`;

export type ManagementCategory = {
  id: number;
  name: string;
};

const CaseManagementContainer: React.FC = (props) => {
  const [addCaseModalOpen, setAddCaseModalOpen] =
    React.useState<boolean>(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] =
    React.useState<boolean>(false);

  /* NOTE: This uses the query defined above in feature 1. */
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });

  const categories: ManagementCategory[] | null = data ? data?.category : null;

  return (
    <>
      <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1em",
        }}>
        <Image
          src="/../public/t4sg_logo.png"
          alt="T4SG Logo"
          width={180}
          height={68}
        />
      </div>
      <h2 className="title">Home Page</h2>
      <br></br>

      {/* CaseCategories */}
      {/*
        FEATURE 1 TODO:
        Use the data from the result of the query to render 
        a CaseCategory for every category in the response.
        Remember, the response is stored in the "data" variable!
      */}

      <Grid container spacing={3} style={{paddingLeft: "2vw", paddingRight: "2vw"}}>
      {fetching ? (
        <p style={{width: "100%", margin: "auto", textAlign: "center"}}>
          Getting your data...
        </p>) :
        error ? (
          <p style={{width: "100%", margin: "auto", textAlign: "center", color: "red"}}>
            There was an error: {error.message}
          </p>) : 
        categories ? (
          categories.map((c : any) => {
              return <Grid item xs={4} key={c.id}>
                <CaseCategory category_id={c.id}></CaseCategory>
              </Grid>
            })
          ) 
        : (
          <p style={{width: "100%", margin: "auto", textAlign: "center", color: "red"}}>Something went wrong</p>
        )}
      </Grid>

      {/* Popup modals for adding cases/categories */}
      <AddCaseModal
        onClose={() => setAddCaseModalOpen(false)}
        open={addCaseModalOpen}
      />

      <AddCategoryModal
        onClose={() => setAddCategoryModalOpen(false)}
        open={addCategoryModalOpen}
      />

      {/* Commands */}
      <Container
        style={{
          width: "100%",
          borderStyle: "solid",
          padding: "0.75rem",
          marginTop: "0.75rem",
          marginBottom: "100px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button variant="outline-dark" onClick={() => setAddCategoryModalOpen(true)}>
          Add Category
        </Button>
        <Button variant="outline-dark" onClick={() => "redirect"}>
          Delete Category
        </Button>
        <Button variant="outline-dark" onClick={() => setAddCaseModalOpen(true)}>
          Add Case
        </Button>
        <Button variant="outline-dark" onClick={() => "redirect"}>
          Delete Case
        </Button>
        <Button variant="outline-dark" onClick={() => "redirect"}>
          Edit Case
        </Button>
      <Footer />
      </Container>
    </>
  );
};
export default CaseManagementContainer;
