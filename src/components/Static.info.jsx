import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Alert, Avatar } from "@mui/material";

function LinkME(link) {
  return (
    <>
      {link ? (
        <Alert success="success">
          <a href={link} target="_blank" rel="noreferrer">
            Portfolio Link
          </a>
        </Alert>
      ) : (
        <Alert severity="error">No Portfolio Link Found</Alert>
      )}
    </>
  );
}

function HandelMe(data, whatnotfound) {
  return (
    <>
      {data ? (
        <Alert success="success">{`${whatnotfound}: ${data}`}</Alert>
      ) : (
        <Alert severity="error"> {`No ${whatnotfound} Found`}</Alert>
      )}
    </>
  );
}

export default function OutlinedCard(props) {
  const { name, blog, bio, twitter_username, location, img } = props;
  return (
    <React.Fragment>
      {/* {name  && blog && bio && twitter_username && location && img ? (
        <h1>Hi</h1>
      ) : (
        ""
      )} */}
      <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {img ? (
                <span>
                  <Avatar
                    alt={name || "nothing"}
                    src={img}
                    sx={{ width: 256, height: 256, mb: 1.5, margin: "auto" }}
                  />
                </span>
              ) : (
                "No Img Found"
              )}
              <br />
              {HandelMe(name, "Name")}
            </Typography>
            <Typography variant="h5" component="div">
              {HandelMe(location.toUpperCase(), "location")}
            </Typography>
            <Typography sx={{ mb: 1.5, mt: 1.5 }} color="text.secondary">
              {HandelMe(twitter_username, "twitter_username")}{" "}
            </Typography>
            <Typography variant="body2">
              {HandelMe(bio, "bio")}
              <br />
              <small>
                {/*  //{email || <Alert severity="error">No Email Found</Alert>}{" "} */}
              </small>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">{LinkME(blog)}</Button>
          </CardActions>
        </Card>
      </Box>
    </React.Fragment>
  );
}
