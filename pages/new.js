import crypto from "crypto";
import { parseCookies } from "../helpers";

import { useState, useEffect } from "react";
import { supabase } from "../libs/supabaseClient";

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

import Header from "../components/Header";
import Nav from "../components/Nav";

export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  };
};

export default function NewProject(props) {
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState("");
  const [user, setUser] = useState({});

  /* form data custom hook */
  const {
    value: projectName,
    bind: bindProjectName,
    reset: resetProjectName,
  } = useInput("");
  const {
    value: projectDescription,
    bind: bindProjectDescription,
    reset: resetProjectDescription,
  } = useInput("");
  const {
    value: projectSource,
    bind: bindProjectSource,
    reset: resetProjectSource,
  } = useInput("");
  const {
    value: projectDemo,
    bind: bindProjectDemo,
    reset: resetProjectDemo,
  } = useInput("");

  useEffect(() => {
    fetchBatches();
    setUser(props.user);
  }, []);

  /* onload to get batches */
  const fetchBatches = async () => {
    let { data: batches, error } = await supabase.from("batches").select();
    setBatches(batches);
  };

  /* handle selection in form */
  const handleBatchChange = (event) => {
    setBatch(event.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    // redirect to the authorization url

    // validate user signature
    const v_hash = crypto
      .createHash("sha256")
      .update(user.uid + user.iat + process.env.VALIDATION_KEY)
      .digest("hex");

    if (v_hash !== user.v) {
      alert("Invalid login signature!");
      window.location.href = "/api/auth";
      return;
    }

    // create the project
    const project = {
      name: projectName,
      batch: batch,
      source: projectSource,
      demo: projectDemo,
      user: user.uid,
    };

    // insert the project
    const { result, error } = await supabase.from("projects").insert([project]);

    if (error) {
      console.log("error [formSubmission]: ", error);
      return;
    }

    window.location.href = "/";
  };

  return (
    <div>
      <Header title="New | Show Execute Big" />

      <main>
        <Nav />

        <Container maxWidth="sm">
          <Box
            sx={{ mt: 5 }}
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <h1>Create a New Project</h1>

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
                {batches.map((batch) => (
                  <MenuItem value={batch.id} key={batch.id}>
                    {batch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              required
              label="Project Title"
              fullWidth
              placeholder="Give your project a cute name!"
              sx={{ mb: 3 }}
              name="name"
              {...bindProjectName}
            />
            <TextField
              required
              label="Description"
              fullWidth
              placeholder="Tell us more about what you built!"
              sx={{ mb: 3 }}
              rows={4}
              name="description"
              multiline
              {...bindProjectDescription}
            />
            <TextField
              required
              label="Link to Source"
              fullWidth
              placeholder="Link to your GitHub repository/Replit source"
              type="url"
              sx={{ mb: 3 }}
              name="source"
              {...bindProjectSource}
            />
            <TextField
              required
              label="Link to Demo"
              fullWidth
              placeholder="A video/demo of your working project!"
              type="url"
              sx={{ mb: 3 }}
              name="demo"
              {...bindProjectDemo}
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

export const getServerSideProps = async (ctx) => {
  const { req, res } = ctx;

  const cookies = parseCookies(req);

  return {
    props: {
      user: {
        uid: cookies.uid,
        iat: cookies.iat,
        v: cookies.v,
      },
    },
  };
};
