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
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import Link from "next/link";

import Header from "../components/Header";
import Nav from "../components/Nav";
import Projects from "../components/Projects";

class Home extends React.Component {
  render() {
    return (
      <div>
        <Header title="Show Execute Big" />
        <main>
          <Nav />
          <Container maxWidth="lg" sx={{ mt: 3 }}>
            <Alert severity="info">
              <AlertTitle>In Very Early Alpha!</AlertTitle>
              Show Execute Big is still in very early alpha. A lot of things are
              still missing, and there may be quite a bit of bugs. Submit your
              feedback to #suggestions on Discord!
            </Alert>
          </Container>

          <Projects />
        </main>
      </div>
    );
  }
}

export default Home;
