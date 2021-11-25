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
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import Link from "next/link";

// Pagination Component
const ControlledPagination = ({ page, totalPages, setCurrentPage }) => {
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={2} sx={{ my: 3, mx: "auto", width: 200 }}>
        <Pagination count={totalPages} page={page} onChange={handleChange} />
      </Stack>
    </Container>
  );
};

export default function Projects(props) {
  const [projects, setProjects] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    fetchCount().then(() => fetchProjects());
  }, [currentPage]);

  const fetchCount = async () => {
    const { count } = await supabase
      .from("projects")
      .select("*", { count: "exact" });

    setCount(count);
  };

  const fetchProjects = async () => {
    // 11/24/2021 - rewrite to use pagination
    const startIndex = currentPage * pageSize - pageSize;
    const endIndex = currentPage * pageSize - 1;

    let { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        created_at,
        name,
        description,
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
      .range(startIndex, endIndex)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("error [fetchProject]", error);
    } else {
      setProjects(projects);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="stretch" sx={{ mt: 2 }}>
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
        <ControlledPagination
          page={currentPage}
          totalPages={Math.ceil(count / pageSize)}
          setCurrentPage={setCurrentPage}
        />
      </Grid>
    </Container>
  );
}

const Project = ({ project }) => {
  return (
    <Grid item xs={12} md={6} lg={4} component={Card} variant="outlined">
      <CardHeader
        avatar={<Avatar alt={project.user.handle} src={project.user.avatar} />}
        title={project.user.handle}
        subheader={new Date(project.created_at).toLocaleString()}
      />
      <CardContent>
        <Typography variant="h5" component="h2">
          {project.name}
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          {project.description}
        </Typography>

        <Chip
          size="small"
          label={project.batch.name}
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </CardContent>
      <CardActions>
        {project.demo && (
          <Button size="medium" variant="outlined">
            <Link href={project.demo}>
              <a target="_blank">Demo</a>
            </Link>
          </Button>
        )}
        {project.source && (
          <Button size="medium" variant="outlined">
            <Link href={project.source}>
              <a target="_blank">Source</a>
            </Link>
          </Button>
        )}
      </CardActions>
    </Grid>
  );
};
