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
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import UILink from "@mui/material/Link";

import Link from "next/link";

export default function Projects(props) {
  const [projects, setProjects] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    fetchCount().then(() => fetchProjects().then(() => setLoading(false)));
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
      {loading && (
        <Grid container alignItems="stretch" sx={{ mt: 2 }} spacing={2}>
          {Array(pageSize)
            .fill(0)
            .map((_, index) => {
              return <ProjectSkeleton key={index} />;
            })}
        </Grid>
      )}

      <Grid container alignItems="stretch" sx={{ mt: 2 }} spacing={2}>
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

// Long Text Collapsed Component
const LongText = ({ text, maxLength }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [displayText, setDisplayText] = useState(
    text.substring(0, maxLength).trim()
  );
  const isLongText = text.length > maxLength;

  const handleClick = () => {
    setCollapsed(!collapsed);
    if (collapsed) {
      setDisplayText(text);
    } else {
      setDisplayText(text.substring(0, maxLength).trim());
    }
  };

  return (
    <>
      {displayText}
      {isLongText &&
        (collapsed ? (
          <>
            {"... "}
            <UILink onClick={handleClick} href="#" underline="hover">
              More »
            </UILink>
          </>
        ) : (
          <UILink onClick={handleClick} href="#" underline="hover">
            « Less
          </UILink>
        ))}
    </>
  );
};

const Project = ({ project }) => {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div>
          <CardHeader
            avatar={
              <Avatar alt={project.user.handle} src={project.user.avatar} />
            }
            title={project.user.handle}
            subheader={new Date(project.created_at).toLocaleDateString()}
          />
          <CardContent>
            <Typography variant="h5" component="h2">
              {project.name}
            </Typography>
            <Typography component="p" sx={{ mt: 1 }}>
              {/* 11/24/2021 - long text collapsed */}
              <LongText text={project.description} maxLength={180} />
            </Typography>
          </CardContent>
        </div>
        <Box sx={{ m: 2, mt: "auto" }}>
          <Chip
            size="small"
            label={project.batch.name}
            variant="outlined"
            sx={{ mb: 2 }}
            color="primary"
          />
          <Grid container spacing={2}>
            {project.demo && (
              <Grid item xs={6}>
                <Link href={project.demo}>
                  <a target="_blank">
                    <Button variant="outlined" fullWidth>
                      Demo
                    </Button>
                  </a>
                </Link>
              </Grid>
            )}
            {project.source && (
              <Grid item xs={6}>
                <Link href={project.source}>
                  <a target="_blank">
                    <Button variant="outlined" fullWidth>
                      Source
                    </Button>
                  </a>
                </Link>
              </Grid>
            )}
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

const ProjectSkeleton = () => {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div>
          <CardHeader
            avatar={
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            }
            title={<Skeleton />}
            subheader={<Skeleton />}
          />
          <CardContent>
            <Typography component="h2">
              <Skeleton />
            </Typography>
            <Typography component="p">
              {/* 11/24/2021 - long text collapsed */}
              <Skeleton height={120} />
            </Typography>
          </CardContent>
        </div>
        <Box sx={{ m: 2, mt: "auto" }}>
          <Skeleton width={100} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Skeleton />
            </Grid>
            <Grid item xs={6}>
              <Skeleton />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};
