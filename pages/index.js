import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { parseCookies } from "../helpers/";

import { useState } from "react";
import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Link from "next/link";

import Nav from "../components/Nav";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      last_retrieved: null,
    };
  }

  componentDidMount() {
    getProjects(false).then((projects) => {
      const oldProjects = this.state.projects;
      const mergedProjects = oldProjects.concat(projects.projects);

      this.setState({
        projects: mergedProjects,
        last_retrieved: projects.last_retrieved,
        hasNext: projects.hasNext,
      });
    });
  }

  render() {
    return (
      <div>
        <Head>
          <title>Show Execute Big</title>
          <link rel="icon" type="image/png" href="/icon.png" />
        </Head>

        <main>
          <Nav />
          <Container maxWidth="lg" sx={{ mt: 3 }}>
            <Alert severity="info">
              <AlertTitle>In Very Early Alpha!</AlertTitle>
              Show Execute Big is still in very early alpha. A lot of things are still missing, and
              there may be quite a bit of bugs. Submit your feedback to #suggestions on Discord!
            </Alert>
          </Container>
          <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {this.state.projects &&
                this.state.projects.map((p) => (
                  <Grid item xs={4} key={p.key}>
                    <Card variant="outlined">
                      <CardContent>
                        <h1>{p.name}</h1>
                        <p>By {p.user.handle}</p>
                      </CardContent>
                      <CardActions>
                        {p.demo && (
                          <Button size="medium">
                            <Link href={p.demo}>
                              <a target="_blank">Demo</a>
                            </Link>
                          </Button>
                        )}
                        {p.source && (
                          <Button size="medium">
                            <Link href={p.source}>
                              <a target="_blank">Source</a>
                            </Link>
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {this.state.hasNext && (
              <Box sx={{ mt: 3, mx: "auto", width: 200 }}>
                <Button
                  onClick={async () => {
                    const projects = await getProjects(
                      this.state.last_retrieved
                    );
                    const oldProjects = this.state.projects;

                    const mergedProjects = oldProjects.concat(
                      projects.projects
                    );

                    this.setState({
                      projects: mergedProjects,
                      last_retrieved: projects.last_retrieved,
                      hasNext: projects.hasNext,
                    });
                  }}
                  size="large"
                  variant="contained"
                >
                  Load More
                </Button>
              </Box>
            )}
          </Container>
        </main>
      </div>
    );
  }
}

async function getProjects(last) {
  const projectResponse = await fetch(
    process.env.BASE_URL + "/api/projects" + (last ? "?last=" + last : "")
  );
  const data = await projectResponse.json();

  return data;
}

export default Home;
