import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { parseCookies } from "../helpers/";

import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import FormControlLabel from "@mui/material/FormControlLabel";

import Nav from "../components/Nav";

export default function NewProject({ data, batches }) {
  const [batch, setBatch] = useState("");
  const handleBatchChange = (event) => {
    setBatch(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>New | Show Execute Big</title>
        <link rel="icon" type="image/png" href="/icon.png" />
      </Head>

      <main>
        <Nav />

        <Container maxWidth="sm">
          <Box
            sx={{ mt: 5 }}
            component="form"
            noValidate
            autoComplete="off"
            method="POST"
            action="/api/new"
          >
            <h1>Create a New Project</h1>
            <TextField
              required
              label="Project Title"
              fullWidth
              placeholder="Give your project a cute name!"
              sx={{ mb: 3 }}
              name="name"
            />
            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel id="batch-select-label">
                Which project are you submitting to?
              </InputLabel>
              <Select
                labelId="batch-select-label"
                id="batch-select"
                value={batch}
                onChange={handleBatchChange}
                label="Which project are you submitting to?"
                name="batch"
              >
                {batches &&
                  batches.map((batch) => (
                    <MenuItem value={batch.key} key={batch.key}>
                      {batch.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              required
              label="Link to Source"
              fullWidth
              placeholder="Link to your GitHub repository/Replit source"
              type="url"
              sx={{ mb: 3 }}
              name="source"
            />
            <TextField
              required
              label="Link to Demo"
              fullWidth
              placeholder="A video/demo of your working project!"
              type="url"
              sx={{ mb: 3 }}
              name="demo"
            />
            <Button variant="contained" type="submit" label="Submit">
              Submit
            </Button>
          </Box>
        </Container>
      </main>
    </div>
  );
}

NewProject.getInitialProps = async ({ req, res }) => {
  const data = parseCookies(req);
  const timestamp = new Date().getTime();

  if (!data.v) {
    res.writeHead(302, { Location: "/api/auth" });
    res.end();
  } else if (timestamp - data.timestamp > 1000 * 60 * 60 * 24) {
    res.writeHead(302, { Location: "/api/auth" });
    res.end();
  }

  // get active batches
  const batchResponse = await fetch(process.env.BASE_URL + "/api/batches");
  const batches = await batchResponse.json();

  return {
    data: data && data,
    batches: batches && batches,
  };
};
