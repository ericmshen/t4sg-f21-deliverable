import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import Alert from 'react-bootstrap/Alert'
import { Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useMutation, useQuery } from "urql";

type CaseCardProps = {
  data: CaseData;
};

export type CaseData = {
  name: string;
  status: string;
  description: string;
  id: number;
};

export const DeleteCaseMutation = `
mutation DeleteCaseMutation($id: bigint!) {
  delete_cases_by_pk(id: $id) { 
    id 
  }
} 
`;

const CaseCard: React.FC<CaseCardProps> = (props) => {
  const caseData = props.data;
  const [result, executeMutation] = useMutation(DeleteCaseMutation);
  const [show, setShow] = React.useState<boolean>(true);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  return ( 
    <div>
      {showAlert ?
      <Alert variant="success" onClose={() => setShowAlert(false)} style={{position: "fixed", top: "0", left: "0", width: "100%", display: "flex", justifyContent: "space-between"}}>
        <Alert.Heading>Successfully deleted case!</Alert.Heading>
        <CloseIcon style={{width: "30px", height: "30px", cursor: "pointer"}} onClick={() => setShowAlert(false)}/>
      </Alert>
    : null }
    { show ? (
      <Container>
      <div style={{ width: "100%", padding: "5px" }}>
        <Card body style={{ backgroundColor: "#e4ebf5" }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <CardTitle tag="h3">{caseData.name}</CardTitle>
            <CloseIcon 
              style={{cursor: "pointer"}}
              onClick={() => {
                executeMutation({
                  id: caseData.id,
                }).then(() => {
                  setShowAlert(true);
                  setShow(false);
                });
              }}
            />
          </Box>

          <CardSubtitle tag="h6" className="mb-2 text-muted">
            {caseData.status}
          </CardSubtitle>
          <CardText>{caseData.description}</CardText>
        </Card>
      </div>
    </Container>
    ) : null }
    </div>
  );
};
export default CaseCard;
