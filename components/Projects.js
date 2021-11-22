/**
   ALL THE PROJECTS WHOOHOO 
 */

import { useState, useEffect } from "react";
import { supabase } from "../libs/supabaseClient";

// UI
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Link from "next/link";

export default function Projects(props) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    let { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        created_at,
        name,
        batch (
            name
        ), 
        user (
            handle,
            avatar
        ),
        demo,
        source
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.log("error [fetchProjectg]", error);
    } else {
      setProjects(projects);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </Grid>
    </Container>
  );
}

const Project = ({ project }) => {
  return (
    <Grid item xs={4}>
      <Card variant="outlined">
        <CardContent>
          <h1>{project.name}</h1>
          <p>By {project.user.handle}</p>
        </CardContent>
        <CardActions>
          {project.demo && (
            <Button size="medium">
              <Link href={project.demo}>
                <a target="_blank">Demo</a>
              </Link>
            </Button>
          )}
          {project.source && (
            <Button size="medium">
              <Link href={project.source}>
                <a target="_blank">Source</a>
              </Link>
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};
